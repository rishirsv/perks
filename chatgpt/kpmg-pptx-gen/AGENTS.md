# Repository Guidelines (kpmg-pptx-gen)

This repo compiles a PowerPoint template into a code‑encoded `PptxGenJS` template, then fills it from JSON to generate decks with regression QA via slide screenshots.

## Scope

- In scope: extractor + template codegen, generator/builders, sample data, QA render tools, docs.
- Out of scope: committing large binary outputs (PPTX/PDF/PNGs) unless explicitly requested as baselines.

## Quick Commands

- Generate template wrapper (regenerates `templates/kpmg-diligence/template.js` and `templates/kpmg-diligence/template.json`):
  - `npm run template:generate`
- Generate a deck:
  - `RUN_ID=$(date +%Y-%m-%d_%H%M%S); OUT_DIR=outputs/runs/$RUN_ID/nvidia; mkdir -p "$OUT_DIR"; node generator/index.js --in samples/v1-nvidia-v2.json --out "$OUT_DIR/deck.pptx"`
- Render slide screenshots (preferred: PPTX → PDF → PNG) into `outputs/`:
  - `python3 -c "from pathlib import Path; from qa.render import render_pptx_to_pngs_via_pdf; render_pptx_to_pngs_via_pdf(Path('outputs/latest/nvidia/deck.pptx'), Path('outputs/latest/nvidia/deck_pdf_png'))"`
- Run tests:
  - `python3 -m unittest`

## Safety Boundaries

- Treat `templates/kpmg-diligence/template.js` as generated: edit `extractor/codegen.py` and re-run `npm run template:generate`.
- Keep core extraction logic stdlib‑first on Python; QA utilities may depend on external binaries (`soffice`, `pdftoppm`) but should remain optional.

## More Detail

- Spec: `docs/SPEC.md`
- Project plan: `docs/PROJECT-PLAN.md`
- Generator notes: `generator/AGENTS.md`
- QA notes: `qa/AGENTS.md`
- Template notes: `templates/kpmg-diligence/AGENTS.md`
