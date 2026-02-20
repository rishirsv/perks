---
name: kpmg-slidegen
description: Build, validate, render, and repair deterministic KPMG Diligence+ slide decks from structured inputs (content pack, deck plan, and deck spec), including schema checks, density QA, pagination, and master chrome verification.
---

# KPMG SlideGen

Use this skill for Diligence+ deck generation where fidelity, repeatability, and QA traceability matter.

## What this skill owns

- Orchestration UX: intake -> content pack -> deck plan -> deck spec -> render -> QA -> repair.
- Strict contracts: schema-validated payloads and catalog-approved slide types.
- Deterministic runtime: no AI layout choices during render.
- QA gating: sparse/missing/master mismatch flagged and repairable by hook.

## Source of truth

- Canonical template inputs:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/pptx-templates/`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/kpmg-diligence/`
- Runtime renderer:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/renderer/`
- Contracts:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/schemas/deckSpec.schema.json`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/schemas/contentPack.schema.json`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/schemas/qaReport.schema.json`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/diligence-plus/catalog/slideCatalog.json`

## Orchestrator workflow

1. Intake
- Run prompt: `prompts/intake.md`.
- Extract objective, audience, must-haves, exclusions, deadlines, and blockers.

2. Content pack
- Run prompt: `prompts/content_pack.md`.
- Convert source material into slot-ready facts and evidence pointers.
- Validate against `schemas/contentPack.schema.json`.

3. Deck plan
- Run prompt: `prompts/deck_plan.md`.
- Choose narrative arc and slide types from `slideCatalog.json` only.
- Validate against `schemas/deckPlan.schema.json`.

4. Deck spec
- Run prompt: `prompts/deck_spec.md`.
- Fill slot contracts and satisfy density requirements.
- Validate against `schemas/deckSpec.schema.json`.

5. Render + QA
- Render with `generator/index.js`.
- Review generated `*.qa.json` for:
  - missing slots
  - thin/sparse slides
  - overflow risks + pagination
  - master applied checks

6. Repair loop
- Run prompt: `prompts/repair.md`.
- Edit `deckSpec` only using QA hooks/suggestions.
- Re-render until issues are resolved or explicitly accepted.

## QA gate defaults

- Missing required slots: fail.
- Too sparse slides: fail (unless explicitly `allowSparse`).
- Master mismatch: fail.
- Overlap checks: on by default.

## Blocking policy

- Ask user targeted questions only when blocked by missing critical facts.
- Otherwise proceed with labeled `assumptions` and `placeholders`.

## Visual parity loop

Use rendered PNG comparisons as a standing quality loop:
- Expected references:
  - `/Users/rishi/Code/ai-tools/chatgpt/ts-report-writer/reports/`
- Generated outputs:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/`
- Compare representative slides each run (cover, contents, divider dark/light, profit and loss overview, summary financials, QoE, closing).
- Record visual misses, patch contracts/runtime, regenerate, and repeat.

## Guardrails

- Keep generated template package data-only (`tokens.json`, `layouts.json`, `assets/manifest.json`).
- Keep runtime logic outside generated folders.
- Do not introduce non-deterministic fallback layout logic.
