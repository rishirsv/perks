---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 30
source-of-truth: docs/DECKSPEC-SCHEMA.md
verification-state: partially-verified
---

# DeckSpec Schema Guide

Use this file to author `deckSpec` input JSON that renders cleanly and passes QA.

## What this file is
- A practical schema guide for `decks/*.deckSpec.json`.
- A layout-by-layout slot reference from `templates/kpmg-diligence/package/layouts.json`.
- A quick playbook for creating effective slides that avoid overlap and sparse-content warnings.

## Minimal valid deck

```json
{
  "metadata": {
    "title": "Example Deck",
    "author": "KPMG LLP",
    "company": "KPMG LLP",
    "subject": "Due Diligence"
  },
  "slides": [
    {
      "type": "cover",
      "title": "Financial Due Diligence",
      "subtitle": "Target Co - January 2026"
    },
    {
      "type": "divider",
      "sectionNumber": "01",
      "sectionTitle": "Executive Summary"
    },
    {
      "type": "analysisWideChart2ColsText",
      "title": "Key Findings",
      "body": ["Finding 1", "Details...", "Finding 2", "Details..."],
      "chart": {
        "type": "bar",
        "data": [
          { "name": "Revenue", "labels": ["FY24", "FY25"], "values": [60.9, 130.5] }
        ]
      }
    }
  ]
}
```

## Top-level schema

## Required
- `slides`: array of slide objects.

## Optional
- `metadata`: object for PPT metadata and footer values.

## `metadata` fields
- `title`: PPT document title.
- `author`: PPT author.
- `company`: PPT company.
- `subject`: PPT subject.
- `allowSparse`: when `true`, density failures are softened into warnings.
- `year`: fallback for footer year.
- `jurisdiction`: fallback for footer jurisdiction.
- `legalStructure`: fallback for footer legal structure.
- `documentClassification`: footer classification line.
- `officeContactText`: footer contact line.
- `footer`: object with explicit footer fields.

## `metadata.footer` fields
- `year`
- `legalEntityName`
- `jurisdiction`
- `legalStructure`
- `documentClassification`
- `officeContactText`

If `allowSparse` is not enabled, non-demo renders require footer values for year, legal entity, jurisdiction, and legal structure.

## Common slide object pattern
- Every slide must have `type` (string).
- Each `type` has its own required and optional slots.
- Unknown `type` values fail validation.

## Slot value shapes

## `text`
- String.

## `textArray`
- Array of strings (or text objects).
- Used for bullets and narrative blocks.

## `table`
- Object with `headers` (array) and `rows` (array of arrays).

```json
{
  "headers": ["Metric", "Value", "Delta"],
  "rows": [
    ["Revenue", "$130.5B", "+114% YoY"],
    ["Gross Margin", "75.0%", "-570 bps"]
  ]
}
```

## `chart`
- Object with `type` and `data`.
- Each series in `data` should include `values`; labels are strongly recommended.
- Supported chart types used in builders: `bar`, `bar3d`, `line`, `pie`, `doughnut`, `area`, `scatter`, `radar`.

```json
{
  "type": "bar",
  "data": [
    { "name": "Revenue", "labels": ["FY24", "FY25"], "values": [60.9, 130.5] }
  ],
  "opts": { "showValue": true },
  "source": "Source: Company filings"
}
```

## `columns`
- Array (typically 4 items for `titleStrapline4TextBoxes`).
- Each item should have `heading` (or `title`) and `body` array.

```json
[
  { "heading": "Growth", "body": ["Point 1", "Point 2"] },
  { "heading": "Margins", "body": ["Point 1", "Point 2"] },
  { "heading": "Cash", "body": ["Point 1", "Point 2"] },
  { "heading": "Risks", "body": ["Point 1", "Point 2"] }
]
```

## `contentsSections`
- Array used by `contents` slide.
- Each section item typically includes `number`, `title`, optional `items`, optional `pageRange`.
- `pageRange` can be auto-filled from divider sections.

```json
[
  {
    "number": "01",
    "title": "Executive Summary",
    "items": ["Headlines", "Key Risks"]
  }
]
```

## Layout-by-layout slot reference

Legend: `R` = required, `O` = optional.

