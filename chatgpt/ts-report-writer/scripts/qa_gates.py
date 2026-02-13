#!/usr/bin/env python3
"""Evaluate fail-closed QA gates before pass status can be assigned."""

from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import sys
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ts_report_writer.catalog import CatalogLine  # noqa: E402
from ts_report_writer.constants import (  # noqa: E402
    CANONICAL_SECTION_ORDER,
    FORBIDDEN_OUTPUT_CLASSES,
    SECTION_ALIASES,
    THRESHOLDS,
)
from ts_report_writer.mapping import MappingThresholds, assign_sections  # noqa: E402

OCR_MARKER = "[OCR_EXTRACTED_TEXT]"
PLACEHOLDER_PATTERNS = ["<required>", "<add findings here>", "<pass|needs_revision|blocked>", "<YYYY-MM-DD>"]
EXECUTIVE_SUMMARY_BOILERPLATE_PATTERNS = [
    re.compile(r"\bimportant notice\b", re.IGNORECASE),
    re.compile(r"\bengagement agreement\b", re.IGNORECASE),
    re.compile(r"\byours truly\b", re.IGNORECASE),
    re.compile(r"\bdear mr\b", re.IGNORECASE),
    re.compile(r"\bprivate and confidential\b", re.IGNORECASE),
    re.compile(r"\bno assurance opinion\b", re.IGNORECASE),
    re.compile(r"\bdoes not constitute an audit\b", re.IGNORECASE),
]
SKIP_MARKDOWN_LINES = {"Not present in source report"}
OBVIOUS_FRAGMENT_PATTERNS = [
    re.compile(r"^(page|pages|ttm|ytd)$", re.IGNORECASE),
    re.compile(r"^fy\d{2}$", re.IGNORECASE),
    re.compile(r"^source:?$", re.IGNORECASE),
    re.compile(r"^partner,\s+transaction services$", re.IGNORECASE),
    re.compile(r"^senior (manager|associate),\s+transaction services$", re.IGNORECASE),
]
TRAILING_FRAGMENT_WORDS = {
    "and",
    "or",
    "to",
    "for",
    "of",
    "in",
    "on",
    "with",
    "from",
    "by",
    "at",
    "as",
    "the",
    "a",
    "an",
}


def utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run fail-closed QA gates for one report.")
    parser.add_argument("--report-id", required=True, help="Report id slug")
    parser.add_argument("--verification-root", default="extracted/verification", help="Verification root directory")
    parser.add_argument("--allow-ocr-primary", action="store_true", help="Allow OCR-backed lines in render trace")
    parser.add_argument("--out-dir", default=None, help="Optional override for QA output directory")
    return parser.parse_args()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line:
            continue
        rows.append(json.loads(line))
    return rows


def to_catalog_lines(rows: list[dict[str, Any]]) -> list[CatalogLine]:
    lines: list[CatalogLine] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            lines.append(
                CatalogLine(
                    line_id=str(row.get("line_id", "")),
                    text_raw=str(row.get("text_raw", "")),
                    text_norm=str(row.get("text_norm", "")),
                    source_kind=str(row.get("source_kind", "")),
                    source_file=str(row.get("source_file", "")),
                    page_or_slide=int(row.get("page_or_slide", 0)),
                    bbox=row.get("bbox"),
                    class_flags=list(row.get("class_flags", [])),
                    included_candidate=bool(row.get("included_candidate", True)),
                    exclusion_reason=row.get("exclusion_reason"),
                    section_candidate=row.get("section_candidate"),
                    section_confidence=int(row.get("section_confidence", 0)),
                    metadata=dict(row.get("metadata", {})),
                )
            )
        except Exception:
            continue
    return lines


def is_appendix_heading(text: str) -> bool:
    return "appendix" in text.lower()


