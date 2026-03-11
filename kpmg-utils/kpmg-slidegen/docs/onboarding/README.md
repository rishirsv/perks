# Repo-Only Layout Onboarding

`docs/onboarding/onboard-layout.md` is the authoritative onboarding workflow document.

Use this directory as the supporting reference set for that workflow:

- `onboard-layout.md`: the only supported happy-path procedure for onboarding and promotion.
- `agent-batch-workflow.md`: how to repeat that same case lifecycle across many cases.
- `agent-review-checklists.md`: prompts and review order for case artifacts.

Repo boundaries:

- Draft onboarding workspaces live under `onboarding/cases/<case-id>/`.
- Generated candidate and compare artifacts live under `outputs/onboarding/<case-id>/`.
- Authored layouts and primitives live under `templates-src/kpmg-diligence/`.
- Generated runtime/template outputs live under `templates/kpmg-diligence/package/` and `generator/runtime/`.

The legacy layout-workspace flow is no longer part of the supported repo path.
