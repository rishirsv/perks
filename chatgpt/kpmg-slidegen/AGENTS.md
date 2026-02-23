---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 30
source-of-truth: AGENTS.md
verification-state: partially-verified
---

# AGENTS

## Purpose
This repo converts `deckSpec` JSON files into `.pptx` outputs with a consolidated QA JSON report.

## Scope
- Edit generation logic only in `generator/`.
- Keep template contracts in `templates/kpmg-diligence/package/`.
- Treat `decks/lorem-comprehensive.deckSpec.json` and `decks/layout-flex-one-per-layout.deckSpec.json` as example inputs, not schema definitions.

## Working Rules
- Preserve runtime-minimal design; avoid adding unnecessary frameworks.
- Keep docs and code consistent when changing slide types, slot rules, or QA shape.
- Validate changes by running the generator with explicit `--in`, `--out`, and `--qa-out`.

## Quick Start
```bash
node generator/index.js \
  --in decks/lorem-comprehensive.deckSpec.json \
  --out outputs/my-run/deck.pptx \
  --qa-out outputs/my-run/qa.json
```

## Key Files
- `generator/index.js`: CLI orchestration and QA output.
- `generator/runtime/render-deck.js`: validation + rendering dispatch.
- `generator/runtime/paginate.js`: overflow splitting.
- `generator/strict/overlap.js`: overlap checks.
- `templates/kpmg-diligence/package/layouts.json`: slide-type layout contract.
