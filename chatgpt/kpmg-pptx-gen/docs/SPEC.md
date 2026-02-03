# KPMG PPTX Generator — Specification

**Last updated:** 2026-02-03

## What this repo does

This repo generates **brand-compliant PowerPoint decks** from structured JSON by:

1) **Extracting** a source PPTX template into a code-encoded wrapper (`template.js`) + metadata (`template.json`)
2) **Generating** a new PPTX by filling that wrapper from a deck JSON spec
3) **Rendering QA outputs** (PPTX → PDF → PNGs) for review and regression comparisons

## Non-goals

- Editing PPTX XML directly during generation (generation is PptxGenJS-driven)
- Committing large generated artifacts (PPTX/PDF/PNGs) to git, except intentional baselines

## Source of truth

- Template visuals and brand rules live in: `templates/kpmg-diligence/`
- Generated wrapper outputs (do not hand-edit):
  - `templates/kpmg-diligence/template.js`
  - `templates/kpmg-diligence/template.json`
- Content inputs live in: `samples/`

## High-level architecture

```mermaid
flowchart LR
  A[Template PPTX] --> B[Extractor (Python)]
  B --> C[template.json]
  B --> D[template.js (generated wrapper)]
  J[Content JSON] --> E[Generator (Node/PptxGenJS)]
  C --> E
  D --> E
  E --> O[Output PPTX]
  O --> Q[QA: PDF/PNGs + compares]
```

## Output policy

- `outputs/` is a **throwaway workspace** for generated artifacts (PPTX/PDF/PNGs/compare images).
- Baselines (if any) should be kept separate and clearly named under `references/baselines/`.

## Deck JSON (current expectations)

The generator accepts a deck spec shaped like:

- `title`, `meta` (optional)
- `slides[]` with:
  - `type` (maps to a builder)
  - `title` (optional per layout)
  - `strapline` (optional)
  - content fields per type (bullets, table model, chart model, etc.)

Validation is enforced in `generator/validate.js`.

## Slide types (current)

The set evolves, but today the repo supports a practical subset used by the NVIDIA sample deck:

- `cover`
- `divider`
- `oneColumnText`
- `twoColumnText` / `twoColumnTextWithStrapline`
- `analysisNarrowTable` (table + right-side narrative)
- `analysisWideChart2ColsText`
- `analysisWideChartTableText`
- `titleStrapline4TextBoxes`
- `backCover`

## Styling rules (current)

This repo targets a “Project North”-style diligence look:

- Font family: **Arial** (headings use bold weight)
- Slide title: **40pt** (some layouts use a slightly condensed title size)
- Section heading: **24pt**
- Body text: **9pt**, with standard paragraph spacing
- Bullets: PowerPoint-standard hanging indent + spacing (see `generator/tokens.js`)
- Charts: white chart/plot backgrounds, template palette colors

The single source of truth for these defaults is `generator/tokens.js`.

## QA outputs (current)

Preferred rendering pipeline:

- PPTX → PDF: LibreOffice (`soffice`)
- PDF → PNG: poppler (`pdftoppm`)

Compare outputs are image-based (expected | actual | diff) for fast visual review.

## Strict mode (optional)

The generator supports a **strict mode** that runs layout overlap checks and overflow detection:

- Overlap detection runs in JS against slide objects.
- Overflow detection renders with padding and inspects margins.

Example:

```bash
node generator/index.js --in samples/v1-nvidia-v2.json --out outputs/strict-smoke/deck.pptx --strict
```
