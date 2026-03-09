---
status: active
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: accepted implementation plan for onboarding MC slides 28 through 32
verification-state: completed
---

# MC Slides 28-32 Plan

## Phase Outcomes

### Phase 1: Capture and classify the next five source slides

This phase creates stable draft workspaces for slides 28 through 32 and
confirms the visual pattern for each layout before implementation starts.

### Phase 2: Build draft layouts that follow slidegen conventions

This phase turns each source slide into a clean draft layout using canonical
helpers, theme primitives, footer behavior, and template asset resolution.

### Phase 3: Render, review, compare, and iterate

This phase renders each candidate, reviews the PNG output, runs visual compare,
and corrects any obvious issues before promotion.

### Phase 4: Promote the approved layouts

This phase publishes the accepted layouts into the canonical generator and
updates contracts, fixtures, and docs for the new slide types.

## Implementation Checklist

- [x] 1.0 Capture and classify the next five source slides
  - [x] 1.1 Initialize slide 28 draft workspace
  - [x] 1.2 Initialize slide 29 draft workspace
  - [x] 1.3 Initialize slide 30 draft workspace
  - [x] 1.4 Initialize slide 31 draft workspace
  - [x] 1.5 Initialize slide 32 draft workspace
  - [x] 1.6 Review the reference PNGs and confirm stable layout ids
- [x] 2.0 Build draft layouts that follow slidegen conventions
  - [x] 2.1 Implement candidate layouts, builders, and deck specs for slides 28-32
  - [x] 2.2 Keep all new candidate builders aligned to canonical helper/token/palette conventions
- [x] 3.0 Render, review, compare, and iterate
  - [x] 3.1 Render and review candidate PNGs for slides 28-32
  - [x] 3.2 Run compare for slides 28-32 and correct issues until acceptable
- [x] 4.0 Promote the approved layouts
  - [x] 4.1 Promote the accepted slide 28-32 layouts
  - [x] 4.2 Move this plan to `docs/exec-plans/completed/` when finished
