---
name: kpmg-slidegen
description: Generate and repair KPMG Diligence+ slides and decks through a deterministic pipeline (intake, content pack, deck plan, deck spec, render, QA, repair) with strict schema contracts and DeckSpec-only remediation. Use when producing client-ready diligence decks, section packs, or single slides from source materials without inventing numbers.
---

# KPMG SlideGen

Run this skill as a contract-first orchestrator around the deterministic renderer.

## Pipeline

Execute stages in this order:

1. Run `prompts/00_intake.md` and save `intake.json`.
2. Run `prompts/10_content_pack.md` and save `contentPack.json`.
3. Run `prompts/20_deck_plan.md` and save `deckPlan.json`.
4. Run `prompts/30_deck_spec.md` and save `deckSpec.json`.
5. Validate artifacts with `scripts/validate_json.js`.
6. Render with `scripts/render_strict.js`.
7. If QA fails, run `prompts/40_repair.md` and edit DeckSpec only.

## Hard rules

- Do not invent facts, numbers, or sources.
- Use only approved slide `type` values from bundled schemas.
- Keep prompts schema-first; do not embed long skeleton JSON that can drift.
- Treat `deckSpec.json` as the only editable artifact during repair.
- Keep assumptions explicit in slide or deck `notes` when data is missing.

## Canonical runtime anchors

- Template slot source-of-truth: `templates/kpmg-diligence/package/layouts.json`
- Renderer entrypoint: `generator/index.js`
- Generator default template: `kpmg-diligence`
- Canonical schemas to sync from: `schemas/*.schema.json`

## Deterministic wrappers

- Use `scripts/new_run_dir.js` to create run folders under `outputs/runs/<runId>/`.
- Use `scripts/validate_json.js` for fast artifact checks.
- Use `scripts/render_strict.js` for deterministic render + QA gating.
- Use `scripts/contract_sync_check.sh` after schema/layout edits.
- Use `scripts/sync_bundle_from_repo.sh` to refresh schemas/references and sync harness copies.

## Blocked policy

Ask follow-up questions only when missing inputs change deck structure, slide type selection, or numeric interpretation. Otherwise proceed with explicit assumptions.

## References

Load these only when needed:

- `references/template_contract.md`
- `references/slide_types_and_slots.md`
- `references/qa_repair_playbook.md`
- `references/troubleshooting.md`
