"""Sequential report extraction and verification pipeline."""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from dataclasses import dataclass, replace
from datetime import datetime, timezone
import html
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
from typing import Any
from xml.etree import ElementTree
from zipfile import ZipFile

import fitz  # type: ignore
from PIL import Image  # type: ignore

from .catalog import CatalogLine, normalize_for_match, write_json, write_jsonl
from .constants import (
    CANONICAL_SECTION_ORDER,
    FORBIDDEN_OUTPUT_CLASSES,
    LEGAL_EXCLUSION_PATTERNS,
    SECTION_ALIASES,
    THRESHOLDS,
)
from .mapping import MappingThresholds, assign_sections
from .render import RenderOutput, render_markdown

# Silence verbose MuPDF structure warnings; warnings are captured in manifests.
try:
    fitz.TOOLS.mupdf_display_warnings(False)
except Exception:
    pass


SUPPORTED_EXTENSIONS = {".pdf", ".pptx", ".ppt"}


@dataclass
class ExtractionBundle:
    report_id: str
    source_file: str
    source_format: str
    method_used: str
    catalog_lines: list[CatalogLine]
    selected_lines: list[CatalogLine]
    total_pages: int
    exclusion_stats: dict[str, int]
    warnings: list[str]
    preferred_source_kind: str
    source_counts: dict[str, int]


@dataclass(frozen=True)
class PipelineConfig:
    evidence_profile: str
    verbatim_mode: str
    fail_closed: bool
    allow_ocr_primary: bool


def utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def slugify_report_id(filename: str) -> str:
    stem = Path(filename).stem.lower()
    stem = re.sub(r"[^a-z0-9]+", "-", stem)
    stem = re.sub(r"-+", "-", stem).strip("-")
    return stem or "report"


def ensure_dependencies() -> None:
    missing_cmds: list[str] = []
    for cmd in ("soffice", "pdftotext", "pdftoppm"):
        if shutil.which(cmd) is None:
            missing_cmds.append(cmd)
    if missing_cmds:
        raise RuntimeError(f"Missing required system dependencies: {', '.join(missing_cmds)}")


def list_report_files(reports_dir: Path, exclude_substrings: list[str] | None = None) -> list[Path]:
    exclude_substrings = [x.casefold() for x in (exclude_substrings or []) if x.strip()]
    reports: list[Path] = []
    for p in reports_dir.iterdir():
        if not p.is_file():
            continue
        if p.name.startswith("."):
            continue
        if p.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        low = p.name.casefold()
        if any(token in low for token in exclude_substrings):
            continue
        reports.append(p)
    return sorted(reports, key=lambda p: p.name.casefold())


def looks_like_table_row(text: str) -> bool:
    if "|" in text or "\t" in text:
        return True
    tokens = text.split()
    if len(tokens) < 3:
        return False
    if len(tokens) <= 3:
        num_like = sum(
            1 for t in tokens if re.fullmatch(r"[\(\-]?\$?\d[\d,.\)%\-]*", t.replace("'", ""))
        )
        if num_like >= 1:
            return True
    numeric_tokens = 0
    for t in tokens:
        cleaned = t.replace(",", "").replace(".", "").replace("%", "").replace("$", "")
        if cleaned.startswith("(") and cleaned.endswith(")"):
            cleaned = cleaned[1:-1]
        if cleaned.lstrip("-").isdigit():
            numeric_tokens += 1
    return numeric_tokens >= max(2, math.ceil(len(tokens) * 0.45))


def looks_like_page_number(text: str) -> bool:
    low = text.lower().strip()
    if re.fullmatch(r"page\s*\d+(\s*of\s*\d+)?", low):
        return True
    if re.fullmatch(r"\d+\s*/\s*\d+", low):
        return True
    return False


def is_legal_line(text: str) -> bool:
    return any(p.search(text) for p in LEGAL_EXCLUSION_PATTERNS)


def is_navigation_line(text: str) -> bool:
    low = text.lower()
    if " | " in text and text.count("|") >= 2:
        return True
    if low in {"contents", "glossary", "read more", "kpmg contacts"}:
        return True
    if "for illustrative purposes only" in low:
        return True
    if "draft for discussion purposes only" in low:
        return True
    if "private & confidential" in low or "private and confidential" in low:
        return True
    if "executive summary |" in low:
        return True
    return False


def should_exclude_line(text: str) -> tuple[bool, str]:
    if not text:
        return True, "empty"
    if len(text) <= 2:
        return True, "short_noise"
    if len(text.split()) <= 2 and any(ch.isdigit() for ch in text):
        return True, "numeric_stub"
    if text.lower() in {"draft", "contents"}:
        return True, "navigation"
    if re.fullmatch(r"[\$\d,().\- ]{2,}", text):
        return True, "numeric_stub"
    if looks_like_page_number(text):
        return True, "page_number"
    if is_legal_line(text):
        return True, "legal"
    if is_navigation_line(text):
        return True, "navigation"
    if re.match(r"^source\s*:", text.lower()):
        return True, "source_footnote"
    if looks_like_table_row(text):
        return True, "table_like"
    return False, ""


