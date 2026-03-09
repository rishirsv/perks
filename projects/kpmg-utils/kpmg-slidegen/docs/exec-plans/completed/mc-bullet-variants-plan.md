---
status: active
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: accepted implementation plan for MC bullet slide onboarding
verification-state: verified
---

# MC Bullet Variants Plan

## Phase Outcomes

### Phase 1: Promote the approved 2-bullet slide

This phase turns the reviewed 2-bullet draft into a supported canonical slide
type so the rest of the MC bullet family builds on an approved baseline.

### Phase 2: Create the 3-, 4-, and 5-bullet draft workspaces

This phase captures the source slides, reference images, and draft files needed
to onboard the remaining MC bullet variants consistently.

### Phase 3: Align the bullet variants to the canonical runtime

This phase makes sure each draft uses canonical theme tokens, asset helpers, and
 footer/master behavior instead of one-off hardcoded rendering choices.

### Phase 4: Render, review, compare, and iterate

This phase proves each candidate renders cleanly, survives QA, and visually
matches its source closely enough to move forward.

### Phase 5: Promote the accepted variants

This phase publishes the approved 3-, 4-, and 5-bullet layouts into the
canonical generator and updates contracts, fixtures, and docs.

## Implementation Checklist

- [x] 1.0 Promote the approved 2-bullet slide
  - [x] 1.1 Record approval-based promotion for `mcTwoBulletSlide`
  - [x] 1.2 Run `promote-layout.mjs` for `mcTwoBulletSlide`
  - [x] 1.3 Confirm registry, fixture, schema, and docs updates landed
- [x] 2.0 Create the 3-, 4-, and 5-bullet draft workspaces
  - [x] 2.1 Initialize slide 10 as `mcThreeBulletSlide`
  - [x] 2.2 Initialize slide 14 as `mcFourBulletSlide`
  - [x] 2.3 Initialize slide 19 as `mcFiveBulletSlide`
  - [x] 2.4 Confirm each draft has `source.json`, reference capture, scaffold files, and geometry seed
- [x] 3.0 Align the bullet variants to the canonical runtime
  - [x] 3.1 Build or reuse shared helper support for the MC bullet family
  - [x] 3.2 Update each candidate builder to use canonical theme/token helpers and template asset resolution
  - [x] 3.3 Ensure each candidate relies on canonical master/footer behavior instead of stamped footer assets
  - [x] 3.4 Prepare honest draft deck specs and icon assets for each bullet variant
- [x] 4.0 Render, review, compare, and iterate
  - [x] 4.1 Render `mcThreeBulletSlide` and review the candidate PNG
  - [x] 4.2 Compare `mcThreeBulletSlide` and correct issues until acceptable
  - [x] 4.3 Render `mcFourBulletSlide` and review the candidate PNG
  - [x] 4.4 Compare `mcFourBulletSlide` and correct issues until acceptable
  - [x] 4.5 Render `mcFiveBulletSlide` and review the candidate PNG
  - [x] 4.6 Compare `mcFiveBulletSlide` and correct issues until acceptable
- [x] 5.0 Promote the accepted variants
  - [x] 5.1 Promote `mcThreeBulletSlide`
  - [x] 5.2 Promote `mcFourBulletSlide`
  - [x] 5.3 Promote `mcFiveBulletSlide`
  - [x] 5.4 Move this plan to `docs/exec-plans/completed/` once the workflow is finished