def compute_section_accounting(
    selected_lines: list[CatalogLine],
    trace_rows: list[dict[str, Any]],
) -> tuple[dict[str, dict[str, list[str]]], dict[str, int], list[dict[str, str]]]:
    mapping_result = assign_sections(
        lines=selected_lines,
        canonical_sections=CANONICAL_SECTION_ORDER,
        section_aliases=SECTION_ALIASES,
        thresholds=MappingThresholds(
            heading_fuzzy_match_min=THRESHOLDS.heading_fuzzy_match_min,
            heading_max_words=THRESHOLDS.heading_max_words,
            heading_max_chars=THRESHOLDS.heading_max_chars,
            heading_max_digit_ratio=THRESHOLDS.heading_max_digit_ratio,
        ),
    )

    expected_by_section: dict[str, list[str]] = {section: [] for section in CANONICAL_SECTION_ORDER}
    expected_text_by_line_id: dict[str, str] = {}
    for section, items in mapping_result.sections.items():
        for item in items:
            if section == "Appendices" and is_appendix_heading(item.text_raw):
                continue
            expected_by_section[section].append(item.line_id)
            expected_text_by_line_id[item.line_id] = item.text_raw

    rendered_by_section: dict[str, list[str]] = {section: [] for section in CANONICAL_SECTION_ORDER}
    for row in trace_rows:
        section = str(row.get("section", ""))
        line_id = str(row.get("line_id", ""))
        if section in rendered_by_section and line_id:
            rendered_by_section[section].append(line_id)

    issues: list[dict[str, str]] = []
    accounting: dict[str, dict[str, list[str]]] = {}
    totals = {
        "expected_lines": 0,
        "rendered_lines": 0,
        "missing_lines": 0,
        "unexpected_lines": 0,
    }

    for section in CANONICAL_SECTION_ORDER:
        expected_ids = expected_by_section.get(section, [])
        rendered_ids = rendered_by_section.get(section, [])
        expected_set = set(expected_ids)
        rendered_set = set(rendered_ids)
        missing_ids = sorted(expected_set - rendered_set)
        unexpected_ids = sorted(rendered_set - expected_set)

        totals["expected_lines"] += len(expected_ids)
        totals["rendered_lines"] += len(rendered_ids)
        totals["missing_lines"] += len(missing_ids)
        totals["unexpected_lines"] += len(unexpected_ids)

        accounting[section] = {
            "expected_line_ids": expected_ids,
            "rendered_line_ids": rendered_ids,
            "missing_line_ids": missing_ids,
            "unexpected_line_ids": unexpected_ids,
        }

        for line_id in missing_ids[:40]:
            issues.append(
                {
                    "type": "section_line_missing",
                    "detail": f"section={section} line_id={line_id} text={expected_text_by_line_id.get(line_id, '')}",
                }
            )
        for line_id in unexpected_ids[:40]:
            issues.append(
                {
                    "type": "section_line_unexpected",
                    "detail": f"section={section} line_id={line_id}",
                }
            )

    return accounting, totals, issues


def markdown_trace_sync_issues(markdown_text: str, trace_rows: list[dict[str, Any]]) -> tuple[list[dict[str, str]], int]:
    issues: list[dict[str, str]] = []
    markdown_lines = markdown_text.splitlines()
    traced_line_numbers: set[int] = set()

    for row in trace_rows:
        line_number = int(row.get("markdown_line_number", 0) or 0)
        text = str(row.get("text", ""))
        expected = f"- {text}"
        if line_number <= 0 or line_number > len(markdown_lines):
            issues.append(
                {
                    "type": "trace_line_out_of_range",
                    "detail": f"line_number={line_number}",
                }
            )
            continue
        traced_line_numbers.add(line_number)
        actual = markdown_lines[line_number - 1].strip()
        if actual != expected:
            issues.append(
                {
                    "type": "trace_markdown_mismatch",
                    "detail": f"line_number={line_number} expected={expected} actual={actual}",
                }
            )

    untraced_content = 0
    for idx, raw in enumerate(markdown_lines, start=1):
        stripped = raw.strip()
        if not stripped.startswith("- "):
            continue
        if stripped.startswith("- `"):
            continue
        if stripped.startswith("- ["):
            continue
        if idx in traced_line_numbers:
            continue
        untraced_content += 1
        issues.append(
            {
                "type": "markdown_untraced_content_line",
                "detail": f"line_number={idx} text={stripped}",
            }
        )

    return issues, untraced_content


def manual_checklist_complete(review_notes_text: str) -> tuple[bool, list[str]]:
    reasons: list[str] = []
    if re.search(r"^- \[ \]", review_notes_text, flags=re.MULTILINE):
        reasons.append("unchecked_checklist_items_present")
    low = review_notes_text.lower()
    for marker in PLACEHOLDER_PATTERNS:
        if marker.lower() in low:
            reasons.append(f"placeholder_present:{marker}")
    return len(reasons) == 0, reasons


