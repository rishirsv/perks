---
status: active
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: accepted implementation plan for alternate MC bullet slide onboarding
verification-state: verified
---

# MC Alternate Bullet Slides Plan

## Phase Outcomes

### Phase 1: Create the alternate draft workspaces

This phase captures slides 15, 18, and 20 as stable onboarding references and
creates the draft files needed to shape each alternate bullet layout.

### Phase 2: Align each alternate layout to the canonical runtime

This phase turns the source slides into clean draft builders that use canonical
theme tokens, template asset helpers, and master/footer behavior.

### Phase 3: Render, review, compare, and iterate

This phase proves each alternate candidate renders cleanly, passes QA, and
looks right before it is promoted.

### Phase 4: Promote the accepted alternate layouts

This phase publishes the approved alternate bullet slides into the canonical
generator and updates the contracts, fixtures, and docs that expose them.

## Implementation Checklist

- [x] 1.0 Create the alternate draft workspaces
  - [x] 1.1 Initialize slide 15 as a canonical alternate bullet layout
  - [x] 1.2 Initialize slide 18 as a canonical alternate bullet layout
  - [x] 1.3 Initialize slide 20 as a canonical alternate bullet layout
  - [x] 1.4 Confirm each draft has source metadata, reference capture, scaffold files, and geometry seed
- [x] 2.0 Align each alternate layout to the canonical runtime
  - [x] 2.1 Inspect the source references and choose stable layout ids
  - [x] 2.2 Implement candidate builders with canonical tokens, helper usage, and footer/master behavior
  - [x] 2.3 Prepare candidate layouts and sample deck specs that exercise the alternate structures honestly
- [x] 3.0 Render, review, compare, and iterate
  - [x] 3.1 Render and review the slide 15 alternate candidate
  - [x] 3.2 Render and review the slide 18 alternate candidate
  - [x] 3.3 Render and review the slide 20 alternate candidate
  - [x] 3.4 Run compare on all three and correct issues until acceptable
- [x] 4.0 Promote the accepted alternate layouts
  - [x] 4.1 Promote the slide 15 alternate layout
  - [x] 4.2 Promote the slide 18 alternate layout
  - [x] 4.3 Promote the slide 20 alternate layout
  - [x] 4.4 Move this plan to `docs/exec-plans/completed/` once the workflow is finished
