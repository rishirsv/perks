# KPMG SlideGen

Template-driven generator that converts `deckSpec` JSON inputs into:
- a branded PowerPoint deck (`.pptx`)
- a consolidated QA report (`.json`)
- optional visual artifacts (preview PNGs, montage PNG, visual overflow diagnostics)

## What This Repo Owns

- Runtime generation pipeline in `generator/`
- Template contracts in `templates/kpmg-diligence/package/`
- Skill bundle packaging and portability checks in `skills/kpmg-slides/`

## Contributor Guardrails

- Edit generation logic only in `generator/`.
- Keep template contracts in `templates/kpmg-diligence/package/`.
- Treat `decks/` as input fixtures (not schema source).
- Keep runtime minimal; avoid unnecessary frameworks.
- Keep docs and code aligned when changing slide types, slot rules, or QA shape.
- Validate with explicit CLI paths (`--in`, `--out`, `--qa-out`).
- Do not add backward-compatibility fallback paths unless explicitly requested.

## Prerequisites

- Node.js 18+
- npm

For strict visual overflow and postprocess flows:
- Python 3 (`python3` or `PYTHON_BIN`)
- LibreOffice (`soffice`)
- Poppler tools (`pdfinfo`, `pdftoppm`)
- Python packages: `pdf2image`, `Pillow`, `python-pptx`, `numpy`

## Install

```bash
npm install
```

## Quick Start

Preferred baseline command (explicit input/output paths):

```bash
node generator/index.js \
  --in decks/scenario02-saas-mid-diligence.deckSpec.json \
  --out outputs/my-run/deck.pptx \
  --qa-out outputs/my-run/qa.json
```

Strict mode (fail-closed overflow gate):

```bash
node generator/index.js \
  --in decks/scenario02-saas-mid-diligence.deckSpec.json \
  --out outputs/my-run/deck.pptx \
  --qa-out outputs/my-run/qa.json \
  --strict
```

With visual postprocess artifacts:

```bash
node generator/index.js \
  --in decks/scenario02-saas-mid-diligence.deckSpec.json \
  --out outputs/my-run/deck.pptx \
  --qa-out outputs/my-run/qa.json \
  --with-preview \
  --with-montage \
  --with-visual-overflow
```

## CLI Reference

```bash
node generator/index.js --in <deck.json> --out <out.pptx> \
  [--qa-out <out.qa.json>] \
  [--allow-sparse] \
  [--strict] \
  [--skip-overlap] \
  [--template <name>] \
  [--with-preview] \
  [--with-montage] \
  [--with-visual-overflow] \
  [--preview-width <px>] \
  [--preview-height <px>] \
  [--preview-dir <path>] \
  [--montage-out <path>] \
  [--montage-cols <n>] \
  [--montage-label-mode <number|filename|none>] \
  [--visual-overflow-pad-px <px>]
```

## Common Workflows

- `npm run smoke`: fast end-to-end generation smoke test.
- `npm run qa`: contract + registry + smoke + strict drift checks.
- `npm run test:contracts`: layout contract coverage.
- `npm run test:contracts:registry`: registry/policy/template parity checks.
- `npm run test:qa:golden`: QA golden snapshot regression.
- `UPDATE_GOLDEN=1 npm run test:qa:golden`: refresh QA golden snapshot intentionally.
- `npm run test:postprocess`: postprocess success/failure/unavailable matrix.
- `npm run test:strict:overflow-fail-closed`: strict overflow fail-closed behavior.
- `npm run test:visual:all`: visual regression suites.
- `npm run validate:visual`: visual runtime dependency preflight.
- `npm run skill:sync && npm run skill:verify`: skill bundle sync + portability verification.

## Output Artifacts

Main outputs per run:
- `<out>.pptx`
- `<qa-out>.json` (or `<out>.qa.json` if `--qa-out` is omitted)

QA report includes:
- `summary` and issue counters
- `errors`, `warnings`, `missingSlots`, `slotIssues`, `slotMetrics`
- `densityFindings`, `thinSlides`, `sparseSlides`
- `pagination`, `overflowEvents`, `overflowRisks`
- `overlapSummary`, `overlapFindings`
- `strictOverflow`
- optional `postprocess` and `summary.postprocess`

Optional postprocess artifacts:
- `preview/slide-<n>.png`
- `montage.png`
- overflow diagnostic image paths in QA

## Troubleshooting

- `npm run generate` or `npm run generate:layouts` fails with missing deck file:
  - Those scripts currently point at fixtures not present in `decks/`; use explicit CLI commands above.
- `Usage: node generator/index.js --in ... --out ...`:
  - `--in` and `--out` are required.
- `Unknown type: <type>`:
  - Type must exist in both `templates/kpmg-diligence/package/layouts.json` and `generator/runtime/slide-registry.js`.
- `Missing required template package file: ...`:
  - Ensure `tokens.json`, `layouts.json`, `pagination-policy.json`, and `assets/manifest.json` exist.
- `Missing required footer metadata for non-demo render`:
  - Provide `metadata.footer.year`, `legalEntityName`, `jurisdiction`, and `legalStructure`.
- Strict mode fails with `visual_overflow_*` reason:
  - Strict is fail-closed; ensure Python + rasterization dependencies are available.

## Documentation Map

- `ARCHITECTURE.md`: runtime architecture and module boundaries.
- `docs/project-specs/kpmg-slidegen-spec.md`: system-level specification.
- `AGENTS.md`: working rules and repo scope.
- `docs/workflows/add-layout-contract.md`: add/extend layout contract workflow.
- `docs/workflows/deterministic-layout-onboarding.md`: deterministic layout onboarding.
- `docs/workflows/golden-regression-fixture.md`: QA golden fixture workflow.
- `testing/README.md`: data preparation helpers.
- `testing/manual-test-plan.md`: manual verification plan.
- `testing/data/SCENARIO_INPUTS.md`: scenario fixture map.