def bbox_intersects(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> bool:
    ax0, ay0, ax1, ay1 = a
    bx0, by0, bx1, by1 = b
    return not (ax1 <= bx0 or bx1 <= ax0 or ay1 <= by0 or by1 <= ay0)


def find_table_bboxes(page: fitz.Page) -> list[tuple[float, float, float, float]]:
    bboxes: list[tuple[float, float, float, float]] = []
    finder = getattr(page, "find_tables", None)
    if not callable(finder):
        return bboxes
    try:
        tables = finder()
        for table in getattr(tables, "tables", []):
            bbox = getattr(table, "bbox", None)
            if bbox and len(bbox) == 4:
                bboxes.append((float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3])))
    except Exception:
        return bboxes
    return bboxes


def likely_body_zone(y0: float, y1: float, page_h: float) -> bool:
    top_ok = y0 >= THRESHOLDS.header_zone_ratio * page_h
    bottom_ok = y1 <= THRESHOLDS.footer_zone_ratio * page_h
    return top_ok and bottom_ok


def _derive_exclusion_reason(text_norm: str, class_flags: list[str]) -> str | None:
    for flag in ("table_region", "header_footer_zone", "repeated_header_footer"):
        if flag in class_flags:
            return flag

    excluded, reason = should_exclude_line(text_norm)
    if excluded:
        return reason
    return None


def _finalize_pdf_rows(
    rows: list[dict[str, Any]],
    source_file: str,
    source_kind: str,
    page_count: int,
) -> tuple[list[CatalogLine], dict[str, int]]:
    exclusion_stats = Counter()
    repeated: set[str] = set()
    pages_by_text: dict[str, set[int]] = defaultdict(set)
    for row in rows:
        pages_by_text[row["text_norm"].lower()].add(row["page_num"])

    min_pages = max(
        THRESHOLDS.repeated_line_min_pages,
        math.ceil(max(page_count, 1) * THRESHOLDS.repeated_line_page_ratio),
    )
    for key, pages in pages_by_text.items():
        if len(pages) >= min_pages:
            repeated.add(key)

    counters: dict[int, int] = defaultdict(int)
    catalog: list[CatalogLine] = []
    for row in rows:
        page_num = int(row["page_num"])
        counters[page_num] += 1

        class_flags = list(row.get("class_flags", []))
        low = row["text_norm"].lower()
        y0 = float(row.get("y0", 0.0))
        y1 = float(row.get("y1", 0.0))
        page_h = float(row.get("page_height", 0.0))
        if low in repeated and (
            y0 <= THRESHOLDS.header_zone_ratio * max(page_h, 1.0)
            or y1 >= THRESHOLDS.footer_zone_ratio * max(page_h, 1.0)
        ):
            class_flags.append("repeated_header_footer")

        exclusion_reason = _derive_exclusion_reason(row["text_norm"], class_flags)
        if exclusion_reason:
            class_flags.append(exclusion_reason)
            exclusion_stats[exclusion_reason] += 1
        class_flags = sorted(set(class_flags))

        included_candidate = exclusion_reason is None and not any(
            f in FORBIDDEN_OUTPUT_CLASSES for f in class_flags
        )
        line_id = f"{source_kind}:{page_num:03d}:{counters[page_num]:04d}"
        catalog.append(
            CatalogLine(
                line_id=line_id,
                text_raw=row["text_raw"],
                text_norm=row["text_norm"],
                source_kind=source_kind,
                source_file=source_file,
                page_or_slide=page_num,
                bbox=row.get("bbox"),
                class_flags=class_flags,
                included_candidate=included_candidate,
                exclusion_reason=exclusion_reason,
            )
        )
    return catalog, dict(exclusion_stats)


