# QA Repair Playbook

Use this table to translate `qaReport.json` findings into deterministic DeckSpec edits.

| QA signal | Meaning | Deterministic repair action |
|---|---|---|
| `missingSlots[]` | Required slot absent/empty | Fill required slot with factual content or explicit placeholder; keep type unchanged. |
| `sparseSlides[]` | Slide below acceptable density | Add concise bullets/rows/series to required narrative slots, or split into continuation slide. |
| `thinSlides[]` | Borderline density | Improve content if evidence exists; otherwise keep and leave traceability note in `notes`. |
| `slotIssues[].code=below_min_items` | Slot has too few items | Raise item count to schema min for the affected slot. |
| `slotIssues[].code=type_mismatch` | Wrong payload shape | Convert value to schema-valid shape for that slot kind. |
| `masterApplied` anomalies | Master/layout mismatch risk | Keep slide `type`; fix required slots and rerender before changing slide type. |
| `overlapSummary.severeCount>0` | Hard overlap | Split content across continuation slides; shorten dense bullets/labels. |
| `overflowEvents[]` | Auto-pagination happened | Preserve split unless narrative breaks; if merged, tighten content first. |

## Repair order

1. Fix missing required slots.
2. Fix schema/type mismatches.
3. Fix density/min-items failures.
4. Address overlap/overflow risks.
5. Re-render and re-check QA.

## Guardrails

- Edit `deckSpec` only.
- Keep slide sequence stable unless split is required.
- Do not invent numbers.
