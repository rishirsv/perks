#!/usr/bin/env python3
"""Export source-text artifacts for QA reconciliation."""

from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
import sys
import tempfile
import shutil
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable
from zipfile import ZipFile
from xml.etree import ElementTree


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


@dataclass
class SourceFileRecord:
    kind: str
    index: int
    path: str
    source_name: str
    line_count: int
    char_count: int


def parse_index_list(raw: str) -> list[int]:
    """Parse comma-separated index values and ranges like 1,2,5-7."""
    indices: set[int] = set()
    for token in raw.split(","):
        token = token.strip()
        if not token:
            continue
        if "-" in token:
            start_raw, end_raw = token.split("-", 1)
            start = int(start_raw.strip())
            end = int(end_raw.strip())
            if start > end:
                raise ValueError(f"Invalid index range '{token}'")
            for value in range(start, end + 1):
                indices.add(value)
            continue
        indices.add(int(token))
    return sorted(indices)


def extract_pptx_slide_lines(pptx_path: Path) -> Iterable[tuple[str, str]]:
    with ZipFile(pptx_path, "r") as zf:
        slide_paths = sorted(
            [name for name in zf.namelist() if re.match(r"^ppt/slides/slide\d+\.xml$", name)],
            key=lambda x: int(re.search(r"slide(\d+)\.xml$", x).group(1)),
        )
        for slide_name in slide_paths:
            slide_num = int(re.search(r"slide(\d+)\.xml$", slide_name).group(1))
            xml_data = zf.read(slide_name)
            root = ElementTree.fromstring(xml_data)
            lines = []
            for node in root.iter():
                if node.tag.endswith("}t"):
                    text = normalize_text(node.text or "")
                    if text:
                        lines.append(text)
            yield str(slide_num), "\n".join(lines)


def extract_pdf_page_lines(pdf_path: Path) -> Iterable[tuple[str, str]]:
    proc = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        check=False,
        text=True,
        capture_output=True,
    )
    if proc.returncode != 0 or not proc.stdout:
        proc = subprocess.run(
            ["pdftotext", str(pdf_path), "-"],
            check=False,
            text=True,
            capture_output=True,
        )

    pages = (proc.stdout or "").split("\f")
    for idx, page_text in enumerate(pages, start=1):
        cleaned = normalize_text(page_text.replace("\t", " "))
        yield str(idx), cleaned


def convert_source_to_pdf(source_path: Path, out_dir: Path) -> Path:
    if shutil.which("soffice") is None:
        raise RuntimeError("soffice is required for OCR fallback PDF conversion.")
    proc = subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(out_dir),
            str(source_path),
        ],
        check=False,
        text=True,
        capture_output=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"soffice failed while converting {source_path.name} to PDF for OCR.")

    generated = sorted(out_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not generated:
        raise RuntimeError(f"Failed to convert {source_path.name} to PDF for OCR.")
    return generated[0]


def convert_legacy_ppt_to_pptx(source_path: Path, tmp_root: Path) -> Path | None:
    if shutil.which("soffice") is None:
        return None
    converted = tmp_root / f"{source_path.stem}_converted.pptx"
    proc = subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "pptx",
            "--outdir",
            str(tmp_root),
            str(source_path),
        ],
        check=False,
        text=True,
        capture_output=True,
    )
    if proc.returncode != 0:
        return None
    generated = list(tmp_root.glob("*.pptx"))
    return generated[0] if generated else None


def ocr_slide_from_pdf(pdf_path: Path, slide_num: int) -> str:
    """Render one slide/page and run OCR via tesseract."""
    if shutil.which("pdftoppm") is None:
        raise RuntimeError("pdftoppm is required for slide OCR.")
    if shutil.which("tesseract") is None:
        raise RuntimeError("tesseract is required for slide OCR.")
    with tempfile.TemporaryDirectory(prefix=f"report-source-text-ocr-{slide_num}-") as tmp_dir:
        tmp_root = Path(tmp_dir)
        image_prefix = tmp_root / f"slide-{slide_num}"
        proc = subprocess.run(
            [
                "pdftoppm",
                "-r",
                "220",
                "-png",
                "-f",
                str(slide_num),
                "-l",
                str(slide_num),
                str(pdf_path),
                str(image_prefix),
            ],
            check=False,
            text=True,
            capture_output=True,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"pdftoppm failed for slide {slide_num}: {proc.stderr or proc.stdout}")

        images = sorted(tmp_root.glob("*.png"))
        if not images:
            raise RuntimeError(f"No image created for slide {slide_num}")
        image_path = images[0]

        proc = subprocess.run(
            ["tesseract", str(image_path), "stdout", "-l", "eng"],
            check=False,
            text=True,
            capture_output=True,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"Tesseract failed for slide {slide_num}: {proc.stderr or proc.stdout}")

        return normalize_text(proc.stdout or "")


