# Research: KPMG SlideGen Orchestrator Skill and Contracts

## Research Questions

- What should the orchestrator skill own end-to-end so deck generation is deterministic, repairable, and non-sparse?
- Which patterns from existing `references/` skills are reusable for prompt-pack design, and which are explicitly not a fit?
- How strong are current local contracts (`deckSpec`, `contentPack`, `qaReport`, `slideCatalog`) versus the required strict slot/density/repair behavior?
- What schema and QA fields are still missing to support actionable repair loops (not just pass/fail)?
- How should `masters` be handled so chrome correctness (footer/legal/classification/paging) is contract-level, not best effort?
- What is the lowest-risk path that upgrades this repo without fighting existing runtime/template structure?

## Summary

The repo already has a strong deterministic core: slot-aware layout contracts, type-aware validation, density scoring, pagination, and QA reporting. The main gap is contract completeness and orchestration glue, not rendering capability. The new orchestrator skill should be built as a strict pipeline (`intake -> contentPack -> deckPlan -> deckSpec -> render -> qa -> repair`) with explicit assumptions when blocked, and no silent fallbacks. The biggest high-impact upgrades are: make `slideCatalog` fully expressive, tighten `deckSpec` to catalog-enum-driven slide types and strict slot payloads, and enrich `qaReport` with structured `overflowRisks`, `pagination`, `masterApplied`, and slot-level metrics for deterministic repair prompts.

## Key Points / Options

- **Option A: Minimal-change overlay**
  - Keep existing runtime in `generator/` and `renderer/` as-is, and only flesh out `.agents/skills/kpmg-slidegen/*` prompt+schema docs.
  - Pros: fastest.
  - Cons: won’t prevent drift between skill contracts and actual renderer behavior.

- **Option B: Contract-first alignment (recommended)**
  - Treat `templates/diligence-plus/catalog/slideCatalog.json`, `schemas/deckSpec.schema.json`, and `schemas/qaReport.schema.json` as runtime-facing contracts and align orchestrator prompts to them.
  - Keep renderer deterministic and unchanged in principle; tighten schemas + emitted QA structure.
  - Pros: highest reliability with low architecture churn.

- **Option C: New parallel runtime under `templates/diligence-plus/runtime/*`**
  - Build a second runtime stack and migrate gradually.
  - Pros: clean separation long-term.
  - Cons: duplicate logic and drift risk while two runtimes coexist.

## Comparison

| Option | Effort | Risk | Contract Fidelity | Time to Value |
|---|---:|---:|---:|---:|
| A: Minimal overlay | Low | Medium | Low-Medium | Fast |
| B: Contract-first alignment | Medium | Low | High | Fast-Medium |
| C: Parallel runtime rewrite | High | High | High (eventual) | Slow |

**Recommendation:** Choose **Option B**.

## Codebase Patterns

- `templates/kpmg-diligence/package/layouts.json` already encodes slot contracts (`kind`, `required`, `minItems`, `minChars`, `renderingHints`) and per-slide density targets.
- `renderer/validate.ts` performs type-aware slot validation and builds slot issues + repair hooks.
- `renderer/density.ts` classifies slides as `OK`, `thin but acceptable`, or `too sparse, should be repaired or flagged`.
- `renderer/qa.ts` maps issue kinds to deterministic repair hooks (`addBullets`, `addTableRows`, `insertPlaceholderChartCaption`, etc.).
- `generator/index.js` already emits a QA artifact with density findings, slot issues, pagination decisions, overflow events, overlap summary, and repair suggestions.
- `generator/runtime/render-deck.js` chooses master variants by slide type and divider/light-dark logic; this is the right place to feed `masterApplied[]` QA checks.
- `templates/diligence-plus/runtime/masters.ts` is already a strong master contract anchor and should remain first-class.

## Findings From References Folder (Deep Dive)

- `references/scientific-slides/SKILL.md` demonstrates a useful prompt-pack discipline: explicit formatting goal, citation expectations, and iterative generation flow.
- `references/pptx-creator/SKILL.md` is strong on deterministic CLI entry points and JSON/outline input patterns.
- `references/ai-ppt-generate/SKILL.md` shows strict staged API workflows (theme -> outline -> generation) with clear dependency order.
- `references/slides-cog/SKILL.md` is strong on outcome framing and quality expectations, but it is PDF-first and not layout-contract-driven.
- Most reference skills are not wired into `generator/` runtime today; they are guidance assets, not integrated execution modules.

## Required Contract Upgrades

### 1) `deckSpec.schema.json` (strict slide contract)

Include and enforce:
- `slides[].type` from **catalog-driven enum** (no free-form type strings).
- strict slot payload validation by slide type:
  - arrays must enforce `minItems` where required,
  - strings must enforce non-whitespace and min/max char guidance,
  - object slots must enforce required subkeys (e.g., table headers/rows, chart data series).
- `notes` optional on all slide types.
- optional but recommended: `assumptions`/`placeholders` metadata for orchestrator transparency.

### 2) `slideCatalog.json` (single source of layout truth)

