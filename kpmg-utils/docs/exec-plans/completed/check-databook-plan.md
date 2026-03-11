# Check-Databook Skill Plan

## Summary

Create a new `check-databook` skill as a KPMG TS adaptation of `financial-analysis/check-model`, focused on reviewing financial due diligence databooks rather than valuation models.

## Phase Outcomes

### Phase 1: Preserve the source reference

Keep an exact copy of the source `check-model` skill so future updates can trace what was adapted and what was changed for KPMG databook use.

### Phase 2: Define the KPMG-ready skill

Write a concise, triggerable skill that reviews both full FDD databooks and narrower workbook extracts using a single reviewer-only workflow.

### Phase 3: Add release gating

Make the output usable for internal release decisions by adding reviewer attestations, explicit release blockers, and a clear release verdict.

## Key Changes

- New skill name: `check-databook`
- New skill path: `~/kpmg-utils/check-databook/skill/SKILL.md`
- Reference copy path: `~/kpmg-utils/check-databook/docs/reference/`
- Accepted workbook scope:
  - full FDD databooks
  - QoE extracts
  - stratified balance sheet / balance-sheet support files
  - related module workbooks such as run-rate, bridges, and debt/NWC schedules
- New output contract:
  - workbook type / module classification
  - overall release verdict
  - severity-ranked issue log
  - section-specific tie-out findings
  - required reviewer attestations
  - explicit release blockers and remaining conditions

## Implementation Checklist

- [x] 1.0 Create the new skill folder structure under `~/kpmg-utils/check-databook`
- [x] 1.1 Copy the original `check-model` `SKILL.md` verbatim into `~/kpmg-utils/check-databook/docs/reference/`
- [x] 1.2 Save the accepted execution plan to `docs/exec-plans/active/check-databook-plan.md`
- [x] 2.0 Write `~/kpmg-utils/check-databook/skill/SKILL.md`
- [x] 2.1 Replace model-audit framing with databook-QC framing
- [x] 2.2 Support both full FDD databooks and module extracts in one workflow
- [x] 2.3 Add TS-specific tie-out checks for QoE, NWC, debt, and balance-sheet schedules
- [x] 2.4 Add reviewer attestation and release criteria with manager + partner/director gating
- [x] 3.0 Review the new skill for trigger quality, clarity, and minimal context weight
- [x] 3.1 Validate against the provided North, Skyrocket, and Zeno workbook examples
- [x] 3.2 Move the plan to `docs/exec-plans/completed/check-databook-plan.md` when implementation is finished

## Validation Scenarios

- Use the Skyrocket workbook as a full-databook case to confirm the skill can route across a large multi-tab QoE-heavy workbook.
- Use the Zeno FDD databook as a second full-databook case with run-rate, bridge, and adjusted P&L sections.
- Use the Zeno stratified balance-sheet file as a module-only case to confirm the skill does not force irrelevant full-databook checks.
- Use the North `.xlsb` file as an accepted-input example in the instructions, with guidance that binary workbooks may require conversion or workbook-tool support before deep formula review.

## Assumptions

- “Save the check model verbatim” means copying the original `financial-analysis/check-model/SKILL.md` exactly as-is into the new reference folder, not rewriting it.
- The implementation target is `/Users/rishi/Code/ai-tools/kpmg-utils/check-databook`.
- V1 is a skill-definition deliverable, not a coded workbook parser.
- Default release model is preparer completion plus manager review plus partner/director sign-off.
- Default scope includes both full FDD databooks and narrower module workbooks.

## Implementation Notes

- The preserved reference copy was verified against the source `check-model` file with a byte-for-byte comparison.
- The final `check-databook` skill stays instruction-only and keeps the workflow reviewer-only, as planned.
- Validation against the provided examples confirmed the intended routing:
  - Skyrocket aligns to a full databook review with QoE, adjusted P&L, bridge, balance-sheet, and release-tab checks.
  - Zeno FDD Databook aligns to a full databook review with QoE, adjusted P&L, run-rate, and release-tab checks.
  - Zeno stratified balance sheet aligns to a module-only balance-sheet workflow.
  - North `.xlsb` is explicitly covered as an accepted input type with a limitation note for deep formula review.
