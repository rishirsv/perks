# Todos

Last reviewed: 2026-03-06

## Status summary

- `business-overview.md` follow-up is still pending. The rewrite was validated against the corpus, but the repo does not yet show post-rewrite drafting/testing feedback or a completed review of recurring mistakes.
- `net-debt.md` follow-up is partially complete. Corpus-derived failure modes already exist in `docs/net-debt-guidance.md`, but the repo does not yet show live drafting or realistic dry-run feedback on the rewritten reference.

## Open items

- [ ] Business Overview post-rewrite mistakes review
  - Status: pending
  - Why still open:
    - `docs/exec-plans/completed/business-overview-reference-rewrite-plan.md` explicitly deferred any local `Common mistakes` decision to `TODOS.md` pending testing feedback.
    - `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md` says local mistakes sections should be added only after testing reveals recurring failure modes.
    - `skill/kpmg-fdd/references/business-overview.md` does not currently include a local `Common mistakes` section.
    - Repo search did not find a later testing artifact, review note, or guidance update showing this follow-up was completed.
  - Next action:
    - Review 3-5 recent Business Overview drafts produced using the rewritten reference.
    - Log recurring failures that survive the existing verification checklist in `skill/kpmg-fdd/references/business-overview.md`.
    - If section-specific mistakes recur, add a local `Common mistakes` section to `skill/kpmg-fdd/references/business-overview.md`.
    - If the failures are better handled globally, document that decision in the relevant global or workflow guidance and close this item.

- [ ] Net debt post-rewrite mistakes review
  - Status: partially complete
  - Why still open:
    - `docs/net-debt-guidance.md` already captures corpus-derived failure modes and known pitfalls, so some of the analytical review work has been done.
    - `docs/exec-plans/completed/net-debt-reference-rewrite-plan.md` records structural validation only; it does not show post-rewrite drafting/testing of `skill/kpmg-fdd/references/net-debt.md`.
    - `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md` says local mistakes sections should be added only after testing reveals recurring failure modes.
    - `skill/kpmg-fdd/references/net-debt.md` does not currently include a local `Common mistakes (and fixes)` section.
  - Next action:
    - Use the rewritten net debt reference in live drafting or a realistic dry run.
    - Compare observed drafting failures against the failure modes already captured in `docs/net-debt-guidance.md`.
    - If section-specific mistakes recur in practice, add a local `Common mistakes (and fixes)` section to `skill/kpmg-fdd/references/net-debt.md`.
    - If the existing guidance remains sufficient, record that decision and close this item without adding a local section.
