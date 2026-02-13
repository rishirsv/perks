"""Catalog models and helpers for deterministic extraction evidence."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
import json
import re
from pathlib import Path
from typing import Any, Iterable


def normalize_for_match(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


@dataclass
class CatalogLine:
    """Single source-backed line item used for rendering and QA."""

    line_id: str
    text_raw: str
    text_norm: str
    source_kind: str
    source_file: str
    page_or_slide: int
    bbox: tuple[float, float, float, float] | None
    class_flags: list[str] = field(default_factory=list)
    included_candidate: bool = True
    exclusion_reason: str | None = None
    section_candidate: str | None = None
    section_confidence: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)


def write_json(path: Path, payload: dict[str, Any] | list[Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_jsonl(path: Path, rows: Iterable[CatalogLine]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    chunks: list[str] = []
    for row in rows:
        chunks.append(json.dumps(asdict(row), ensure_ascii=False))
    if chunks:
        path.write_text("\n".join(chunks) + "\n", encoding="utf-8")
    else:
        path.write_text("", encoding="utf-8")


def build_catalog_index(rows: Iterable[CatalogLine]) -> dict[str, CatalogLine]:
    return {row.line_id: row for row in rows}