Each entry should include:
- `type`
- `description`
- `slots` map with:
  - `kind`
  - `required`
  - `minItems` (where array)
  - `minChars`/`maxChars`
  - `allowEmpty`
  - `renderingHints` (priority, bullet/paragraph mode, keepTogether)
- `densityTarget` (`minScore`, `acceptableFloor`)
- `examples` (tiny valid payloads)
- optional `masters`/`variant` hints where relevant (divider dark/light behavior)

### 3) `qaReport.schema.json` (actionable QA, not diagnostics-only)

Keep existing fields and add/strengthen:
- `missingSlots[]` with `slideIndex`, `slideType`, `slot`.
- `thinSlides[]` with score context.
- `overflowRisks[]` (structured, not untyped object blobs).
- `pagination[]` events with required keys (`slideIndex`, `slideType`, `mode`, `originalCount`, `splitInto`, `reason`).
- `masterApplied[]` checks (`slideIndex`, `slideType`, `expectedMaster`, `appliedMaster`, `matched`, optional reason).
- `slotMetrics[]` per slide for repair precision (`actual`, `target`, `priority`, `kind`).

### 4) Prompt Pack (short, role-specific)

- `intake.md`: extract scope, audience, must-include sections, exclusions, deadlines.
- `content_pack.md`: distill facts/figures/claims + evidence pointers (source ids, page/section links).
- `deck_plan.md`: select slide types and narrative arc from catalog only.
- `deck_spec.md`: fill slots to satisfy density/required constraints.
- `repair.md`: edit `deckSpec` only, using QA findings; no free-form redesign.

## Orchestrator Skill Behavior (Target State)

The orchestrator should:
1. ingest user docs + guidance,
2. build `contentPack` (facts, figures, claims, evidence pointers),
3. propose outline/deck plan,
4. generate `deckSpec`,
5. run renderer + QA,
6. repair and rerender deterministically,
7. ask targeted user questions only when genuinely blocked; otherwise mark assumptions/placeholders explicitly.

## Risks & Considerations

- **Schema drift risk**: skill schemas in `.agents/skills/kpmg-slidegen/schemas/*` are still scaffold placeholders; if left as-is, prompt outputs can diverge from runtime contracts.
- **Catalog drift risk**: if `slideCatalog` and layout package are both edited manually, enum/type drift can cause rejected specs or silent omissions.
- **Master fidelity risk**: if QA does not verify master assignment, footer/page/chrome regressions can slip through while slides still “render successfully”.
- **Repair loop risk**: generic overflow/pagination objects are hard for deterministic repair prompts; structure them.

## Recommendations

1. Adopt **contract-first alignment**: make `slideCatalog` authoritative and generate slide type enum + slot requirements in `deckSpec.schema.json` from it.
2. Replace scaffold skill schemas with strict versions that mirror runtime contracts (or point to canonical root schemas and keep one source of truth).
3. Upgrade `qaReport.schema.json` to structured `overflowRisks`, `pagination`, `masterApplied`, and `slotMetrics`.
4. Keep prompts short and role-specific; enforce “repair edits deckSpec only”.
5. Preserve `templates/diligence-plus/runtime/masters.ts` as mandatory master contract and add QA checks for applied master correctness.
6. Keep overlap checks default-on and maintain deterministic pagination hooks as part of standard QA output.

## Implementation Outline

1. Finalize `slideCatalog.json` entries with slot metadata + density targets + minimal examples.
2. Tighten `schemas/deckSpec.schema.json` to catalog-enum slide types and strict slot payloads.
3. Tighten `schemas/qaReport.schema.json` with structured overflow/pagination/master checks and slot metrics.
4. Expand `.agents/skills/kpmg-slidegen/prompts/*.md` into concise, copy-ready role prompts.
5. Update `.agents/skills/kpmg-slidegen/SKILL.md` to describe the orchestrator loop and blocking/assumption policy.
6. Run sample deck + QA generation and confirm every issue is actionable in repair prompt terms.

## Sources

### Codebase sources
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/kpmg-diligence/package/layouts.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/renderer/validate.ts`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/renderer/density.ts`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/renderer/qa.ts`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/index.js`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/runtime/render-deck.js`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/schemas/deckSpec.schema.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/schemas/contentPack.schema.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/schemas/qaReport.schema.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/diligence-plus/catalog/slideCatalog.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/diligence-plus/runtime/masters.ts`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/references/scientific-slides/SKILL.md`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/references/pptx-creator/SKILL.md`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/references/ai-ppt-generate/SKILL.md`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/references/slides-cog/SKILL.md`
- `/Users/rishi/Code/ai-tools/.agents/skills/document-skills/pptx/SKILL.md`
- `/Users/rishi/Code/ai-tools/.agents/skills/code-docs/SKILL.md`
- `/Users/rishi/Code/ai-tools/.agents/skills/research/SKILL.md`

### External authoritative sources
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
- [JSON Schema Specification](https://json-schema.org/specification)
- [Ajv Strict Mode](https://ajv.js.org/strict-mode.html)
- [Ajv JSON Schema guide](https://ajv.js.org/json-schema.html)
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI Prompt Engineering Best Practices](https://help.openai.com/en/articles/6654000-prompt-engineering)
