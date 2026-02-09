"""
Validate that per-industry exports match the dist v2 bundle.

Usage:
  python3 scripts/validate-scope-exports.py
"""

from __future__ import annotations

import argparse
from copy import deepcopy
import json
import re
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BUNDLE = PROJECT_ROOT / "dist" / "scope-library.json"
DEFAULT_OUT_DIR = PROJECT_ROOT / "docs" / "scope-library" / "industries"
DEFAULT_APPLICABILITY = PROJECT_ROOT / "docs" / "scope-library" / "section-applicability.json"


def _normalize_lookup_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", str(value or "").strip().lower()).strip("_")


def _load_applicability(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    raw = json.loads(path.read_text(encoding="utf-8"))
    return raw if isinstance(raw, dict) else {}


def _build_industry_view(
    bundle: dict[str, Any],
    industry: str,
    applicability: dict[str, Any],
) -> dict[str, Any]:
    industry_norm = _normalize_lookup_key(industry)
    section_applicability = applicability.get("section_applicability", {})
    common_rules = {}
    if isinstance(section_applicability, dict):
        raw_common_rules = section_applicability.get("common_skeleton", {})
        if isinstance(raw_common_rules, dict):
            common_rules = raw_common_rules

    common_all = bundle.get("common_skeleton", []) or []
    common_filtered: list[dict[str, Any]] = []
    excluded_common_sections: list[str] = []
    for section in common_all:
        if not isinstance(section, dict):
            continue
        section_key = _normalize_lookup_key(str(section.get("normalized_heading", "")))
        include = True
        rule = common_rules.get(section_key)
        if isinstance(rule, dict):
            include_for = {
                _normalize_lookup_key(v)
                for v in (rule.get("include_for_industries") or [])
                if isinstance(v, str)
            }
            exclude_for = {
                _normalize_lookup_key(v)
                for v in (rule.get("exclude_for_industries") or [])
                if isinstance(v, str)
            }
            if include_for and industry_norm not in include_for:
                include = False
            if industry_norm in exclude_for:
                include = False
        if include:
            common_filtered.append(section)
        elif section_key:
            excluded_common_sections.append(section_key)
    excluded_common_set = set(excluded_common_sections)

    common_replacements_root = applicability.get("common_section_replacements", {})
    if isinstance(common_replacements_root, dict):
        common_index: dict[str, int] = {}
        for idx, section in enumerate(common_filtered):
            if not isinstance(section, dict):
                continue
            key = _normalize_lookup_key(str(section.get("normalized_heading", "")))
            if key:
                common_index[key] = idx

        for section_key, replacement in common_replacements_root.items():
            normalized = _normalize_lookup_key(section_key)
            if not normalized or not isinstance(replacement, dict):
                continue
            if normalized in excluded_common_set:
                continue
            heading = replacement.get("heading")
            bullets = replacement.get("default_bullets")
            if not isinstance(bullets, list):
                continue
            clean_bullets = [deepcopy(b) for b in bullets if isinstance(b, dict)]
            existing_idx = common_index.get(normalized)
            if not clean_bullets:
                if existing_idx is not None:
                    common_filtered.pop(existing_idx)
                    common_index = {}
                    for idx, section in enumerate(common_filtered):
                        if not isinstance(section, dict):
                            continue
                        key = _normalize_lookup_key(str(section.get("normalized_heading", "")))
                        if key:
                            common_index[key] = idx
                continue

            new_section: dict[str, Any] = {
                "normalized_heading": normalized,
                "default_bullets": clean_bullets,
            }
            if isinstance(heading, str) and heading.strip():
                new_section["heading"] = heading.strip()
            elif existing_idx is not None:
                prev_heading = common_filtered[existing_idx].get("heading")
                if isinstance(prev_heading, str) and prev_heading.strip():
                    new_section["heading"] = prev_heading.strip()
                else:
                    new_section["heading"] = normalized.replace("_", " ").title()
            else:
                new_section["heading"] = normalized.replace("_", " ").title()

            if existing_idx is not None:
                common_filtered[existing_idx] = new_section
            else:
                common_filtered.append(new_section)
                common_index[normalized] = len(common_filtered) - 1

    modules = bundle.get("industry_modules", {}) or {}
    raw_industry_module = modules.get(industry)
    industry_module = deepcopy(raw_industry_module) if isinstance(raw_industry_module, dict) else {}

    additions_root = applicability.get("industry_section_additions", {})
    additions_for_industry: dict[str, Any] = {}
    if isinstance(additions_root, dict):
        raw = additions_root.get(industry)
        if isinstance(raw, dict):
            additions_for_industry = raw

    replacements_root = applicability.get("industry_section_replacements", {})
    replacements_for_industry: dict[str, Any] = {}
    if isinstance(replacements_root, dict):
        raw = replacements_root.get(industry)
        if isinstance(raw, dict):
            replacements_for_industry = raw

    for section_key, bullets in replacements_for_industry.items():
        if not isinstance(section_key, str) or not isinstance(bullets, list):
            continue
        clean_bullets = [deepcopy(b) for b in bullets if isinstance(b, dict)]
        if clean_bullets:
            industry_module[section_key] = clean_bullets
        else:
            industry_module.pop(section_key, None)

    for section_key, bullets in additions_for_industry.items():
        if not isinstance(section_key, str) or not isinstance(bullets, list):
            continue
        clean_bullets = [deepcopy(b) for b in bullets if isinstance(b, dict)]
        if not clean_bullets:
            continue
        existing = industry_module.get(section_key)
        if not isinstance(existing, list):
            industry_module[section_key] = clean_bullets
        else:
            existing_ids = {b.get("id") for b in existing if isinstance(b, dict)}
            for bullet in clean_bullets:
                bullet_id = bullet.get("id")
                if isinstance(bullet_id, str) and bullet_id in existing_ids:
                    continue
                existing.append(bullet)
                if isinstance(bullet_id, str):
                    existing_ids.add(bullet_id)

    return {
        "common_skeleton": common_filtered,
        "industry_module": industry_module,
    }


def _slice_bundle(bundle: dict[str, Any], industry: str, applicability: dict[str, Any]) -> dict[str, Any]:
    view = _build_industry_view(bundle, industry, applicability)
    return {
        "common_skeleton": view["common_skeleton"],
        "industry_modules": {industry: view["industry_module"]} if view["industry_module"] else {},
        "metadata": bundle.get("metadata", {}),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate per-industry scope exports")
    parser.add_argument("--bundle", default=str(DEFAULT_BUNDLE), help="Path to dist bundle JSON (v2)")
    parser.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR), help="Exports directory")
    parser.add_argument(
        "--applicability",
        default=str(DEFAULT_APPLICABILITY),
        help="Path to docs-level section applicability / additions JSON",
    )
    args = parser.parse_args()

    bundle = json.loads(Path(args.bundle).read_text(encoding="utf-8"))
    applicability = _load_applicability(Path(args.applicability))
    out_dir = Path(args.out_dir)

    industries = sorted((bundle.get("industry_modules") or {}).keys())
    industries.append("generic")

    failures: list[str] = []
    for industry in industries:
        export_path = out_dir / f"{industry}.json"
        if not export_path.exists():
            failures.append(f"Missing export: {export_path}")
            continue
        exported = json.loads(export_path.read_text(encoding="utf-8"))
        expected = _slice_bundle(bundle, industry, applicability)
        # Exports can include additional review metadata; validate core payload only.
        core_exported = {
            "common_skeleton": exported.get("common_skeleton"),
            "industry_modules": exported.get("industry_modules"),
            "metadata": exported.get("metadata"),
        }
        if core_exported != expected:
            failures.append(f"Mismatch: {export_path}")

    if failures:
        raise SystemExit("Export validation failed:\n- " + "\n- ".join(failures))

    print(f"OK: {len(industries)} exports validated.")


if __name__ == "__main__":
    main()