| Slide type | Template layout | Required slots | Optional slots |
|---|---|---|---|
| `cover` | `Cover page_Right Horizontal Window` | `title` (text, minChars 8, maxChars 100), `subtitle` (text, minChars 12, maxChars 200) | None |
| `divider` | `Divider slide_5` | `sectionNumber` (text, minChars 2, maxChars 2), `sectionTitle` (text, minChars 6, maxChars 80) | None |
| `dividerDark` | `Divider slide_5` | `sectionNumber` (text, minChars 2, maxChars 2), `sectionTitle` (text, minChars 6, maxChars 80) | None |
| `dividerLight` | `Divider slide_2` | `sectionNumber` (text, minChars 2, maxChars 2), `sectionTitle` (text, minChars 6, maxChars 80) | None |
| `contents` | `Contents` | `title` (text, minChars 6, maxChars 40), `sections` (contentsSections, minItems 8) | None |
| `oneColumnText` | (no explicit templateLayout key) | `title` (text, minChars 12, maxChars 700), `body` (textArray, minItems 3, minChars 180) | `strapline` (text, minChars 12, maxChars 700) |
| `qualityOfEarnings` | `One column text` | `title` (text, minChars 12, maxChars 700) | `strapline` (text, minChars 12, maxChars 700), `body` (textArray, minItems 1, minChars 50), `source` (text, minChars 12, maxChars 700) |
| `twoColumnText` | `Two columns text` | `title` (text, minChars 12, maxChars 700), `leftBody` (textArray, minItems 2, minChars 80), `rightBody` (textArray, minItems 2, minChars 80) | `strapline` (text, minChars 12, maxChars 700) |
| `analysis2ColumnsText` | `Analysis_2 columns text` | `title` (text, minChars 12, maxChars 700), `leftBody` (textArray, minItems 2, minChars 80), `rightBody` (textArray, minItems 2, minChars 80) | `strapline` (text, minChars 12, maxChars 700) |
| `analysisNarrowTable` | `Analysis_narrow table` | `title` (text, minChars 12, maxChars 700), `table` (table, minItems 3 rows) | `strapline` (text, minChars 12, maxChars 700), `notes` (text, minChars 12, maxChars 700), `insightTitle` (text, minChars 6, maxChars 80) |
| `analysisWideChart2ColsText` | `Analysis_wide chart + 2 cols text` | `title` (text, minChars 12, maxChars 700), `body` (textArray, minItems 4, minChars 180), `chart` (chart, minItems 1 series) | `strapline` (text, minChars 12, maxChars 700) |
| `analysisWideChartTableText` | `Analysis_wide chart+table+text` | `title` (text, minChars 12, maxChars 700), `body` (textArray, minItems 4, minChars 180), `chart` (chart, minItems 1 series) | `strapline` (text, minChars 12, maxChars 700), `heading` (text, minChars 6, maxChars 120), `table` (table, minItems 3 rows), `noteSource` (text, minChars 12, maxChars 700) |
| `analysisWideChartTableTextScaffold` | `Analysis_wide chart+table+text` | `title` (text, minChars 8, maxChars 90) | `strapline` (text, minChars 12, maxChars 700), `heading` (text, minChars 6, maxChars 120), `body` (textArray, minItems 1, minChars 40), `chart` (chart, minItems 1 series), `table` (table, minItems 3 rows), `noteSource` (text, minChars 12, maxChars 700) |
| `titleStrapline4TextBoxes` | `Title+strapline+4 text boxes` | `title` (text, minChars 12, maxChars 700), `columns` (columns, minItems 4) | `strapline` (text, minChars 12, maxChars 700) |
| `backCover` | `Back cover_2` | None | `disclaimer` (text, minChars 80, maxChars 700), `url` (text, minChars 5, maxChars 60) |

## Slide-type to renderer map
- `cover` -> `addCover`
- `divider` / `dividerDark` / `dividerLight` -> `addDivider`
- `contents` -> `addContentsSlide`
- `twoColumnText` / `analysis2ColumnsText` -> `addTwoColumnTextWithStrapline`
- `oneColumnText` / `qualityOfEarnings` -> `addOneColumnText`
- `analysisNarrowTable` -> `addAnalysisNarrowTable`
- `analysisWideChart2ColsText` -> `addAnalysisWideChart2ColsText`
- `analysisWideChartTableText` -> `addAnalysisWideChartTableText`
- `analysisWideChartTableTextScaffold` -> `addProfitLossOverview`
- `titleStrapline4TextBoxes` -> `addTitleStrapline4TextBoxes`
- `backCover` -> `addBackCover`

## Authoring guidance for effective presentations

## Keep density healthy
- Match or exceed each slide type's `minItems` and `minChars` targets.
- For text-heavy slots, prefer fewer, stronger bullets over many short fragments.
- If repeated long body lines appear across many slides, QA will warn.

## Write for pagination behavior
- The runtime auto-splits dense `body`, `leftBody/rightBody`, and large `table.rows` into continuation slides.
- Continuation slides append `(cont.)` to title.
- Keep each bullet compact to reduce unnecessary auto-splitting.

## Use contents and divider slides together
- Place divider slides before each section's content slides.
- Contents page ranges are auto-computed from divider sections and numbered content slides.

## Chart and table quality
- Include chart `source` when possible for auditability.
- Keep table headers concise and rows consistent in width.
- For mixed chart+table slides, include a short `heading` to frame the takeaway.

## Common failure cases
- Missing `slides` array.
- Unknown slide `type`.
- Missing required slots (for example missing `chart` on chart layouts).
- Wrong slot shape (for example `table.rows` not an array of arrays).
- Very sparse content when `allowSparse` is not enabled.

## Pre-run checklist
- Deck includes `cover`, section `divider` slides, core analysis slides, and `backCover`.
- All required slots per slide type are present.
- `metadata.footer` has non-demo required fields.
- Chart series include numeric `values`.
- Table rows are complete and consistently formatted.

## Verification method
- Run:

```bash
node generator/index.js \
  --in decks/input.deckSpec.json \
  --out outputs/my-run/deck.pptx \
  --qa-out outputs/my-run/qa.json
```

- Confirm `qa.json` has no blocking validation errors before sharing the deck.
