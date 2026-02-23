---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 30
source-of-truth: docs/DECK-AUTHORING-PLAYBOOK.md
verification-state: guidance-only
---

# Deck Authoring Playbook (Model-Facing)

Use this playbook when an LLM is writing `deckSpec` content.

Primary objective:

- Produce persuasive, decision-grade slides that are visually clean and easy to review.

Secondary objective:

- Pass schema and QA constraints on the first attempt.

## Authoring algorithm

1. Establish narrative arc.
   - Cover -> section dividers -> core evidence slides -> back cover.
2. For each slide idea, choose layout by evidence type.
   - Narrative only: `oneColumnText` or `twoColumnText`
   - Narrative + chart: `analysisWideChart2ColsText`
   - Table-heavy readout: `analysisNarrowTable`
   - Integrated page: `analysisWideChartTableText`
3. Fill required slots first.
   - Never defer required slots.
4. Add optional slots that improve decision quality.
   - `strapline`, `source`, `heading`, `noteSource`, `bodyStyle`
5. Apply readability controls.
   - Keep title <= hard max.
   - Use inline subheaders for structure in long body arrays.
   - Keep bullets/paragraph blocks concise and non-repetitive.
6. Add sources for every quantitative claim.
   - `chart.source`, `source`, or `noteSource` where relevant.
7. Run preflight self-check.
   - Slot completeness, density, and evidence consistency.

## Layout selection guide

| If your slide must do this | Use this slide type |
|---|---|
| Open or reset chapter context | `dividerDark` or `dividerLight` |
| Show agenda and navigation | `contents` |
| Explain one argument in depth | `oneColumnText` |
| Compare two streams of reasoning | `twoColumnText` |
| Show compact metric table + takeaways | `analysisNarrowTable` |
| Pair narrative with one visual proof | `analysisWideChart2ColsText` |
| Combine chart, table, and synthesis | `analysisWideChartTableText` |
| Summarize 4 themes/pillars | `titleStrapline4TextBoxes` |

## Chart design decisions

Choose chart type by question:

| Question | Chart |
|---|---|
| Which category is bigger? | `bar` |
| How did it change over time? | `line` or `area` |
| How is the total split? | `doughnut` or `pie` |
| Are two variables correlated? | `scatter` |

Rules:

1. Use `bar` by default if uncertain.
2. Keep labels and units explicit.
3. Keep series count modest for readability.
4. Include `chart.source` when numbers are external.
5. Do not assume combo/secondary-axis behavior in current schema.

## Text quality rules

1. Titles should state the claim, not topic only.
2. Straplines should summarize the implication in one sentence.
3. Body text should support the claim with evidence and interpretation.
4. Avoid repeated lines across slides.
5. Use inline subheaders for long text blocks.

## Slot-safe authoring constraints

1. Only use slot names supported by the selected slide type.
2. Keep `bodyStyle` exactly `bullets` or `paragraphs`.
3. For `contents`, supply at least 8 sections.
4. For chart slides, always include `chart.type` and at least one series with `values`.
5. For table slides, always include `headers` and `rows`.

## Common failure patterns to avoid

1. Adding `chart` to non-chart slide types.
2. Titles that exceed max length on text-heavy layouts.
3. Sparse body arrays that miss min item/character targets.
4. Uncited numbers in charts/tables.
5. Overlong bullets that should be split into subheaders + paragraphs.

## Copy-paste prompt scaffold for future model runs

```text
You are writing a deckSpec JSON for KPMG SlideGen.

Follow these source documents exactly:
1) docs/DECKSPEC-SCHEMA.md
2) docs/DECKSPEC-SLOTS-SCHEMA.json
3) docs/DECK-AUTHORING-PLAYBOOK.md

Hard requirements:
- Choose the correct slide type for each idea based on evidence shape.
- Use only slots allowed for each slide type.
- Fill all required slots.
- Keep titles within per-type max length.
- Use straplines and inline body subheaders to improve readability.
- Include source text for quantitative slides.
- Prefer concise, high-signal prose over filler.

Output only valid JSON deckSpec.
Do not include markdown or commentary.
```