def extract_pdf_catalog_lines(
    pdf_path: Path,
    source_file: str,
    source_kind: str = "pdf_text",
) -> tuple[list[CatalogLine], int, dict[str, int]]:
    doc = fitz.open(str(pdf_path))
    rows: list[dict[str, Any]] = []

    for page_idx in range(doc.page_count):
        page = doc[page_idx]
        page_height = float(page.rect.height)
        table_boxes = find_table_bboxes(page)
        page_dict = page.get_text("dict")

        for block in page_dict.get("blocks", []):
            if block.get("type") != 0:
                continue
            for line in block.get("lines", []):
                bbox = line.get("bbox", (0, 0, 0, 0))
                line_bbox = (float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3]))
                spans = line.get("spans", [])
                raw_text = "".join(span.get("text", "") for span in spans)
                text_raw = raw_text.strip()
                text_norm = normalize_for_match(text_raw)
                if not text_norm:
                    continue

                class_flags: list[str] = []
                if any(bbox_intersects(line_bbox, tb) for tb in table_boxes):
                    class_flags.append("table_region")
                if not likely_body_zone(line_bbox[1], line_bbox[3], page_height):
                    class_flags.append("header_footer_zone")

                rows.append(
                    {
                        "text_raw": text_raw,
                        "text_norm": text_norm,
                        "page_num": page_idx + 1,
                        "y0": line_bbox[1],
                        "y1": line_bbox[3],
                        "page_height": page_height,
                        "bbox": line_bbox,
                        "class_flags": class_flags,
                    }
                )

    if rows:
        catalog, stats = _finalize_pdf_rows(rows, source_file, source_kind, doc.page_count)
        return catalog, doc.page_count, stats

    # Fallback for documents where structured extraction returns no text rows.
    proc = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        capture_output=True,
        text=True,
        errors="ignore",
        check=False,
    )
    pages = (proc.stdout or "").split("\f")
    for page_idx, page_text in enumerate(pages, start=1):
        for raw_line in page_text.splitlines():
            text_raw = raw_line.strip()
            text_norm = normalize_for_match(text_raw)
            if not text_norm:
                continue
            rows.append(
                {
                    "text_raw": text_raw,
                    "text_norm": text_norm,
                    "page_num": page_idx,
                    "y0": 0.0,
                    "y1": 0.0,
                    "page_height": 1.0,
                    "bbox": None,
                    "class_flags": [],
                }
            )

    catalog, stats = _finalize_pdf_rows(rows, source_file, source_kind, len(pages))
    return catalog, len(pages), stats


def extract_pptx_xml_catalog_lines(
    pptx_path: Path,
    source_file: str,
) -> tuple[list[CatalogLine], dict[str, int]]:
    catalog: list[CatalogLine] = []
    exclusion_stats = Counter()

    with ZipFile(pptx_path, "r") as zf:
        slide_paths = sorted(
            [name for name in zf.namelist() if re.match(r"^ppt/slides/slide\d+\.xml$", name)],
            key=lambda x: int(re.search(r"slide(\d+)\.xml$", x).group(1)),
        )
        for slide_name in slide_paths:
            slide_num = int(re.search(r"slide(\d+)\.xml$", slide_name).group(1))
            xml_data = zf.read(slide_name)
            root = ElementTree.fromstring(xml_data)
            line_idx = 0
            for node in root.iter():
                if not node.tag.endswith("}t"):
                    continue
                text_raw = html.unescape(node.text or "").strip()
                text_norm = normalize_for_match(text_raw)
                if not text_norm:
                    continue

                line_idx += 1
                excluded, reason = should_exclude_line(text_norm)
                class_flags: list[str] = []
                if excluded:
                    class_flags.append(reason)
                    exclusion_stats[reason] += 1

                included_candidate = not excluded and not any(
                    f in FORBIDDEN_OUTPUT_CLASSES for f in class_flags
                )
                catalog.append(
                    CatalogLine(
                        line_id=f"pptx_xml:{slide_num:03d}:{line_idx:04d}",
                        text_raw=text_raw,
                        text_norm=text_norm,
                        source_kind="pptx_xml",
                        source_file=source_file,
                        page_or_slide=slide_num,
                        bbox=None,
                        class_flags=class_flags,
                        included_candidate=included_candidate,
                        exclusion_reason=reason if excluded else None,
                    )
                )
    return catalog, dict(exclusion_stats)


