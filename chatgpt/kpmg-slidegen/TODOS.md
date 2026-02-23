---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 14
source-of-truth: TODOS.md
verification-state: partially-verified
---

# TODOs

## Now
- [x] Add a tiny smoke script to run one sample generation and assert both output files exist.
- [x] Add a documented `deckSpec` schema reference (required and optional slide fields).
- [x] Add one regression script covering postprocess QA shape for success/failure/unavailable flows.
- [x] Add one comprehensive visual validation script that checks individual PNG slides and montage output.
- [x] Add a comprehensive lorem deck to stress-test supported layouts.
- [ ] Add one golden QA fixture for regression checks on report shape.

## Next
- [ ] Add a brief release checklist for template package changes.
- [ ] Add one failing example deck for validation behavior testing.
- [ ] Add CI wiring for `npm run smoke` and `npm run test:postprocess`.
- [ ] Add optional CI profile for visual validation in environments where slides Python deps are installed.
- [ ] Add a chart `opts` catalog with approved presets by chart type for model-safe authoring.
- [ ] Add a golden deckspec example library (one polished reference per supported slide type with rationale).
- [ ] Add a QA interpretation guide mapping common errors/warnings to concrete fix actions.