def build_manifest(records: list[SourceFileRecord], out_dir: Path) -> None:
    manifest_path = out_dir / "manifest.json"
    payload = {
        "artifact_root": str(out_dir),
        "files": [asdict(record) for record in records],
        "total_files": len(records),
    }
    manifest_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def write_records(
    kind: str,
    source_path: Path,
    out_dir: Path,
    ocr_indices: list[int] | None = None,
    ocr_pdf_path: Path | None = None,
) -> None:
    out_subdir = out_dir / kind
    out_subdir.mkdir(parents=True, exist_ok=True)
    records: list[SourceFileRecord] = []

    if kind == "pptx":
        iterator = extract_pptx_slide_lines(source_path)
        file_tmpl = "slide-{index:03d}.txt"
    else:
        iterator = extract_pdf_page_lines(source_path)
        file_tmpl = "page-{index:03d}.txt"

    for index_text, content in iterator:
        index = int(index_text)
        final_content = content

        if kind == "pptx" and index in set(ocr_indices or []):
            if ocr_pdf_path is None:
                raise RuntimeError("OCR requested but no PDF source was prepared.")
            ocr_text = ocr_slide_from_pdf(ocr_pdf_path, index)
            if ocr_text:
                final_content = (final_content + "\n\n[OCR_EXTRACTED_TEXT]\n" + ocr_text).strip()

        target = out_subdir / file_tmpl.format(index=index)
        target.write_text(final_content + ("\n" if final_content else ""), encoding="utf-8")
        records.append(
            SourceFileRecord(
                kind=kind,
                index=index,
                path=f"{kind}/{target.name}",
                source_name=f"{kind.upper()} {index_text}",
                line_count=final_content.count("\n") + 1 if final_content else 0,
                char_count=len(final_content),
            )
        )

    build_manifest(records, out_dir)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export report source-text for manual QA.")
    parser.add_argument("--source", required=True, help="Path to source report (.pptx, .ppt, .pdf)")
    parser.add_argument("--out-dir", required=True, help="Directory to store source-text artifacts")
    parser.add_argument(
        "--ocr-slides",
        default="",
        help=(
            "Comma-separated slide numbers (supports ranges), for example: "
            "'16,17,21-23'. Only used for PPT/PPTX sources."
        ),
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source = Path(args.source)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    ocr_indices = parse_index_list(args.ocr_slides) if args.ocr_slides.strip() else []
    ext = source.suffix.lower()

    if ext in {".pptx", ".ppt"}:
        source_path = source
        legacy_tmp = None
        ocr_pdf_tmp = None
        ocr_pdf_path: Path | None = None

        if ext == ".ppt":
            legacy_tmp = tempfile.TemporaryDirectory(prefix="report-source-text-")
            converted = convert_legacy_ppt_to_pptx(source, Path(legacy_tmp.name))
            if converted is None:
                raise SystemExit("Failed to convert legacy PPT to PPTX via soffice.")
            source_path = converted

        if ocr_indices:
            ocr_pdf_tmp = tempfile.TemporaryDirectory(prefix="report-source-text-ocrpdf-")
            ocr_pdf_path = convert_source_to_pdf(source_path, Path(ocr_pdf_tmp.name))

        try:
            write_records("pptx", source_path, out_dir, ocr_indices, ocr_pdf_path)
        finally:
            if ocr_pdf_tmp is not None:
                ocr_pdf_tmp.cleanup()
            if legacy_tmp is not None:
                legacy_tmp.cleanup()
        return 0

    if ext == ".pdf":
        if ocr_indices:
            print(
                "Warning: --ocr-slides targets PPT/PPTX slides. "
                "For PDF, use --ocr-slides with page indexes only if you add --source as a rendered PDF and "
                "post-process manually.",
                file=sys.stderr,
            )
        write_records("pdf", source, out_dir)
        return 0

    raise SystemExit(f"Unsupported file extension: {ext}")


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as err:  # noqa: BLE001
        raise SystemExit(str(err))
