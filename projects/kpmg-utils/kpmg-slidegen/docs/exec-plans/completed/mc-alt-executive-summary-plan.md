---
status: active
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: accepted implementation plan for onboarding workflow cleanup and MC alternate executive summaries
verification-state: verified
---

# MC Alternate Executive Summary Plan

## Phase Outcomes

### Phase 1: Strengthen onboarding conventions

This phase makes the onboarding workflow catch helper, token, palette, and
font drift before new candidate builders get promoted.

### Phase 2: Capture the alternate executive summary references

This phase initializes stable draft workspaces for slides 23 and 26 and
captures the source material needed to shape each layout.

### Phase 3: Build and validate the executive summary drafts

This phase implements the two alternate summary layouts, renders them, reviews
their candidate PNGs, and compares them against the source slides.

### Phase 4: Promote approved layouts

This phase publishes the accepted executive summary alternates into the
canonical generator and closes out the workflow record.

## Implementation Checklist

- [x] 1.0 Strengthen onboarding conventions
  - [x] 1.1 Update onboarding builder audit rules for helper/token/palette/font conventions
  - [x] 1.2 Update workflow docs so the conventions cleanup is part of every future import
- [x] 2.0 Capture the alternate executive summary references
  - [x] 2.1 Initialize slide 23 draft workspace
  - [x] 2.2 Initialize slide 26 draft workspace
  - [x] 2.3 Confirm source metadata, reference captures, scaffold files, and seeds exist
- [x] 3.0 Build and validate the executive summary drafts
  - [x] 3.1 Inspect source references and choose stable layout ids
  - [x] 3.2 Implement draft layouts, builders, and sample deck specs
  - [x] 3.3 Render and review both candidate PNGs
  - [x] 3.4 Run compare and correct issues until acceptable
- [x] 4.0 Promote approved layouts
  - [x] 4.1 Promote the slide 23 alternate executive summary
  - [x] 4.2 Promote the slide 26 alternate executive summary
  - [x] 4.3 Move this plan to `docs/exec-plans/completed/` when finished
