# DeckSpec Schema Reference

Use this reference when drafting or validating slide objects.

## Top-level shape

A valid deck spec has:

1. `metadata` object.
2. `slides` array.

## Supported slide types

1. `cover`
2. `divider`
3. `dividerDark`
4. `dividerLight`
5. `contents`
6. `oneColumnText`
7. `twoColumnText`
8. `analysisNarrowTable`
9. `analysisWideChart2ColsText`
10. `analysisWideChartTableText`
11. `titleStrapline4TextBoxes`
12. `backCover`

## Required slots by type

1. `cover`: `title`, `subtitle`.
2. `divider`/`dividerDark`/`dividerLight`: `sectionNumber`, `sectionTitle`.
3. `contents`: `title`, `sections` (minimum 8 sections).
4. `oneColumnText`: `title`, `body`.
5. `twoColumnText`: `title`, `leftBody`, `rightBody`.
6. `analysisNarrowTable`: `title`, `table`, `insights`.
7. `analysisWideChart2ColsText`: `title`, `body`, `chart`.
8. `analysisWideChartTableText`: `title`, `body`, `chart`.
9. `titleStrapline4TextBoxes`: `title`, `columns` (minimum 4).
10. `backCover`: no required slots.

## Common optional slots

1. `strapline` on narrative and analysis slides.
2. `bodyStyle` for text-heavy slides (`bullets` or `paragraphs`).
3. `source` on `oneColumnText`.
4. `notes` and `insightTitle` on `analysisNarrowTable` (with `insights` required).
5. `heading`, `table`, and `noteSource` on `analysisWideChartTableText`.
6. `disclaimer` and `url` on `backCover`.

## Critical constraints

1. Respect title max lengths, especially 50-char constraints on text-heavy layouts.
2. Use chart slots only on chart-capable layouts (`analysisWideChart2ColsText`, `analysisWideChartTableText`).
3. Use table slots only on table-capable layouts (`analysisNarrowTable`, optional in `analysisWideChartTableText`).
4. Keep `sectionNumber` as two digits for divider slides.
5. Ensure minimum array lengths are satisfied (`sections`, `body`, `columns`, and table rows).

## Chart object expectations

1. Include `type` and `data`.
2. Each series should include `name`, `labels`, and `values`.
3. Keep label/value lengths aligned within each series.
4. Add `opts` and `source` where useful for readability and traceability.

## Table object expectations

1. Include `headers` and `rows`.
2. Keep row width aligned to header count.
3. Keep labels concise enough to avoid severe overflow.
