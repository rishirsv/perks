# Agent Review Checklists

Use these repo-only checklists when an agent is helping with layout onboarding.

## Geometry Review Prompt

Ask the agent to inspect:

1. `onboarding/cases/<case-id>/intake.json`
2. `onboarding/cases/<case-id>/extract.normalized.json`
3. `onboarding/cases/<case-id>/fingerprint.json`
4. `onboarding/cases/<case-id>/classify.json`
5. `onboarding/cases/<case-id>/candidate.layout.json`
6. `outputs/onboarding/<case-id>/compare/reference.png`

Ask for:

1. Whether the chosen primitive still looks like the right base contract for the case.
2. The minimum geometry edits needed to align the draft with the reference.
3. Any geometry that should be modeled as a primitive change instead of a one-off layout override.

## Diff Prioritization Prompt

Ask the agent to inspect:

1. `outputs/onboarding/<case-id>/compare/reference.png`
2. `outputs/onboarding/<case-id>/compare/candidate.png`
3. `outputs/onboarding/<case-id>/compare/diff.png`
4. `outputs/onboarding/<case-id>/compare/diff.json`
5. `outputs/onboarding/<case-id>/compare/scorecard.json`

Ask for:

1. The top 3 highest-signal visual mismatches.
2. Which mismatches are structural versus cosmetic.
3. The smallest edit sequence most likely to move the scorecard toward pass.

## Promotion Signoff Prompt

Ask the agent to inspect:

1. `outputs/onboarding/<case-id>/candidate/qa.json`
2. `outputs/onboarding/<case-id>/compare/scorecard.json`
3. `outputs/onboarding/<case-id>/compare/reference.png`
4. `outputs/onboarding/<case-id>/compare/candidate.png`
5. `onboarding/cases/<case-id>/candidate.layout.json`
6. `onboarding/cases/<case-id>/candidate.builder.js`

Ask for:

1. Confirmation that deterministic gates are satisfied.
2. A concise judgment on whether the residual visual delta is cosmetic enough.
3. Any risks that should block promotion.

## Default Review Order

Always review in this order:

1. Deterministic blockers first.
2. Geometry mismatch hotspots second.
3. Cosmetic polish last.
