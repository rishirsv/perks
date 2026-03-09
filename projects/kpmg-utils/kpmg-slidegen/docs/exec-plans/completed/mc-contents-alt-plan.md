---
status: completed
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: accepted implementation plan for mcContentsAlt onboarding
verification-state: verified
---

# MC Contents Alt Plan

## Phase Outcomes

### Phase 1: Create the draft workspace

This phase captures the MC slide as a stable reference and creates the draft
files we need to start shaping the new layout.

### Phase 2: Adapt the draft to the MC alternate TOC

This phase aligns the draft layout to the MC design while keeping the same
underlying contents slide contract unless the reference proves that behavior has
to change.

### Phase 3: Render, compare, and iterate

This phase proves the draft works in the generator, passes QA, and visually
matches the source closely enough to be considered canonical.

### Phase 4: Promote the layout into the canonical generator

This phase turns the approved draft into a supported canonical layout with
registry, fixture, schema, and docs coverage.

## Implementation Checklist

- [x] 1.0 Create the draft workspace
  - [x] 1.1 Initialize onboarding for slide 2 with `layout-id` `mcContentsAlt`
  - [x] 1.2 Confirm `source.json` records the MC source path, slide number, template, and family
  - [x] 1.3 Confirm reference capture and scaffold files exist
- [x] 2.0 Adapt the draft to the MC alternate TOC
  - [x] 2.1 Compare slide 2 against the current `contents` geometry
  - [x] 2.2 Edit `candidate.layout.json` to match the MC reference
  - [x] 2.3 Keep the `contents` slot contract unchanged unless the reference forces a behavioral change
  - [x] 2.4 Keep the draft builder inherited from `contents` unless rendering proves a builder change is required
  - [x] 2.5 Update `candidate.deckSpec.json` to exercise the alternate layout honestly
- [x] 3.0 Render, compare, and iterate
  - [x] 3.1 Run `render-candidate.mjs --layout-id mcContentsAlt`
  - [x] 3.2 Confirm `candidate/qa.json` has zero blocking checks
  - [x] 3.3 Confirm `candidate/preview/slide-1.png` is generated
  - [x] 3.4 Run `compare-candidate.mjs --layout-id mcContentsAlt`
  - [x] 3.5 Review `reference.png`, `candidate.png`, `diff.png`, `diff.json`, and `scorecard.json`
  - [x] 3.6 Iterate geometry first, then fixture content, then builder logic if needed
  - [x] 3.7 Stop when the scorecard passes and remaining delta is cosmetic
  - [x] 3.8 Resolve the remaining RMS diff gap; promotion proceeded with explicit user approval of the residual delta
- [x] 4.0 Promote the layout into the canonical generator
  - [x] 4.1 Run `promote-layout.mjs` for `mcContentsAlt` after approval
  - [x] 4.2 Add `mcContentsAlt` to the canonical onboarded registry
  - [x] 4.3 Add the layout contract to `templates/kpmg-diligence/package/layouts.json`
  - [x] 4.4 Add or update reference-parity and all-layouts fixture coverage
  - [x] 4.5 Update schema and slide-contract docs so `mcContentsAlt` is a legal documented type
  - [x] 4.6 Keep the base `contents` type unchanged