def markdown_section(markdown_text: str, heading: str) -> str:
    pattern = rf"(?ms)^# {re.escape(heading)}\n(.*?)(?=^# |\Z)"
    match = re.search(pattern, markdown_text)
    if not match:
        return ""
    return match.group(1)


def executive_summary_cleanup_issues(markdown_text: str) -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    section_text = markdown_section(markdown_text, "Executive Summary")
    if not section_text:
        return issues
    for pattern in EXECUTIVE_SUMMARY_BOILERPLATE_PATTERNS:
        if pattern.search(section_text):
            issues.append(
                {
                    "type": "executive_summary_boilerplate",
                    "detail": f"matched_pattern={pattern.pattern}",
                }
            )
    return issues


def cleanup_quality_issues(markdown_text: str) -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    lines = markdown_text.splitlines()
    for line_number, raw in enumerate(lines, start=1):
        stripped = raw.strip()
        if not stripped.startswith("- "):
            continue
        if stripped.startswith("- `"):
            continue
        if stripped.startswith("- ["):
            continue

        text = stripped[2:].strip()
        if not text or text in SKIP_MARKDOWN_LINES:
            continue
        if OCR_MARKER in text:
            continue

        for pattern in OBVIOUS_FRAGMENT_PATTERNS:
            if pattern.search(text):
                issues.append(
                    {
                        "type": "cleanup_quality_fragment",
                        "detail": f"line_number={line_number} text={text}",
                    }
                )
                break
        else:
            words = re.findall(r"[A-Za-z0-9']+", text)
            word_count = len(words)
            lower = text.lower()

            if word_count <= 2 and len(text) <= 20:
                issues.append(
                    {
                        "type": "cleanup_quality_fragment",
                        "detail": f"line_number={line_number} text={text}",
                    }
                )
                continue

            if words and words[-1].lower() in TRAILING_FRAGMENT_WORDS and word_count <= 12:
                issues.append(
                    {
                        "type": "cleanup_quality_fragment",
                        "detail": f"line_number={line_number} text={text}",
                    }
                )
                continue

            if re.match(r"^[a-z]", text) and not re.search(r"[.!?:]$", text) and word_count <= 8:
                issues.append(
                    {
                        "type": "cleanup_quality_fragment",
                        "detail": f"line_number={line_number} text={text}",
                    }
                )
                continue

            if lower in {"executive", "financial due", "diligence", "overview"}:
                issues.append(
                    {
                        "type": "cleanup_quality_fragment",
                        "detail": f"line_number={line_number} text={text}",
                    }
                )
                continue
    return issues


