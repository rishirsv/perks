"""Section mapping helpers for catalog lines."""

from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Any

from rapidfuzz import fuzz, process  # type: ignore

from .catalog import CatalogLine, normalize_for_match


@dataclass(frozen=True)
class MappingThresholds:
    heading_fuzzy_match_min: int
    heading_max_words: int
    heading_max_chars: int
    heading_max_digit_ratio: float


@dataclass
class MappingResult:
    sections: dict[str, list[CatalogLine]]
    heading_hits: dict[str, int]
    heading_events: list[dict[str, Any]]
    unresolved_headings: list[dict[str, Any]]


def clean_heading(text: str) -> str:
    cleaned = normalize_for_match(text).lower()
    cleaned = re.sub(r"^\d+(\.\d+)*\s*[-:)]?\s*", "", cleaned)
    return cleaned.strip(" :")


def build_alias_lookup(
    canonical_sections: list[str], section_aliases: dict[str, list[str]]
) -> tuple[list[str], dict[str, str]]:
    phrases: list[str] = []
    mapping: dict[str, str] = {}
    for section in canonical_sections:
        candidates = [section.lower(), *section_aliases.get(section, [])]
        for phrase in candidates:
            if phrase not in mapping:
                phrases.append(phrase)
                mapping[phrase] = section
    return phrases, mapping


def map_heading_to_section(
    text: str,
    canonical_sections: list[str],
    section_aliases: dict[str, list[str]],
    alias_phrases: list[str],
    alias_to_section: dict[str, str],
    thresholds: MappingThresholds,
) -> tuple[str, int, bool]:
    cleaned = clean_heading(text)
    if not cleaned:
        return "", 0, False

    for section in canonical_sections:
        exact_candidates = {section.lower(), *section_aliases.get(section, [])}
        if cleaned in exact_candidates:
            return section, 100, True

    for phrase in alias_phrases:
        if phrase and phrase in cleaned:
            return alias_to_section[phrase], 95, False

    matched = process.extractOne(cleaned, alias_phrases, scorer=fuzz.token_set_ratio)
    if matched:
        phrase, score, _idx = matched
        numeric_score = int(score)
        if numeric_score >= thresholds.heading_fuzzy_match_min:
            return alias_to_section[phrase], numeric_score, False
        return "", numeric_score, False

    return "", 0, False


def looks_like_heading(
    text: str,
    alias_phrases: list[str],
    thresholds: MappingThresholds,
) -> bool:
    txt = normalize_for_match(text)
    if not txt:
        return False
    if len(txt) > thresholds.heading_max_chars:
        return False
    words = txt.split()
    if len(words) > thresholds.heading_max_words:
        return False
    digit_count = sum(ch.isdigit() for ch in txt)
    if digit_count / max(len(txt), 1) > thresholds.heading_max_digit_ratio:
        return False
    if txt.endswith("."):
        return False
    low = clean_heading(txt)
    for alias in alias_phrases:
        if alias in low:
            return True
    if txt.isupper():
        return True
    if ":" in txt and len(words) <= 8:
        return True
    return False


def assign_sections(
    lines: list[CatalogLine],
    canonical_sections: list[str],
    section_aliases: dict[str, list[str]],
    thresholds: MappingThresholds,
) -> MappingResult:
    sections: dict[str, list[CatalogLine]] = {section: [] for section in canonical_sections}
    heading_hits: dict[str, int] = {section: 0 for section in canonical_sections}
    heading_events: list[dict[str, Any]] = []
    unresolved_headings: list[dict[str, Any]] = []

    alias_phrases, alias_to_section = build_alias_lookup(canonical_sections, section_aliases)
    current = canonical_sections[0]

    for line in lines:
        text = line.text_raw
        if looks_like_heading(text, alias_phrases, thresholds):
            mapped, score, exact = map_heading_to_section(
                text=text,
                canonical_sections=canonical_sections,
                section_aliases=section_aliases,
                alias_phrases=alias_phrases,
                alias_to_section=alias_to_section,
                thresholds=thresholds,
            )
            if mapped:
                current = mapped
                heading_hits[mapped] += 1
                line.section_candidate = mapped
                line.section_confidence = score
                heading_events.append(
                    {
                        "line_id": line.line_id,
                        "text": text,
                        "mapped_section": mapped,
                        "score": score,
                        "exact": bool(exact),
                    }
                )
                continue
            unresolved_headings.append(
                {
                    "line_id": line.line_id,
                    "text": text,
                    "score": score,
                }
            )

        line.section_candidate = current
        line.section_confidence = 100
        target = sections[current]
        if target and target[-1].text_norm == line.text_norm:
            continue
        target.append(line)

    return MappingResult(
        sections=sections,
        heading_hits=heading_hits,
        heading_events=heading_events,
        unresolved_headings=unresolved_headings,
    )
