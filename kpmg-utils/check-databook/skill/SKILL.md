---
name: check-databook
description: Review financial due diligence databooks and workbook extracts for KPMG TS release readiness. Use when asked to check a databook, QC a QoE workbook, tie out a net working capital or debt schedule, review a stratified balance sheet, or assess whether an FDD workbook is ready for manager and partner/director release.
---

# Check Databook

Review financial due diligence databooks as a reviewer-only workflow. Focus on tie-outs, structural integrity, TS-specific analytical checks, and internal release gating.

## Accepted Inputs

Accept these workbook types:

- Full FDD databooks
- QoE extracts
- Net working capital schedules and roll-forwards
- Net debt or debt schedule workbooks
- Stratified balance sheet or other balance-sheet support files
- Related bridge, run-rate, or adjusted P&L modules

Accepted file formats:

- `.xlsx`
- `.xlsm`
- `.xlsb`

If the workbook is `.xlsb`, accept it but note that binary workbooks may need conversion or workbook-tool support before deep formula review.

## Reviewer Behavior

- This is a reviewer-only skill. Do not rewrite the workbook unless the user explicitly asks for a separate remediation step.
- Do not invent support, normalize mismatches silently, or assume that labels with similar wording refer to the same metric.
- When a module workbook does not contain all sections needed for a full release review, review only the relevant lanes and state what could not be tested.

## Workflow

### 1. Classify the workbook

Classify the file before reviewing:

- `full databook`
- `module extract`

Then identify the relevant module or modules using the canonical names in [references/review-format.md](references/review-format.md):

- `QoE`
- `Adjusted P&L`
- `Run-rate`
- `Net working capital`
- `Net debt / debt schedule`
- `Balance sheet / stratified schedules`
- `Bridge support`

Use sheet names, workbook structure, and section dividers to make the classification. Do not force a full-databook checklist onto a narrow module file.

### 2. Structural and workbook-control checks

Check for:

- hidden tabs, rows, or columns that may contain overrides
- broken formulas or obvious error cells such as `#REF!`, `#VALUE!`, `#DIV/0!`, or `#N/A`
- hardcoded values inside formula ranges where a consistent formula should exist
- formula drift across time-series rows, bridge rows, subtotal blocks, or repeated schedule sections
- inconsistent date headers, period labeling, units, currency labels, or sign conventions
- stale sheet titles, project names, draft labels, placeholders, or copied-forward comments
- missing core tabs where the workbook structure implies they should exist, such as cover, disclaimer, summary, or report tables

### 3. Core databook tie-out checks

Run the review lanes that fit the workbook.

#### QoE and adjusted earnings

Check that:

- reported EBITDA or profit bases tie to the supporting P&L or bridge tabs
- QoE summary outputs tie to the detailed adjustment schedules
- recurring, non-recurring, management, sell-side, and pro forma adjustments roll through consistently
- bridge totals, subtotal logic, and sign conventions are arithmetically coherent
- period labels match across summary, detail, adjusted P&L, and bridge tabs

#### Net working capital

Check that:

- NWC roll-forwards are consistent across period bridges and balance-sheet movements
- component accounts included in the peg or working-capital view are complete and consistently classified
- average, normalized, or peg calculations tie back to the detailed support
- movements in AR, AP, inventory, deferred revenue, or other included accounts follow the stated sign logic

#### Net debt and debt schedule

Check that:

- debt schedules cross-foot within each subtotal and in total
- opening balance, movement, and closing balance logic works by period where a roll-forward exists
- cash, debt-like, lease, and other net-debt items tie to the supporting schedules or balance-sheet tabs
- totals used in summary or report-facing tabs agree to the detailed support

#### Balance sheet and stratified schedules

Check that:

- category subtotals add correctly to major captions and grand totals
- stratified or allocated balances reconcile to the reported basis shown in the schedule
- intercompany eliminations, stat adjustments, or allocation columns roll through correctly where present
- balance-sheet support schedules use consistent period, entity, and currency labels

### 4. Cross-tab consistency checks

Verify:

- linked cells match their stated source tabs
- the same metric name is not used with conflicting definitions
- report-facing tabs and summary tabs agree to detailed workings
- workbook sections use the same period basis, units, and currency
- bridge outputs do not conflict with the balance-sheet or net-debt schedules where they intersect

### 5. Release and document-control checks

Audit the workbook for release readiness:

- cover, disclaimer, and summary tabs are present when appropriate for the workbook type
- no stale project names, outdated dates, or unresolved draft markers remain
- no unresolved reviewer notes, open items, or placeholder text remain on release-facing tabs
- the workbook clearly distinguishes management inputs, KPMG adjustments, and final review outputs where relevant

## Required Reviewer Attestations

End every review with these attestation checks:

- `Preparer complete`: the workbook structure, support tabs, and final outputs are assembled for review
- `Manager reviewed`: critical tie-outs, key judgments, and release blockers have been reviewed by the manager
- `Partner/director release approved`: final workbook is approved for internal release or client-facing use

Use only the attestation statuses in [references/review-format.md](references/review-format.md): `Confirmed`, `Pending`, or `Not testable`.

## Severity and Release Criteria

Apply the severity definitions and verdict rules from [references/review-format.md](references/review-format.md).

Keep technical QA and approval workflow separate:

- `TECHNICAL QA VERDICT` covers workbook correctness and release readiness of the reviewed content
- `PROCESS GATE STATUS` covers whether the required attestations are confirmed

If the user needs a single release call, treat the workbook as releasable only when both outputs are clear for release in the reference contract.

## Output Format

Return findings using [references/review-format.md](references/review-format.md).

For a narrow module workbook:

- keep only the modules and tie-out sections that were actually reviewed
- use the canonical module names from the reference
- explicitly state which sections were not testable from the provided file

## Important Notes

- Review the workbook that exists, not the workbook you expected to receive.
- Treat broken links, hardcodes in controlled ranges, and sign errors as high-risk until proven otherwise.
- QoE bridge tie-outs, NWC roll-forward consistency, and debt schedule cross-footing are required TS checks whenever those modules are present.
- If a workbook mixes report-facing tabs and support tabs, prioritize whether the report-facing outputs tie to the detailed support.
- If the workbook format prevents deep testing, state the limitation clearly and narrow the verdict accordingly.