def write_outputs(out_dir: Path, payload: dict[str, Any]) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "gates.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    lines: list[str] = []
    lines.append("# QA Gates")
    lines.append("")
    lines.append(f"- `STATUS`: {payload['status']}")
    lines.append(f"- `REPORT_ID`: {payload['report_id']}")
    lines.append(f"- `GENERATED_AT`: {payload['generated_at']}")
    lines.append("")
    lines.append("## Gate Results")
    lines.append("")
    for gate in payload["gates"]:
        lines.append(f"- `{gate['name']}`: `{gate['status']}` ({gate['detail']})")
    lines.append("")

    if payload["issues"]:
        lines.append("## Issues")
        lines.append("")
        for issue in payload["issues"]:
            lines.append(f"- `{issue['type']}`: {issue['detail']}")
        lines.append("")

    lines.append("## Summary")
    lines.append("")
    lines.append(f"- `TRACE_LINES`: {payload['summary']['trace_lines']}")
    lines.append(f"- `MISSING_TRACE_REFERENCES`: {payload['summary']['missing_trace_references']}")
    lines.append(f"- `OCR_TRACE_LINES`: {payload['summary']['ocr_trace_lines']}")
    lines.append(f"- `FORBIDDEN_CLASS_LINES`: {payload['summary']['forbidden_class_lines']}")
    lines.append(f"- `MANUAL_CHECK_ISSUES`: {payload['summary']['manual_check_issues']}")
    lines.append(f"- `PROVENANCE_UNMATCHED`: {payload['summary']['provenance_unmatched']}")
    lines.append(f"- `TRACE_SYNC_ISSUES`: {payload['summary']['trace_sync_issues']}")
    lines.append(f"- `MARKDOWN_UNTRACED_CONTENT_LINES`: {payload['summary']['markdown_untraced_content_lines']}")
    lines.append(f"- `SECTION_EXPECTED_LINES`: {payload['summary']['section_expected_lines']}")
    lines.append(f"- `SECTION_RENDERED_LINES`: {payload['summary']['section_rendered_lines']}")
    lines.append(f"- `SECTION_MISSING_LINES`: {payload['summary']['section_missing_lines']}")
    lines.append(f"- `SECTION_UNEXPECTED_LINES`: {payload['summary']['section_unexpected_lines']}")
    lines.append(f"- `EXEC_SUMMARY_BOILERPLATE_ISSUES`: {payload['summary']['exec_summary_boilerplate_issues']}")
    lines.append(f"- `CLEANUP_QUALITY_ISSUES`: {payload['summary']['cleanup_quality_issues']}")
    lines.append("")

    (out_dir / "gates.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    args = parse_args()
    verification_dir = Path(args.verification_root) / args.report_id
    out_dir = Path(args.out_dir) if args.out_dir else verification_dir / "qa"

    render_trace_path = verification_dir / "render" / "render-trace.json"
    catalog_path = verification_dir / "catalog" / "line-catalog.jsonl"
    section_map_path = verification_dir / "mapping" / "section-map.json"
    section_accounting_path = verification_dir / "mapping" / "section-accounting.json"
    selected_catalog_path = verification_dir / "catalog" / "selected-lines.jsonl"
    provenance_path = verification_dir / "qa" / "provenance.json"
    review_notes_path = verification_dir / "review-notes.md"
    verification_json_path = verification_dir / "verification.json"

    required_paths = [
        render_trace_path,
        catalog_path,
        selected_catalog_path,
        section_map_path,
        section_accounting_path,
        provenance_path,
        review_notes_path,
        verification_json_path,
    ]
    missing = [str(path) for path in required_paths if not path.exists()]
    if missing:
        payload = {
            "report_id": args.report_id,
            "generated_at": utc_now(),
            "status": "needs_revision",
            "gates": [
                {
                    "name": "artifact_presence",
                    "status": "fail",
                    "detail": "Required QA artifacts are missing.",
                }
            ],
            "issues": [{"type": "missing_artifact", "detail": item} for item in missing],
            "summary": {
                "trace_lines": 0,
                "missing_trace_references": 0,
                "ocr_trace_lines": 0,
                "forbidden_class_lines": 0,
                "manual_check_issues": 0,
                "provenance_unmatched": 0,
                "trace_sync_issues": 0,
                "markdown_untraced_content_lines": 0,
                "section_expected_lines": 0,
                "section_rendered_lines": 0,
                "section_missing_lines": 0,
                "section_unexpected_lines": 0,
                "exec_summary_boilerplate_issues": 0,
                "cleanup_quality_issues": 0,
            },
        }
        write_outputs(out_dir, payload)
        return 2

    trace_rows = load_json(render_trace_path)
    catalog_rows = load_jsonl(catalog_path)
    selected_catalog_rows = load_jsonl(selected_catalog_path)
    section_map = load_json(section_map_path)
    section_accounting_artifact = load_json(section_accounting_path)
    provenance = load_json(provenance_path)
    review_notes_text = review_notes_path.read_text(encoding="utf-8", errors="ignore")
    verification_json = load_json(verification_json_path)
    markdown_path = Path(verification_json.get("markdown_path", ""))
    markdown_text = markdown_path.read_text(encoding="utf-8", errors="ignore") if markdown_path.exists() else ""

    catalog_index = {row["line_id"]: row for row in catalog_rows if isinstance(row, dict) and row.get("line_id")}
    selected_lines = to_catalog_lines(selected_catalog_rows)
    issues: list[dict[str, str]] = []
    counters = Counter()

    for row in trace_rows:
        counters["trace_lines"] += 1
        line_id = row.get("line_id")
        if line_id not in catalog_index:
            counters["missing_trace_references"] += 1
            issues.append({"type": "missing_trace_reference", "detail": f"line_id={line_id}"})
            continue
        catalog_row = catalog_index[line_id]
        source_kind = str(catalog_row.get("source_kind", ""))
        class_flags = set(catalog_row.get("class_flags", []))

        if source_kind == "ocr":
            counters["ocr_trace_lines"] += 1
            issues.append({"type": "ocr_primary_line", "detail": f"line_id={line_id}"})

        bad_flags = sorted(class_flags.intersection(FORBIDDEN_OUTPUT_CLASSES))
        if bad_flags:
            counters["forbidden_class_lines"] += 1
            issues.append(
                {
                    "type": "forbidden_class_output",
                    "detail": f"line_id={line_id} flags={','.join(bad_flags)}",
                }
            )

    checklist_ok, checklist_reasons = manual_checklist_complete(review_notes_text)
    if not checklist_ok:
        counters["manual_check_issues"] += len(checklist_reasons)
        for reason in checklist_reasons:
            issues.append({"type": "manual_checklist", "detail": reason})

    if OCR_MARKER in markdown_text:
        issues.append({"type": "ocr_marker_in_markdown", "detail": OCR_MARKER})

    summary_cleanup_issues = executive_summary_cleanup_issues(markdown_text)
    if summary_cleanup_issues:
        issues.extend(summary_cleanup_issues)
        counters["exec_summary_boilerplate_issues"] += len(summary_cleanup_issues)

    cleanup_issues = cleanup_quality_issues(markdown_text)
    if cleanup_issues:
        issues.extend(cleanup_issues)
        counters["cleanup_quality_issues"] += len(cleanup_issues)

    trace_sync_issues, untraced_content = markdown_trace_sync_issues(markdown_text, trace_rows)
    if trace_sync_issues:
        issues.extend(trace_sync_issues)
        counters["trace_sync_issues"] += len(trace_sync_issues)
    counters["markdown_untraced_content_lines"] += untraced_content

    section_accounting, section_totals, section_issues = compute_section_accounting(selected_lines, trace_rows)
    if section_issues:
        issues.extend(section_issues)
    counters["section_missing_lines"] += section_totals["missing_lines"]
    counters["section_unexpected_lines"] += section_totals["unexpected_lines"]

    artifact_section_status = str(section_accounting_artifact.get("status", ""))
    computed_section_status = "pass" if section_totals["missing_lines"] == 0 and section_totals["unexpected_lines"] == 0 else "needs_revision"
    if artifact_section_status and artifact_section_status != computed_section_status:
        issues.append(
            {
                "type": "section_accounting_status_mismatch",
                "detail": f"artifact={artifact_section_status} computed={computed_section_status}",
            }
        )

    section_disposition = section_map.get("section_disposition", {})
    missing_section_disposition = [sec for sec in CANONICAL_SECTION_ORDER if sec not in section_disposition]
    if missing_section_disposition:
        for section in missing_section_disposition:
            issues.append({"type": "missing_section_disposition", "detail": section})

    gates: list[dict[str, str]] = []
    provenance_exact_pass = (
        provenance.get("status") == "pass"
        and int(provenance.get("unmatched", 0)) == 0
        and int(provenance.get("matched_ocr_only", 0)) == 0
        and not bool(provenance.get("markdown_contains_ocr_marker", False))
    )
    if not provenance_exact_pass:
        issues.append(
            {
                "type": "provenance_exact_match_failed",
                "detail": (
                    f"status={provenance.get('status')} unmatched={provenance.get('unmatched', 0)} "
                    f"matched_ocr_only={provenance.get('matched_ocr_only', 0)}"
                ),
            }
        )
    gates.append(
        {
            "name": "provenance_exact_match",
            "status": "pass" if provenance_exact_pass else "fail",
            "detail": "Provenance QA must pass with zero unmatched and zero OCR-only lines.",
        }
    )

    provenance_pass = counters["missing_trace_references"] == 0
    gates.append(
        {
            "name": "provenance_trace_integrity",
            "status": "pass" if provenance_pass else "fail",
            "detail": "Every markdown trace row maps to a catalog line_id.",
        }
    )

    forbidden_pass = counters["forbidden_class_lines"] == 0
    gates.append(
        {
            "name": "forbidden_class_leakage",
            "status": "pass" if forbidden_pass else "fail",
            "detail": "No forbidden class lines are present in rendered output.",
        }
    )

    ocr_pass = counters["ocr_trace_lines"] == 0 or bool(args.allow_ocr_primary)
    gates.append(
        {
            "name": "ocr_primary_policy",
            "status": "pass" if ocr_pass else "fail",
            "detail": "OCR-backed lines are blocked unless --allow-ocr-primary is enabled.",
        }
    )

    marker_pass = OCR_MARKER not in markdown_text
    gates.append(
        {
            "name": "ocr_marker_absent",
            "status": "pass" if marker_pass else "fail",
            "detail": "Final markdown must not include OCR marker blocks.",
        }
    )

    section_pass = len(missing_section_disposition) == 0
    gates.append(
        {
            "name": "section_disposition_complete",
            "status": "pass" if section_pass else "fail",
            "detail": "All canonical sections must have a disposition in section-map.",
        }
    )

    manual_pass = checklist_ok
    gates.append(
        {
            "name": "manual_checklist_complete",
            "status": "pass" if manual_pass else "fail",
            "detail": "Review notes checklist and placeholders must be completed.",
        }
    )

    trace_sync_pass = counters["trace_sync_issues"] == 0 and counters["markdown_untraced_content_lines"] == 0
    gates.append(
        {
            "name": "markdown_trace_sync",
            "status": "pass" if trace_sync_pass else "fail",
            "detail": "Rendered trace must exactly match markdown and all content bullets must be traced.",
        }
    )

    section_completeness_pass = (
        section_totals["missing_lines"] == 0 and section_totals["unexpected_lines"] == 0
    )
    gates.append(
        {
            "name": "section_completeness",
            "status": "pass" if section_completeness_pass else "fail",
            "detail": "Every selected line for each mapped section must be accounted for in render output.",
        }
    )

    summary_cleanup_pass = counters["exec_summary_boilerplate_issues"] == 0
    gates.append(
        {
            "name": "executive_summary_cleanup",
            "status": "pass" if summary_cleanup_pass else "fail",
            "detail": "Executive Summary must not include engagement-letter/legal boilerplate text.",
        }
    )

    cleanup_quality_pass = counters["cleanup_quality_issues"] == 0
    gates.append(
        {
            "name": "cleanup_quality",
            "status": "pass" if cleanup_quality_pass else "fail",
            "detail": "Final markdown must not contain fragment/noise bullets after cleanup.",
        }
    )

    final_status = "pass" if all(g["status"] == "pass" for g in gates) else "needs_revision"
    payload = {
        "report_id": args.report_id,
        "generated_at": utc_now(),
        "status": final_status,
        "gates": gates,
        "issues": issues,
        "summary": {
            "trace_lines": counters["trace_lines"],
            "missing_trace_references": counters["missing_trace_references"],
            "ocr_trace_lines": counters["ocr_trace_lines"],
            "forbidden_class_lines": counters["forbidden_class_lines"],
            "manual_check_issues": counters["manual_check_issues"],
            "provenance_unmatched": int(provenance.get("unmatched", 0)),
            "trace_sync_issues": counters["trace_sync_issues"],
            "markdown_untraced_content_lines": counters["markdown_untraced_content_lines"],
            "section_expected_lines": section_totals["expected_lines"],
            "section_rendered_lines": section_totals["rendered_lines"],
            "section_missing_lines": section_totals["missing_lines"],
            "section_unexpected_lines": section_totals["unexpected_lines"],
            "exec_summary_boilerplate_issues": counters["exec_summary_boilerplate_issues"],
            "cleanup_quality_issues": counters["cleanup_quality_issues"],
        },
        "allow_ocr_primary": bool(args.allow_ocr_primary),
        "section_accounting": section_accounting,
        "artifact_paths": {
            "render_trace": str(render_trace_path),
            "catalog": str(catalog_path),
            "selected_catalog": str(selected_catalog_path),
            "section_map": str(section_map_path),
            "section_accounting": str(section_accounting_path),
            "provenance": str(provenance_path),
            "review_notes": str(review_notes_path),
            "verification": str(verification_json_path),
            "markdown": str(markdown_path),
        },
    }
    write_outputs(out_dir, payload)
    return 0 if final_status == "pass" else 2


if __name__ == "__main__":
    sys.exit(main())
