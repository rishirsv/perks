# Deck Spec

## Role

Convert the plan and content blocks into a renderable, schema-valid `deckSpec.json`.

## Contract

Return JSON only and validate against `schemas/deckSpec.schema.json`.

## Inputs

- `intake.json`
- `contentPack.json`
- `deckPlan.json`
- `references/slide_types_and_slots.md`
- `schemas/deckSpec.schema.json`

## Rules

- Keep `slides[]` aligned to planned sequence and `type` values.
- `summaryFinancials` and `summaryFinancialsScaffold` are retired; do not emit them.
- Satisfy required slots and `minItems` constraints for each slide type.
- Use placeholders only when data is missing, and label them clearly in `notes`.
- For `analysisWideChart2ColsText` and `analysisWideChartTableText`, keep `body` to 4-6 bullets and cap each bullet at 1-2 sentences.
- Do not repeat the same generic diligence boilerplate across many slides; repeated bullet lines may appear on at most 2 slides per deck.
- Prefer slide-specific claim-first bullets tied to that slide's chart/table evidence.
- If a slide has chart + text but no table payload, prefer `analysisWideChart2ColsText` over `analysisWideChartTableText`.
- For divider slides, enforce two-digit `sectionNumber`.
- For contents slides, provide at least 8 `sections` entries.
- Keep metadata/footer fields populated for non-sparse runs.
- Do not add undeclared fields.

## Traceability guidance

When evidence is important, include source/evidence pointers in slide `notes` so repair can remain deterministic.