def run_soffice_convert_to_pdf(source_path: Path, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    attempted: list[Path] = [source_path]
    if source_path.suffix.lower() == ".pptx":
        alt = out_dir / f"{source_path.stem}.ppt"
        shutil.copyfile(source_path, alt)
        attempted.append(alt)

    last_err = ""
    for candidate in attempted:
        proc = subprocess.run(
            [
                "soffice",
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                str(out_dir),
                str(candidate),
            ],
            capture_output=True,
            text=True,
            errors="ignore",
            check=False,
        )
        last_err = (proc.stderr or proc.stdout or "").strip()
        pdfs = sorted(out_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
        if pdfs:
            return pdfs[0]
    raise RuntimeError(f"soffice conversion produced no PDF for {source_path.name}. Last output: {last_err}")


def select_render_lines(
    catalog_lines: list[CatalogLine], source_format: str, allow_ocr_primary: bool
) -> tuple[list[CatalogLine], str]:
    preferred_order = ["pdf_text"]
    if source_format == "pptx":
        preferred_order = ["pptx_xml", "pdf_text"]
    elif source_format == "ppt":
        preferred_order = ["pdf_text"]

    preferred_source_kind = preferred_order[0]
    selected_pool: list[CatalogLine] = []
    for kind in preferred_order:
        subset = [line for line in catalog_lines if line.source_kind == kind]
        if subset:
            preferred_source_kind = kind
            selected_pool = subset
            break
    if not selected_pool:
        selected_pool = catalog_lines

    selected: list[CatalogLine] = []
    for line in selected_pool:
        if not line.included_candidate:
            continue
        if line.source_kind == "ocr" and not allow_ocr_primary:
            continue
        if any(flag in FORBIDDEN_OUTPUT_CLASSES for flag in line.class_flags):
            continue
        if selected and selected[-1].text_norm == line.text_norm:
            continue
        selected.append(line)
    return selected, preferred_source_kind


def transform_for_verbatim_mode(lines: list[CatalogLine], verbatim_mode: str) -> list[CatalogLine]:
    if verbatim_mode == "strict":
        return lines
    if verbatim_mode == "normalized":
        transformed: list[CatalogLine] = []
        for line in lines:
            transformed.append(replace(line, text_raw=line.text_norm))
        return transformed
    return lines


def extract_report_catalog(report_path: Path, tmp_dir: Path, config: PipelineConfig) -> ExtractionBundle:
    source_format = report_path.suffix.lower().lstrip(".")
    report_id = slugify_report_id(report_path.name)
    warnings: list[str] = []

    if source_format == "pdf":
        pdf_lines, pages, pdf_stats = extract_pdf_catalog_lines(
            report_path, source_file=report_path.name, source_kind="pdf_text"
        )
        selected, preferred_kind = select_render_lines(pdf_lines, source_format, config.allow_ocr_primary)
        selected = transform_for_verbatim_mode(selected, config.verbatim_mode)
        if not selected:
            warnings.append("No renderable body text detected in PDF source.")
        return ExtractionBundle(
            report_id=report_id,
            source_file=report_path.name,
            source_format=source_format,
            method_used="fitz_pdf_catalog",
            catalog_lines=pdf_lines,
            selected_lines=selected,
            total_pages=pages,
            exclusion_stats=pdf_stats,
            warnings=warnings,
            preferred_source_kind=preferred_kind,
            source_counts={
                "pdf_text": sum(1 for line in pdf_lines if line.source_kind == "pdf_text"),
            },
        )

    if source_format in {"pptx", "ppt"}:
        xml_lines: list[CatalogLine] = []
        xml_stats: dict[str, int] = {}
        if source_format == "pptx":
            xml_lines, xml_stats = extract_pptx_xml_catalog_lines(report_path, source_file=report_path.name)

        converted_pdf = run_soffice_convert_to_pdf(report_path, tmp_dir)
        pdf_lines, pages, pdf_stats = extract_pdf_catalog_lines(
            converted_pdf, source_file=report_path.name, source_kind="pdf_text"
        )
        catalog_lines = pdf_lines + xml_lines
        selected, preferred_kind = select_render_lines(catalog_lines, source_format, config.allow_ocr_primary)
        selected = transform_for_verbatim_mode(selected, config.verbatim_mode)

        combined_stats = Counter(pdf_stats)
        combined_stats.update(xml_stats)
        if not selected:
            warnings.append("No renderable body text detected after presentation extraction.")

        return ExtractionBundle(
            report_id=report_id,
            source_file=report_path.name,
            source_format=source_format,
            method_used="presentation_dual_source_catalog",
            catalog_lines=catalog_lines,
            selected_lines=selected,
            total_pages=pages,
            exclusion_stats=dict(combined_stats),
            warnings=warnings,
            preferred_source_kind=preferred_kind,
            source_counts={
                "pdf_text": sum(1 for line in catalog_lines if line.source_kind == "pdf_text"),
                "pptx_xml": sum(1 for line in catalog_lines if line.source_kind == "pptx_xml"),
            },
        )

    raise ValueError(f"Unsupported source format: {source_format}")


def _page_sort_key(path: Path) -> int:
    m = re.search(r"(\d+)$", path.stem)
    return int(m.group(1)) if m else 0


def render_pdf_pages_to_ppm(pdf_path: Path, pages_dir: Path, dpi: int = 160) -> list[Path]:
    pages_dir.mkdir(parents=True, exist_ok=True)
    prefix = pages_dir / "page"
    proc = subprocess.run(
        ["pdftoppm", "-r", str(dpi), "-forcenum", str(pdf_path), str(prefix)],
        capture_output=True,
        text=True,
        errors="ignore",
        check=False,
    )
    if proc.returncode != 0:
        msg = (proc.stderr or proc.stdout or "").strip()
        raise RuntimeError(f"pdftoppm failed for {pdf_path.name}: {msg}")
    outputs = sorted(pages_dir.glob("page-*.ppm"), key=_page_sort_key)
    if not outputs:
        raise RuntimeError(f"pdftoppm produced no PPM pages for {pdf_path.name}")
    return outputs


def build_montages(page_images: list[Path], montage_dir: Path, columns: int = 3, rows: int = 3) -> list[Path]:
    montage_dir.mkdir(parents=True, exist_ok=True)
    per_sheet = columns * rows
    montage_paths: list[Path] = []

    for start in range(0, len(page_images), per_sheet):
        chunk = page_images[start : start + per_sheet]
        images = [Image.open(p).convert("RGB") for p in chunk]
        resized: list[Image.Image] = []
        for im in images:
            copy = im.copy()
            copy.thumbnail((1000, 1000))
            resized.append(copy)

        max_w = max(im.width for im in resized)
        max_h = max(im.height for im in resized)
        padding = 24
        canvas_w = columns * max_w + (columns + 1) * padding
        canvas_h = rows * max_h + (rows + 1) * padding
        canvas = Image.new("RGB", (canvas_w, canvas_h), color="white")

        for idx, im in enumerate(resized):
            row = idx // columns
            col = idx % columns
            x = padding + col * (max_w + padding)
            y = padding + row * (max_h + padding)
            canvas.paste(im, (x, y))

        out_path = montage_dir / f"montage-{(start // per_sheet) + 1:02d}.png"
        canvas.save(out_path)
        montage_paths.append(out_path)

        for im in images:
            im.close()
        for im in resized:
            im.close()

    return montage_paths


def source_to_pdf_for_verification(source_path: Path, tmp_dir: Path) -> Path:
    if source_path.suffix.lower() == ".pdf":
        return source_path
    return run_soffice_convert_to_pdf(source_path, tmp_dir)


def write_review_notes(path: Path, report_id: str, source_file: str) -> None:
    content = f"""# Verification Notes: {report_id}

- Source file: `{source_file}`
- Reviewer: `<required>`
- Review status: `<pass|needs_revision|blocked>`
- Review date: `<YYYY-MM-DD>`

## Checklist

- [ ] Reviewed full montage PNGs against extracted markdown
- [ ] Confirmed body text is captured appropriately
- [ ] Confirmed table text is excluded
- [ ] Confirmed image-derived text is excluded
- [ ] Confirmed legal/footer/navigation noise is excluded
- [ ] Completed source-to-extraction coverage map
- [ ] Ran `scripts/qa_provenance.py` and reviewed results
- [ ] Ran `scripts/qa_gates.py` and confirmed all gates passed

## Notes

- <add findings here>
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def section_counts(sections: dict[str, list[CatalogLine]]) -> dict[str, int]:
    return {section: len(items) for section, items in sections.items()}


def build_section_accounting(
    sections: dict[str, list[CatalogLine]],
    render_trace: list[dict[str, Any]],
) -> dict[str, Any]:
    expected_by_section: dict[str, list[str]] = {}
    expected_text_by_line_id: dict[str, str] = {}
    for section, items in sections.items():
        expected_ids: list[str] = []
        for item in items:
            if section == "Appendices" and "appendix" in item.text_raw.lower():
                continue
            expected_ids.append(item.line_id)
            expected_text_by_line_id[item.line_id] = item.text_raw
        expected_by_section[section] = expected_ids

    rendered_by_section: dict[str, list[str]] = defaultdict(list)
    for row in render_trace:
        section = str(row.get("section", ""))
        line_id = str(row.get("line_id", ""))
        if not section or not line_id:
            continue
        rendered_by_section[section].append(line_id)

    sections_payload: dict[str, Any] = {}
    total_expected = 0
    total_rendered = 0
    total_missing = 0
    total_unexpected = 0

    for section in CANONICAL_SECTION_ORDER:
        expected_ids = expected_by_section.get(section, [])
        rendered_ids = rendered_by_section.get(section, [])
        expected_set = set(expected_ids)
        rendered_set = set(rendered_ids)

        missing_ids = sorted(expected_set - rendered_set)
        unexpected_ids = sorted(rendered_set - expected_set)

        total_expected += len(expected_ids)
        total_rendered += len(rendered_ids)
        total_missing += len(missing_ids)
        total_unexpected += len(unexpected_ids)

        sections_payload[section] = {
            "expected_line_ids": expected_ids,
            "rendered_line_ids": rendered_ids,
            "missing_line_ids": missing_ids,
            "unexpected_line_ids": unexpected_ids,
            "missing_text_sample": [expected_text_by_line_id.get(line_id, "") for line_id in missing_ids[:20]],
        }

    status = "pass" if total_missing == 0 and total_unexpected == 0 else "needs_revision"
    return {
        "status": status,
        "summary": {
            "expected_lines": total_expected,
            "rendered_lines": total_rendered,
            "missing_lines": total_missing,
            "unexpected_lines": total_unexpected,
        },
        "sections": sections_payload,
    }


def build_report_manifest(
    extraction: ExtractionBundle,
    section_counts_map: dict[str, int],
    render_output: RenderOutput,
    verification_status: str,
    source_path: Path,
    config: PipelineConfig,
    artifact_paths: dict[str, str],
) -> dict[str, Any]:
    return {
        "report_id": extraction.report_id,
        "source_file": extraction.source_file,
        "source_path": str(source_path.resolve()),
        "source_format": extraction.source_format,
        "method_used": extraction.method_used,
        "verbatim_mode": config.verbatim_mode,
        "evidence_profile": config.evidence_profile,
        "fail_closed": config.fail_closed,
        "allow_ocr_primary": config.allow_ocr_primary,
        "preferred_source_kind": extraction.preferred_source_kind,
        "source_counts": extraction.source_counts,
        "total_pages": extraction.total_pages,
        "line_count": sum(section_counts_map.values()),
        "catalog_line_count": len(extraction.catalog_lines),
        "section_counts": section_counts_map,
        "section_disposition": render_output.section_disposition,
        "missing_sections": [sec for sec, status in render_output.section_disposition.items() if status == "not_present"],
        "exclusion_stats": extraction.exclusion_stats,
        "warnings": extraction.warnings,
        "artifact_paths": artifact_paths,
        "verification_status": verification_status,
        "updated_at": utc_now(),
    }


def write_processing_order(files: list[Path], manifests_dir: Path) -> list[dict[str, Any]]:
    order: list[dict[str, Any]] = []
    for idx, report in enumerate(files, start=1):
        order.append(
            {
                "index": idx,
                "source_file": report.name,
                "source_path": str(report.resolve()),
                "format": report.suffix.lower().lstrip("."),
                "report_id": slugify_report_id(report.name),
            }
        )
    write_json(manifests_dir / "processing-order.json", order)
    return order


def write_tracker(rows: list[dict[str, str]], manifests_dir: Path) -> None:
    lines = [
        "# Extraction Tracker",
        "",
        "| Report File | Report ID | Status | Output File | Notes |",
        "|---|---|---|---|---|",
    ]
    for row in rows:
        lines.append(
            f"| {row['source_file']} | {row['report_id']} | {row['status']} | {row['output_file']} | {row['notes']} |"
        )
    lines.append("")
    (manifests_dir / "tracker.md").write_text("\n".join(lines), encoding="utf-8")
    write_json(manifests_dir / "tracker.json", rows)


def process_one_report(
    source_path: Path,
    extracted_dir: Path,
    verification_root: Path,
    manifests_dir: Path,
    tmp_root: Path,
    config: PipelineConfig,
) -> dict[str, str]:
    report_id = slugify_report_id(source_path.name)
    tmp_dir = tmp_root / report_id
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
    tmp_dir.mkdir(parents=True, exist_ok=True)

    try:
        extraction = extract_report_catalog(source_path, tmp_dir, config)
        mapping_result = assign_sections(
            lines=extraction.selected_lines,
            canonical_sections=CANONICAL_SECTION_ORDER,
            section_aliases=SECTION_ALIASES,
            thresholds=MappingThresholds(
                heading_fuzzy_match_min=THRESHOLDS.heading_fuzzy_match_min,
                heading_max_words=THRESHOLDS.heading_max_words,
                heading_max_chars=THRESHOLDS.heading_max_chars,
                heading_max_digit_ratio=THRESHOLDS.heading_max_digit_ratio,
            ),
        )
        render_output = render_markdown(
            report_id=report_id,
            source_file=source_path.name,
            sections=mapping_result.sections,
            heading_hits=mapping_result.heading_hits,
            section_order=CANONICAL_SECTION_ORDER,
            extra_metadata={
                "VERBATIM_MODE": config.verbatim_mode,
                "EVIDENCE_PROFILE": config.evidence_profile,
                "FAIL_CLOSED": str(config.fail_closed).lower(),
            },
        )
        section_accounting = build_section_accounting(mapping_result.sections, render_output.trace)

        output_md = extracted_dir / f"{report_id}.md"
        output_md.parent.mkdir(parents=True, exist_ok=True)
        output_md.write_text(render_output.markdown, encoding="utf-8")

        verification_dir = verification_root / report_id
        pages_dir = verification_dir / "pages"
        montage_dir = verification_dir / "montage"
        catalog_dir = verification_dir / "catalog"
        mapping_dir = verification_dir / "mapping"
        render_dir = verification_dir / "render"
        qa_dir = verification_dir / "qa"
        verification_dir.mkdir(parents=True, exist_ok=True)

        write_jsonl(catalog_dir / "line-catalog.jsonl", extraction.catalog_lines)
        if config.evidence_profile == "full":
            write_jsonl(
                catalog_dir / "excluded-lines.jsonl",
                [line for line in extraction.catalog_lines if not line.included_candidate],
            )
            write_jsonl(catalog_dir / "selected-lines.jsonl", extraction.selected_lines)
        write_json(render_dir / "render-trace.json", render_output.trace)
        write_json(mapping_dir / "section-accounting.json", section_accounting)
        write_json(
            mapping_dir / "section-map.json",
            {
                "report_id": report_id,
                "heading_hits": mapping_result.heading_hits,
                "heading_events": mapping_result.heading_events,
                "unresolved_headings": mapping_result.unresolved_headings,
                "section_disposition": render_output.section_disposition,
                "section_accounting_status": section_accounting["status"],
            },
        )
        write_json(
            qa_dir / "gates.json",
            {
                "status": "pending",
                "report_id": report_id,
                "generated_at": utc_now(),
                "notes": "Run scripts/qa_gates.py to evaluate fail-closed gates.",
            },
        )

        counts = section_counts(mapping_result.sections)
        verification_payload = {
            "report_id": report_id,
            "source_file": source_path.name,
            "status": "pending_second_pass",
            "page_count": 0,
            "markdown_path": str(output_md),
            "montage_files": [],
            "section_coverage": counts,
            "section_disposition": render_output.section_disposition,
            "missing_sections": [sec for sec, count in counts.items() if count == 0],
            "artifact_paths": {
                "catalog": str(catalog_dir / "line-catalog.jsonl"),
                "excluded_catalog": str(catalog_dir / "excluded-lines.jsonl")
                if config.evidence_profile == "full"
                else None,
                "selected_catalog": str(catalog_dir / "selected-lines.jsonl")
                if config.evidence_profile == "full"
                else None,
                "section_map": str(mapping_dir / "section-map.json"),
                "section_accounting": str(mapping_dir / "section-accounting.json"),
                "render_trace": str(render_dir / "render-trace.json"),
                "qa_gates": str(qa_dir / "gates.json"),
            },
            "reviewer": None,
            "review_notes_file": str(verification_dir / "review-notes.md"),
            "created_at": utc_now(),
            "updated_at": utc_now(),
        }

        verification_status = "pending_second_pass"
        try:
            verification_pdf = source_to_pdf_for_verification(source_path, tmp_dir)
            page_images = render_pdf_pages_to_ppm(verification_pdf, pages_dir)
            montage_paths = build_montages(page_images, montage_dir)
            verification_payload["page_count"] = len(page_images)
            verification_payload["montage_files"] = [str(p) for p in montage_paths]
        except Exception as exc:
            verification_status = "blocked"
            verification_payload["status"] = "blocked"
            verification_payload["verification_error"] = str(exc)

        write_json(verification_dir / "verification.json", verification_payload)
        write_review_notes(verification_dir / "review-notes.md", report_id, source_path.name)

        artifact_paths = {
            "markdown": str(output_md),
            "catalog": str(catalog_dir / "line-catalog.jsonl"),
            "excluded_catalog": str(catalog_dir / "excluded-lines.jsonl")
            if config.evidence_profile == "full"
            else "",
            "selected_catalog": str(catalog_dir / "selected-lines.jsonl")
            if config.evidence_profile == "full"
            else "",
            "section_map": str(mapping_dir / "section-map.json"),
            "section_accounting": str(mapping_dir / "section-accounting.json"),
            "render_trace": str(render_dir / "render-trace.json"),
            "verification": str(verification_dir / "verification.json"),
            "review_notes": str(verification_dir / "review-notes.md"),
            "qa_gates": str(qa_dir / "gates.json"),
        }
        manifest_payload = build_report_manifest(
            extraction=extraction,
            section_counts_map=counts,
            render_output=render_output,
            verification_status=verification_status,
            source_path=source_path,
            config=config,
            artifact_paths=artifact_paths,
        )
        write_json(manifests_dir / f"{report_id}.json", manifest_payload)

        return {
            "source_file": source_path.name,
            "report_id": report_id,
            "status": "done_pending_review" if verification_status != "blocked" else "done_blocked_verification",
            "output_file": str(output_md),
            "notes": extraction.method_used,
        }
    finally:
        if tmp_dir.exists():
            shutil.rmtree(tmp_dir)


def run_pipeline(
    reports_dir: Path,
    extracted_dir: Path,
    verification_dir: Path,
    manifests_dir: Path,
    tmp_root: Path,
    max_reports: int | None,
    start_index: int,
    skip_existing: bool,
    exclude_substrings: list[str] | None,
    config: PipelineConfig,
) -> None:
    ensure_dependencies()

    files = list_report_files(reports_dir, exclude_substrings=exclude_substrings)
    if start_index > 0:
        files = files[start_index:]
    if max_reports is not None:
        files = files[:max_reports]

    manifests_dir.mkdir(parents=True, exist_ok=True)
    extracted_dir.mkdir(parents=True, exist_ok=True)
    verification_dir.mkdir(parents=True, exist_ok=True)
    tmp_root.mkdir(parents=True, exist_ok=True)

    _order = write_processing_order(files, manifests_dir)
    tracker_rows: list[dict[str, str]] = []

    for source in files:
        report_id = slugify_report_id(source.name)
        output_md = extracted_dir / f"{report_id}.md"
        if skip_existing and output_md.exists():
            tracker_rows.append(
                {
                    "source_file": source.name,
                    "report_id": report_id,
                    "status": "skipped_existing",
                    "output_file": str(output_md),
                    "notes": "already exists",
                }
            )
            write_tracker(tracker_rows, manifests_dir)
            continue

        try:
            row = process_one_report(
                source_path=source,
                extracted_dir=extracted_dir,
                verification_root=verification_dir,
                manifests_dir=manifests_dir,
                tmp_root=tmp_root,
                config=config,
            )
        except Exception as exc:
            error_payload = {
                "report_id": report_id,
                "source_file": source.name,
                "source_path": str(source.resolve()),
                "verification_status": "blocked",
                "error": str(exc),
                "updated_at": utc_now(),
            }
            write_json(manifests_dir / f"{report_id}.json", error_payload)
            row = {
                "source_file": source.name,
                "report_id": report_id,
                "status": "blocked",
                "output_file": str(extracted_dir / f"{report_id}.md"),
                "notes": str(exc),
            }
        tracker_rows.append(row)
        write_tracker(tracker_rows, manifests_dir)


def mark_reviewed(
    manifests_dir: Path,
    verification_dir: Path,
    report_id: str,
    reviewer: str,
    status: str,
    notes: str | None,
) -> None:
    verification_path = verification_dir / report_id / "verification.json"
    manifest_path = manifests_dir / f"{report_id}.json"

    if not verification_path.exists():
        raise FileNotFoundError(f"Verification file not found: {verification_path}")
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest file not found: {manifest_path}")

    verification = json.loads(verification_path.read_text(encoding="utf-8"))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    verification["status"] = status
    verification["reviewer"] = reviewer
    verification["reviewed_at"] = utc_now()
    if notes:
        verification["review_notes"] = notes
    verification["updated_at"] = utc_now()

    manifest["verification_status"] = status
    manifest["reviewer"] = reviewer
    manifest["reviewed_at"] = utc_now()
    manifest["updated_at"] = utc_now()
    if notes:
        manifest["review_notes"] = notes

    write_json(verification_path, verification)
    write_json(manifest_path, manifest)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Sequential report extraction + visual verification")
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="Run sequential extraction pipeline")
    run.add_argument("--reports-dir", default="reports", help="Source reports directory")
    run.add_argument("--extracted-dir", default="extracted", help="Markdown output directory")
    run.add_argument("--verification-dir", default="extracted/verification", help="Verification output directory")
    run.add_argument("--manifests-dir", default="extracted/manifests", help="Manifest output directory")
    run.add_argument("--tmp-dir", default="extracted/tmp", help="Temporary working directory")
    run.add_argument("--max-reports", type=int, default=None, help="Optional max reports to process")
    run.add_argument("--start-index", type=int, default=0, help="Optional 0-based start index in ordered queue")
    run.add_argument("--skip-existing", action="store_true", help="Skip reports with existing markdown outputs")
    run.add_argument(
        "--exclude-substring",
        action="append",
        default=[],
        help="Exclude reports whose filenames contain this substring (case-insensitive). Repeatable.",
    )
    run.add_argument(
        "--evidence-profile",
        choices=["full", "lean"],
        default="full",
        help="Artifact verbosity profile. Full keeps all evidence artifacts.",
    )
    run.add_argument(
        "--verbatim-mode",
        choices=["strict", "normalized"],
        default="strict",
        help="Rendering fidelity mode (strict keeps raw extracted line text).",
    )
    run.add_argument(
        "--fail-closed",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="If enabled, quality gates are expected before report can be marked pass.",
    )
    run.add_argument(
        "--allow-ocr-primary",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Allow OCR-backed lines as primary render source.",
    )

    review = sub.add_parser("mark-reviewed", help="Mark verification outcome for a report")
    review.add_argument("--report-id", required=True, help="Report id (slug)")
    review.add_argument("--reviewer", required=True, help="Reviewer name/id")
    review.add_argument("--status", choices=["pass", "needs_revision", "blocked"], required=True)
    review.add_argument("--notes", default=None, help="Optional review notes")
    review.add_argument("--verification-dir", default="extracted/verification", help="Verification directory")
    review.add_argument("--manifests-dir", default="extracted/manifests", help="Manifest directory")

    preflight = sub.add_parser("preflight", help="Check required dependencies")
    _ = preflight

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "preflight":
        ensure_dependencies()
        print("Preflight OK: required dependencies are installed.")
        return

    if args.command == "run":
        config = PipelineConfig(
            evidence_profile=args.evidence_profile,
            verbatim_mode=args.verbatim_mode,
            fail_closed=bool(args.fail_closed),
            allow_ocr_primary=bool(args.allow_ocr_primary),
        )
        run_pipeline(
            reports_dir=Path(args.reports_dir).resolve(),
            extracted_dir=Path(args.extracted_dir).resolve(),
            verification_dir=Path(args.verification_dir).resolve(),
            manifests_dir=Path(args.manifests_dir).resolve(),
            tmp_root=Path(args.tmp_dir).resolve(),
            max_reports=args.max_reports,
            start_index=args.start_index,
            skip_existing=bool(args.skip_existing),
            exclude_substrings=list(args.exclude_substring or []),
            config=config,
        )
        print("Pipeline completed.")
        return

    if args.command == "mark-reviewed":
        mark_reviewed(
            manifests_dir=Path(args.manifests_dir).resolve(),
            verification_dir=Path(args.verification_dir).resolve(),
            report_id=args.report_id,
            reviewer=args.reviewer,
            status=args.status,
            notes=args.notes,
        )
        print(f"Marked {args.report_id} as {args.status}.")
        return

    raise RuntimeError(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    main()
