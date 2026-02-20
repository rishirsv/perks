# Diligence+ Visual Parity Checklist

## Scope
- Canonical template: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/pptx-templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx`
- Generated deck (all layouts): `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/runs/2026-02-20_120500/layouts-all-blank-v4-body10.pptx`
- Template grids: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/compare/template-v2.1-grid-1.jpg`, `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/compare/template-v2.1-grid-2.jpg`
- Generated grid: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/compare/layouts-all-blank-v4-body10-grid.jpg`
- Real report reference (TS report writer): `/Users/rishi/Code/ai-tools/chatgpt/ts-report-writer/reports/Project Autobahn - Report.pptx`
- Real report PNGs: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/compare/parity/ts-report-autobahn/slide-*.png`
- Latest generated sample PNGs: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/compare/parity/generated-contract/slide-*.png`

## Checklist (8-10 key comparisons)
- [ ] Cover slide: template slide `0` vs generated slide `0`.
- [ ] Contents slide: template slide `2` vs generated slide `1`.
- [ ] Summary financials: template slide `5` vs generated slide `6`.
- [ ] Profit & loss overview scaffold: template slide `8` vs generated slide `5`.
- [ ] Analysis wide chart + two columns: template slide `?` representative vs generated slide `8`.
- [ ] Analysis narrow table: template slide `?` representative vs generated slide `10`.
- [ ] Divider dark: template divider layout vs generated slide `2` or `3`.
- [ ] Divider light: template divider layout vs generated slide `4`.
- [ ] Quality of earnings scaffold: template slide `9` vs generated slide `14`.
- [ ] Back cover: template ending slide vs generated slide `16`.

## Master Chrome Checks
- [ ] Footer logo matches template coordinates.
- [ ] Legal line and classification line spacing match template baseline.
- [ ] Slide number location and color match template.

## Notes
- Use this checklist as a manual parity gate before promoting template package updates.
- Record each check as `Pass`, `Minor delta`, or `Fail` with screenshot references.
- Keep iterating with a compare loop: patch slots/master/layout -> regenerate PPTX -> export PNG -> re-check against TS report writer references.
