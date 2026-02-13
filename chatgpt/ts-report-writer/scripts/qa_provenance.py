#!/usr/bin/env python3
"""Verify extracted markdown lines are backed by source-text artifacts."""

from __future__ import annotations

import argparse
from collections import defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import sys
from typing import Iterable


OCR_MARKER = "[OCR_EXTRACTED_TEXT]"
POLICY_NOTE = "Table- or chart-based adjustment details were excluded per extraction policy."
TEMPLATE_LINE = "Not present in source report"


@dataclass
class ProvenanceIssue:
    line_number: int
    text: str
    status: str
    matched_files: list[str]


def utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate extraction provenance against source-text artifacts.")
    parser.add_argument("--markdown", required=True, help="Path to extracted markdown file")
    parser.add_argument("--source-manifest", required=True, help="Path to source-text manifest.json")
    parser.add_argument("--out-dir", required=True, help="QA output directory")
    parser.add_argument(
        "--allow-ocr-backed-lines",
        action="store_true",
        help="Allow lines matched only in OCR blocks (default: fail).",
    )
    return parser.parse_args()


def load_manifest_paths(source_manifest_path: Path) -> list[str]:
    payload = json.loads(source_manifest_path.read_text(encoding="utf-8"))
    files = payload.get("files", [])
    if not isinstance(files, list):
        raise ValueError("Invalid manifest format: `files` must be a list.")
    rel_paths: list[str] = []
    for item in files:
        if isinstance(item, dict) and isinstance(item.get("path"), str):
            rel_paths.append(item["path"])
    if not rel_paths:
        raise ValueError("No source-text files found in manifest.")
    return rel_paths


