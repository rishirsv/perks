# FDD Request List Plan

## Phase Outcomes

### Phase 1: Package Foundation
Create a clean two-layer package so the original `dd-checklist` remains available as a reference while the active KPMG FDD skill lives in its own embedded skill folder.

### Phase 2: Skill Design
Turn the generic diligence checklist into an FDD information request list skill that can gather context, select the right modules, produce a markdown preview, and drive workbook generation.

### Phase 3: Workbook Automation
Generate a finished Excel workbook that matches the provided template by copying the template asset and filling it with the selected request-list content.

### Phase 4: Verification
Validate the skill structure and confirm workbook fidelity across representative FDD scenarios.

## Implementation Checklist

- [x] 1.0 Rebuild the package structure
  - [x] 1.1 Save the original `dd-checklist` verbatim under `fdd-request-list/docs/dd-checklist-reference/SKILL.md`
  - [x] 1.2 Create the embedded skill scaffold under `fdd-request-list/skill/fdd-request-list`
  - [x] 1.3 Remove the temporary top-level `fdd-request-list/SKILL.md`
  - [x] 1.4 Validation for 1.0: confirm the new folder structure matches the accepted plan

- [x] 2.0 Author the active skill
  - [x] 2.1 Rewrite `SKILL.md` with FDD-specific triggers, workflow, and workbook-generation instructions
  - [x] 2.2 Add concise reference documents for request taxonomy, workbook contract, and module selection
  - [x] 2.3 Generate or refresh `agents/openai.yaml` for the final skill behavior
  - [x] 2.4 Validation for 2.0: run skill validation and inspect the generated metadata

- [x] 3.0 Implement workbook generation
  - [x] 3.1 Add the provided workbook as the template asset
  - [x] 3.2 Implement a deterministic script to build `.xlsx` output from a JSON spec
  - [x] 3.3 Add representative fixture specs that cover core and conditional modules
  - [x] 3.4 Validation for 3.0: generate example workbooks and inspect key layout and content fields

- [x] 4.0 Add verification coverage
  - [x] 4.1 Add tests for core FDD, carve-out plus audited, software or subscription, and energy or regulated utility scenarios
  - [x] 4.2 Verify workbook fidelity for sheet name, merged ranges, preserved styles, numbering, and dates
  - [x] 4.3 Validation for 4.0: run the test suite successfully

## Notes

- Exact workbook fidelity means copying the provided template workbook and filling it rather than rebuilding its layout from scratch.
- V1 remains a single-sheet workbook implementation.
- Validation completed with `quick_validate.py`, direct workbook generation, `python3 -m unittest ./fdd-request-list/tests/test_build_fdd_request_list.py`, and a manual workbook spot-check against the template.
