# Full Repo Layout Aggregate Regeneration Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Promotion updates every public repo surface
Promoting a new layout type updates the runtime package, registry, docs schema, and harness fixtures together so the repo never lands in a partially regenerated state.

### Phase 2: Generated outputs are clearly owned
Every generated aggregate carries an explicit generated header so contributors can tell which files should be edited at the source instead of patched by hand.

### Phase 3: Regressions fail before they drift
Verification and tests prove that adding a layout fragment and rerunning regen keeps contract checks green without requiring manual follow-up edits in multiple places.

## Implementation Checklist

- [x] 1.0 Expand aggregate codegen to cover repo-wide layout surfaces
  - [x] 1.1 Regenerate runtime package and onboarded registry outputs from `templates-src/`
  - [x] 1.2 Regenerate `references/deckspec.schema.json`
  - [x] 1.3 Regenerate `fixtures/harness/golden/all-layouts/deckSpec.json`
  - [x] 1.4 Regenerate `fixtures/harness/fixtures.manifest.json`

- [x] 2.0 Make verification and promotion use the same full regen flow
  - [x] 2.1 Update `onboard:verify-generated` coverage to check every generated aggregate
  - [x] 2.2 Update promotion to run full regen plus verify instead of runtime-only regen

- [x] 3.0 Add regression coverage
  - [x] 3.1 Prove full regen restores all generated outputs after corruption
  - [x] 3.2 Prove contract checks stay green after adding a new layout fragment and rerunning regen

## Progress Notes

- 2026-03-10: Started full repo aggregate regeneration implementation to close the remaining promotion gap for new slide types.
- 2026-03-10: Expanded `scripts/codegen/generate-runtime-aggregates.mjs` so `onboard:regen` now regenerates runtime aggregates, `references/deckspec.schema.json`, the golden all-layouts fixture, and the harness fixture manifest from authored sources.
- 2026-03-10: Added `scripts/codegen/deckspec-schema-base.mjs` for shared schema definitions and `fixtures/harness/fixtures.manifest.src.json` for curated fixture metadata that cannot be derived from deckSpecs alone.
- 2026-03-10: Updated promotion errors to reflect full repo aggregate regeneration and verification instead of runtime-only regeneration.
- 2026-03-10: Added regression coverage in `scripts/test-codegen-source-reproducibility.mjs` and `scripts/test-codegen-full-repo-contracts.mjs`, then verified with `npm run -s test:pr`.