def normalize_for_match(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def build_source_indexes(
    source_manifest_path: Path, rel_paths: Iterable[str]
) -> tuple[
    dict[str, set[str]],
    dict[str, set[str]],
    dict[str, set[str]],
    dict[str, set[str]],
    list[str],
]:
    root = source_manifest_path.parent
    non_ocr_index: dict[str, set[str]] = defaultdict(set)
    ocr_index: dict[str, set[str]] = defaultdict(set)
    non_ocr_norm_index: dict[str, set[str]] = defaultdict(set)
    ocr_norm_index: dict[str, set[str]] = defaultdict(set)
    missing_files: list[str] = []

    for rel_path in rel_paths:
        artifact_path = root / rel_path
        if not artifact_path.exists():
            missing_files.append(rel_path)
            continue

        in_ocr_block = False
        for raw_line in artifact_path.read_text(encoding="utf-8", errors="ignore").splitlines():
            line = raw_line.strip()
            if not line:
                continue
            if line == OCR_MARKER:
                in_ocr_block = True
                continue
            if in_ocr_block:
                ocr_index[line].add(rel_path)
                ocr_norm_index[normalize_for_match(line)].add(rel_path)
            else:
                non_ocr_index[line].add(rel_path)
                non_ocr_norm_index[normalize_for_match(line)].add(rel_path)

    return non_ocr_index, ocr_index, non_ocr_norm_index, ocr_norm_index, missing_files


def extracted_content_lines(markdown_path: Path) -> tuple[list[tuple[int, str]], bool]:
    content: list[tuple[int, str]] = []
    contains_ocr_marker = False

    for line_number, raw_line in enumerate(markdown_path.read_text(encoding="utf-8").splitlines(), start=1):
        stripped = raw_line.strip()
        if not stripped:
            continue

        if OCR_MARKER in stripped:
            contains_ocr_marker = True

        if stripped.startswith("#"):
            continue
        if stripped.startswith("- `"):
            continue
        if stripped == TEMPLATE_LINE:
            continue
        if stripped == POLICY_NOTE:
            continue
        if not stripped.startswith("- "):
            continue

        value = stripped[2:].strip()
        if not value:
            continue
        content.append((line_number, value))

    return content, contains_ocr_marker


def write_outputs(out_dir: Path, payload: dict) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "provenance.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    lines: list[str] = []
    lines.append("# Provenance QA")
    lines.append("")
    lines.append(f"- `STATUS`: {payload['status']}")
    lines.append(f"- `CHECKED_LINES`: {payload['checked_lines']}")
    lines.append(f"- `MATCHED_NON_OCR`: {payload['matched_non_ocr']}")
    lines.append(f"- `MATCHED_OCR_ONLY`: {payload['matched_ocr_only']}")
    lines.append(f"- `UNMATCHED`: {payload['unmatched']}")
    lines.append(f"- `WHITESPACE_EQUIVALENT_NON_OCR`: {payload['whitespace_equivalent_non_ocr']}")
    lines.append(f"- `WHITESPACE_EQUIVALENT_OCR`: {payload['whitespace_equivalent_ocr']}")
    lines.append(f"- `MARKDOWN_CONTAINS_OCR_MARKER`: {payload['markdown_contains_ocr_marker']}")
    lines.append("")

    if payload["missing_source_files"]:
        lines.append("## Missing Source Artifact Files")
        lines.append("")
        for path in payload["missing_source_files"]:
            lines.append(f"- {path}")
        lines.append("")

    if payload["issues"]:
        lines.append("## Issues")
        lines.append("")
        for issue in payload["issues"]:
            src = ", ".join(issue["matched_files"]) if issue["matched_files"] else "<none>"
            lines.append(
                f"- Line {issue['line_number']}: `{issue['status']}` | `{issue['text']}` | source files: {src}"
            )
        lines.append("")
    else:
        lines.append("## Issues")
        lines.append("")
        lines.append("- None")
        lines.append("")

    lines.append("## Result")
    lines.append("")
    lines.append(
        "- Pass criteria: no unmatched lines, no OCR-only matched lines (unless override enabled), "
        "and no OCR marker in final markdown."
    )
    lines.append("")

    (out_dir / "provenance.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    args = parse_args()
    markdown_path = Path(args.markdown)
    source_manifest_path = Path(args.source_manifest)
    out_dir = Path(args.out_dir)

    if not markdown_path.exists():
        raise SystemExit(f"Markdown file not found: {markdown_path}")
    if not source_manifest_path.exists():
        raise SystemExit(f"Source manifest not found: {source_manifest_path}")

    rel_paths = load_manifest_paths(source_manifest_path)
    non_ocr_index, ocr_index, non_ocr_norm_index, ocr_norm_index, missing_source_files = build_source_indexes(
        source_manifest_path, rel_paths
    )
    extracted_lines, markdown_contains_ocr_marker = extracted_content_lines(markdown_path)

    issues: list[ProvenanceIssue] = []
    matched_non_ocr = 0
    matched_ocr_only = 0
    unmatched = 0
    whitespace_equivalent_non_ocr = 0
    whitespace_equivalent_ocr = 0

    for line_number, text in extracted_lines:
        if text in non_ocr_index:
            matched_non_ocr += 1
            continue
        if text in ocr_index:
            matched_ocr_only += 1
            issues.append(
                ProvenanceIssue(
                    line_number=line_number,
                    text=text,
                    status="ocr_only_match",
                    matched_files=sorted(ocr_index[text]),
                )
            )
            continue

        normalized = normalize_for_match(text)
        if normalized and normalized in non_ocr_norm_index:
            whitespace_equivalent_non_ocr += 1
            issues.append(
                ProvenanceIssue(
                    line_number=line_number,
                    text=text,
                    status="no_exact_match_whitespace_equivalent_non_ocr",
                    matched_files=sorted(non_ocr_norm_index[normalized]),
                )
            )
            unmatched += 1
            continue
        if normalized and normalized in ocr_norm_index:
            whitespace_equivalent_ocr += 1
            issues.append(
                ProvenanceIssue(
                    line_number=line_number,
                    text=text,
                    status="no_exact_match_whitespace_equivalent_ocr",
                    matched_files=sorted(ocr_norm_index[normalized]),
                )
            )
            unmatched += 1
            continue

        unmatched += 1
        issues.append(
            ProvenanceIssue(
                line_number=line_number,
                text=text,
                status="no_exact_source_match",
                matched_files=[],
            )
        )

    status = "pass"
    if markdown_contains_ocr_marker:
        status = "needs_revision"
    if unmatched > 0:
        status = "needs_revision"
    if matched_ocr_only > 0 and not args.allow_ocr_backed_lines:
        status = "needs_revision"

    payload = {
        "generated_at": utc_now(),
        "status": status,
        "markdown": str(markdown_path),
        "source_manifest": str(source_manifest_path),
        "checked_lines": len(extracted_lines),
        "matched_non_ocr": matched_non_ocr,
        "matched_ocr_only": matched_ocr_only,
        "unmatched": unmatched,
        "whitespace_equivalent_non_ocr": whitespace_equivalent_non_ocr,
        "whitespace_equivalent_ocr": whitespace_equivalent_ocr,
        "markdown_contains_ocr_marker": markdown_contains_ocr_marker,
        "allow_ocr_backed_lines": bool(args.allow_ocr_backed_lines),
        "missing_source_files": sorted(missing_source_files),
        "issues": [asdict(issue) for issue in issues],
    }
    write_outputs(out_dir, payload)

    if status != "pass":
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
