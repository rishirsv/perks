---
status: active
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: user decision to land PR #7's original revert intent on current reorganized main before reviewing or merging PR #8
verification-state: planned
---

# PR 7 Revert Merge Plan

## Why This Plan Exists

PR `#7` captures a product decision that still stands: remove the verbosity-density-matrix and payload-calibration work that was added earlier.

That decision has not changed, but the repo layout has. Current `main` now keeps `kpmg-slidegen` under `projects/kpmg-utils/`, while PR `#7` still targets the older pre-reorg geography under `kpmg-utils/`. Because of that path mismatch, the original PR is no longer mergeable as-is even though its intent is still correct.

This plan defines how to recreate that revert cleanly on top of current `main`, validate that it still behaves correctly after the reorganization, and merge it before any work from PR `#8`.

## What Success Looks Like

When this plan is complete:

1. Current `main` no longer includes the verbosity-density-matrix generator, payload-calibration artifacts, or their related runtime and manifest changes.
2. The replacement revert is recreated against the reorganized `projects/kpmg-utils/kpmg-slidegen/` tree instead of the retired pre-reorg paths.
3. Validation shows the revert removes only the originally intended feature set and does not accidentally disturb unrelated reorganization work.
4. PR `#8` remains unmerged until the revert lands, so the onboarding review happens on the correct post-revert base.
5. The old stale PR `#7` is superseded by a clean current-main replacement PR with a clear merge and cleanup path.

## Locked Decisions

- Preserve the original intent of PR `#7` exactly.
- Treat the repository reorganization as a geography change, not a product change.
- Keep PR `#8` unmerged until this revert work is merged.
- Plan for the full path: implementation, validation, merge, and cleanup.

## Scope Of The Revert

The replacement revert should remove or unwind the same logical work that PR `#7` targeted, now from the reorganized tree:

- verbosity-density-matrix generation script and outputs
- payload-calibration script and authored calibration deck specs
- related preset manifest entries and bundled skill assets
- runtime verbosity-contract changes introduced to support that work
- associated documentation and completed-plan records that only exist to describe those removed features

The replacement should not expand into new product changes, and it should not pull in or review any part of PR `#8`.

## Phase Outcomes

### Phase 1: Reconfirm The Exact Revert Boundary

Outcome:
- We have a trusted checklist of what PR `#7` meant to remove, translated from old paths to the current reorganized layout.
- Everyone can review the revert as a straightforward path-mapping exercise rather than a new product decision.

### Phase 2: Build A Clean Current-Main Replacement

Outcome:
- A fresh branch from current `main` contains a clean recreation of the revert against `projects/kpmg-utils/kpmg-slidegen/`.
- The branch is easy to review because it only removes or restores the intended feature set.

### Phase 3: Validate Behavior And Isolation

Outcome:
- The recreated revert is proven not to break the still-supported slidegen workflows.
- We have evidence that the reorg-only files and the pending MC onboarding work remain outside the revert scope.

### Phase 4: Review And Merge In The Right Order

Outcome:
- The replacement PR is reviewed and merged before PR `#8`.
- The merge sequence is explicit so the team does not accidentally review onboarding work on the wrong base.

### Phase 5: Close The Old PR And Reset The Queue

Outcome:
- The stale original PR `#7` is clearly marked as superseded.
- PR `#8` can then be reviewed against the corrected post-revert `main`.

## Implementation Checklist

- [x] 1.0 Reconfirm the original revert intent from PR `#7`
  - [x] 1.1 Capture the exact logical feature set removed by PR `#7`, independent of old file paths.
  - [x] 1.2 Map each old `kpmg-utils/kpmg-slidegen/...` path in PR `#7` to its current `projects/kpmg-utils/kpmg-slidegen/...` equivalent on `main`.
  - [x] 1.3 Identify any items from old PR `#7` that are already absent or already changed on current `main`.
  - [x] 1.4 Produce a concise “same intent, new geography” review note to anchor the replacement PR.

- [x] 2.0 Create the replacement revert branch from current `main`
  - [x] 2.1 Branch from current `main` after confirming the target commit to base on.
  - [x] 2.2 Recreate the revert in reorganized paths only, without mixing in unrelated cleanup.
  - [x] 2.3 Keep documentation, manifests, scripts, presets, runtime code, and bundled skill assets aligned with the revert.
  - [x] 2.4 Confirm the replacement diff does not touch PR `#8` onboarding files except where shared infrastructure truly overlaps.

- [x] 3.0 Validate the recreated revert thoroughly
  - [x] 3.1 Run targeted structure and fixture checks for `projects/kpmg-utils/kpmg-slidegen/`.
  - [x] 3.2 Run any additional slidegen validation needed to confirm removed scripts, presets, and manifests no longer leave broken references behind.
  - [x] 3.3 Compare the replacement diff against original PR `#7` to confirm equivalent product effect.
  - [x] 3.4 Sanity-check that current `main` reorganization work remains intact and that PR `#8` is still cleanly separable afterward.

- [ ] 4.0 Merge the replacement before PR `#8`
  - [ ] 4.1 Open the replacement PR with explicit language that it supersedes stale PR `#7`.
  - [ ] 4.2 Review the replacement PR for scope drift, missing path translations, and test evidence.
  - [ ] 4.3 Merge the replacement PR into `main`.
  - [ ] 4.4 Rebase or refresh PR `#8` only after the revert is merged, if needed.

- [ ] 5.0 Clean up stale review state
  - [ ] 5.1 Close or mark original PR `#7` as superseded by the replacement PR.
  - [ ] 5.2 Confirm `main` reflects the intended post-revert state.
  - [ ] 5.3 Re-run a quick PR queue check so the next review of PR `#8` starts from the corrected base.

## Risks To Watch

- The original revert diff references pre-reorg paths, so a mechanical cherry-pick or merge will be misleading.
- Some files removed by the original revert may now be referenced from reorganized manifests or skill-bundle mirrors, so validation must check both repo and bundled asset surfaces.
- Shared onboarding helpers touched by PR `#8` may also have been touched by the original revert, so overlap must be reviewed carefully to avoid accidental carryover.

## Acceptance Criteria For This Plan

This plan is fulfilled when all of the following are true:

1. A replacement PR lands on current `main` that reproduces PR `#7`'s original product intent in the reorganized tree.
2. No stale references remain to removed scripts, presets, manifests, or skill-bundle assets.
3. The stale original PR `#7` is no longer the active path to the revert.
4. PR `#8` remains deferred until the revert is merged and can then be reviewed against the corrected base.

## Current Findings

- The old PR `#7` path list mapped directly onto the reorganized `projects/kpmg-utils/kpmg-slidegen/` tree for the payload-calibration, review-matrix, runtime-verbosity, and completed-plan files.
- Current `main` had already dropped the separate `minimal` preset and `densityProfile` metadata layer before this recreation work started.
- The replacement branch therefore keeps that newer cleanup intact while still removing the payload-calibration and verbosity-density-matrix feature set that PR `#7` was trying to back out.
- The recreated revert does not modify PR `#8`'s onboarded layout files. The remaining overlap is limited to the general slidegen base that PR `#8` will eventually rebase onto after this lands.

## Verification Notes

Completed on 2026-03-09:

- Recreated the revert against the reorganized tree on branch `codex/recreate-pr-7-origin-main`
- Synced the portable skill bundle after removing the review-matrix and payload-calibration assets
- Confirmed no remaining bundle-manifest references to the removed assets
- Passed `node scripts/test-fixtures.mjs`
- Passed `node scripts/test-structure.mjs`
- Passed `node scripts/test-contracts.mjs`
