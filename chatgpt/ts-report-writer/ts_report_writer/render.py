"""Render extracted markdown from catalog-backed sections."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from .catalog import CatalogLine


TABLE_ONLY_NOTE = "Table- or chart-based adjustment details were excluded per extraction policy."


@dataclass
class RenderOutput:
    markdown: str
    trace: list[dict[str, Any]]
    section_disposition: dict[str, str]


def utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def render_markdown(
    report_id: str,
    source_file: str,
    sections: dict[str, list[CatalogLine]],
    heading_hits: dict[str, int],
    section_order: list[str],
    extra_metadata: dict[str, str] | None = None,
) -> RenderOutput:
    out: list[str] = []
    trace: list[dict[str, Any]] = []
    section_disposition: dict[str, str] = {}

    def add_line(value: str) -> int:
        out.append(value)
        return len(out)

    add_line(f"# Report Extraction: {report_id}")
    add_line("")
    add_line("## Report Metadata")
    add_line("")
    add_line(f"- `SOURCE_FILE`: {source_file}")
    add_line(f"- `REPORT_ID`: {report_id}")
    add_line(f"- `SOURCE_PATH`: reports/{source_file}")
    add_line("- `EXTRACTION_STATUS`: extracted_pending_verification")
    add_line(f"- `EXTRACTION_DATE`: {utc_now()}")
    for key, value in (extra_metadata or {}).items():
        add_line(f"- `{key}`: {value}")
    add_line("")

    for section in section_order:
        add_line(f"# {section}")
        entries = sections.get(section, [])
        if section == "Appendices":
            appended = _render_appendices(entries, out, trace, section)
            section_disposition[section] = "present" if appended else "not_present"
            continue

        if not entries:
            if section in {"Net Working Capital", "Net Debt (Cash)"} and heading_hits.get(section, 0) > 0:
                add_line(TABLE_ONLY_NOTE)
                section_disposition[section] = "table_only_policy_note"
            else:
                add_line("Not present in source report")
                section_disposition[section] = "not_present"
            add_line("")
            continue

        section_disposition[section] = "present"
        for item in entries:
            line_no = add_line(f"- {item.text_raw}")
            trace.append(
                {
                    "markdown_line_number": line_no,
                    "section": section,
                    "line_id": item.line_id,
                    "source_kind": item.source_kind,
                    "source_file": item.source_file,
                    "page_or_slide": item.page_or_slide,
                    "class_flags": item.class_flags,
                    "text": item.text_raw,
                }
            )
        add_line("")

    return RenderOutput(
        markdown="\n".join(out).rstrip() + "\n",
        trace=trace,
        section_disposition=section_disposition,
    )


def _render_appendices(
    entries: list[CatalogLine],
    out: list[str],
    trace: list[dict[str, Any]],
    section_name: str,
) -> bool:
    sections: list[dict[str, Any]] = []
    for item in entries:
        low = item.text_raw.lower()
        if "appendix" in low:
            sections.append({"name": f"Appendix {len(sections) + 1}: {item.text_raw}", "entries": []})
            continue
        if not sections:
            sections.append({"name": "Appendix 1: Extracted Appendix Content", "entries": []})
        sections[-1]["entries"].append(item)

    if not sections:
        out.append("## Appendix 1: Not present")
        out.append("Not present in source report")
        out.append("")
        return False

    for block in sections:
        out.append(f"## {block['name']}")
        if not block["entries"]:
            out.append("Not present in source report")
            out.append("")
            continue
        for item in block["entries"]:
            out.append(f"- {item.text_raw}")
            trace.append(
                {
                    "markdown_line_number": len(out),
                    "section": section_name,
                    "line_id": item.line_id,
                    "source_kind": item.source_kind,
                    "source_file": item.source_file,
                    "page_or_slide": item.page_or_slide,
                    "class_flags": item.class_flags,
                    "text": item.text_raw,
                }
            )
        out.append("")
    return True
