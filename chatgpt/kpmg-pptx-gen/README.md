# kpmg-pptx-gen

Core docs live in `docs/`:
- `docs/SPEC.md`
- `docs/PROJECT-PLAN.md`

Project assets and artifacts:
- `templates/` — source PPTX + reusable template assets (logos, gradients, etc.)
- `extractor/` — Python extraction utilities (foundation deliverables)
- `generator/` — JavaScript prototypes/builders
- `references/` — optional baselines / reference material (keep small)
- `outputs/` — generated PPTX/PDF/PNGs and QA compare artifacts (treat as throwaway)

Dependencies:
- `requirements/requirements.txt` is intentionally minimal (stdlib-only extractor foundations).
- `requirements/requirements-qa.txt` contains optional rendering/QA dependencies.

Run tests:
- `python3 -m unittest discover -s tests -p 'test_*.py'`

Generate a demo deck:
- `npm install`
- `node generator/validate.js --in samples/demo.json`
- `node generator/index.js --in samples/demo.json --out outputs/demo.pptx`

Regenerate `templates/kpmg-diligence/template.js` + `template.json`:
- `python3 cli.py extract --template templates/kpmg-diligence --pptx "templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx"`

Outputs + QA workflow:
- `docs/SPEC.md`
- `docs/PROJECT-PLAN.md`
- `generator/AGENTS.md`
- `qa/AGENTS.md`
- `templates/kpmg-diligence/AGENTS.md`
