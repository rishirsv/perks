# kpmg-pptx-gen — Architecture

This repo generates brand-compliant PowerPoint decks from structured JSON by extracting a source PPTX template into a code-encoded wrapper, then filling that wrapper with content and rendering QA outputs (PDF/PNGs) for review.

## System boundaries

- In scope: template extraction + codegen, deck generation/builders, sample inputs, QA rendering + compare utilities, baseline references.
- Out of scope: committing large generated artifacts (PPTX/PDF/PNGs) unless explicitly intended as baselines.

## Project overview

Plain-language model:

- A PowerPoint template contains the “look” (masters, fonts, colors, layout boxes).
- The extractor reads that template and produces two generated files:
  - `template.json` (tokens + layout metadata)
  - `template.js` (a PptxGenJS wrapper that wires masters and builders together)
- The generator reads a deck JSON file and produces a new PPTX that matches the template style.
- QA tools render PPTX → PDF → per-slide PNGs to review and diff changes.

Core loop:

1. Update template PPTX (if needed)
2. Regenerate wrapper (`template.js` / `template.json`)
3. Generate a deck PPTX from a JSON spec
4. Render PDF/PNGs and review / compare against baselines

## Repository layout

```text
kpmg-pptx-gen/
  extractor/                 # Python: PPTX parsing + template extraction/codegen
  generator/                 # Node: PptxGenJS runtime + slide builders
  qa/                        # Python: PPTX→PDF→PNG rendering + visual compare helpers
  templates/                 # Source PPTX templates + generated wrappers
  references/                # Baselines (optional, keep small)
  samples/                   # Example deck JSON inputs
  docs/                      # Spec + project plan
```

## Stack

- Runtime/tooling: Node.js, Python 3
- Library: PptxGenJS (deck generation)
- External binaries (optional QA): LibreOffice (`soffice`), poppler (`pdftoppm`)
- Tests: `python3 -m unittest`

## Key files (what to read first)

- `docs/SPEC.md` — current spec (what the repo is supposed to do)
- `docs/PROJECT-PLAN.md` — current plan (what we’re improving next)
- `cli.py` — entrypoint for template extraction/codegen
- `templates/kpmg-diligence/template.js` — generated wrapper used to create decks
- `generator/index.js` — deck generation CLI entrypoint
- `generator/tokens.js` — typography/colors/layout defaults
- `generator/builders/` — slide builders (content → PptxGenJS primitives)
- `qa/render.py` — PPTX→PDF→PNG pipeline

## Architecture views

### Building blocks (static map)

```mermaid
flowchart LR
  A[templates/.../*.pptx] --> B[extractor (Python)]
  B --> C[templates/.../template.json]
  B --> D[templates/.../template.js]
  E[samples/*.json] --> F[generator (Node/PptxGenJS)]
  C --> F
  D --> F
  F --> G[outputs/*.pptx]
  G --> H[qa/render.py]
  H --> I[outputs/*.pdf + outputs/*_pdf_png/*.png]
```

### Runtime scenarios

1) Regenerate the template wrapper
- Entry point: `npm run template:generate` (invokes `cli.py` / extractor codegen)
- Result: overwrites `templates/kpmg-diligence/template.js` and `templates/kpmg-diligence/template.json`

2) Generate a deck from JSON
- Entry point: `node generator/index.js --in <deck.json> --out <deck.pptx>`
- Steps:
  - Validate deck spec (`generator/validate.js`)
  - Build PPTX via generated wrapper + builders
  - Write PPTX to `outputs/` (recommended)

3) Render review images
- Entry point: `qa/render.py`
- Steps:
  - Convert PPTX → PDF (LibreOffice)
  - Convert PDF → PNGs (poppler)

## Architecture decisions

| Decision | Why | Tradeoffs |
|---|---|---|
| Use PptxGenJS for generation | Predictable, scriptable deck generation | Some PowerPoint behaviors (autofit, advanced layout) aren’t perfectly reproducible |
| Keep `template.js` generated | Template updates should flow from PPTX → code, not hand edits | Requires disciplined regen workflow |
| Treat `outputs/` as throwaway | Repo stays shareable; artifacts don’t bloat git | Need a clear “run folder” convention to find latest outputs |
| Prefer pagination over autoshrink | Consistent typography; avoids unreadable dense slides | Needs good heuristics to avoid awkward splits |

## Verification

- Regenerate template wrapper:
  - `npm run template:generate`
- Generate a deck:
  - `RUN_ID=$(date +%Y-%m-%d_%H%M%S); OUT_DIR=outputs/runs/$RUN_ID/nvidia; mkdir -p \"$OUT_DIR\"; node generator/index.js --in samples/v1-nvidia-v2.json --out \"$OUT_DIR/deck.pptx\"`
- Generate a deck with strict checks (overlap + overflow):
  - `RUN_ID=$(date +%Y-%m-%d_%H%M%S); OUT_DIR=outputs/runs/$RUN_ID/nvidia; mkdir -p \"$OUT_DIR\"; node generator/index.js --in samples/v1-nvidia-v2.json --out \"$OUT_DIR/deck.pptx\" --strict`
- Render PNGs:
  - `python3 -c \"from pathlib import Path; from qa.render import render_pptx_to_pngs_via_pdf; render_pptx_to_pngs_via_pdf(Path('outputs/latest/nvidia/deck.pptx'), Path('outputs/latest/nvidia/deck_pdf_png'))\"`
