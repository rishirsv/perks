# Check-Databook Review Format

Use this reference to keep databook reviews consistent.

## Canonical Module Names

Use these exact module names in classifications, findings, and summaries:

- `QoE`
- `Adjusted P&L`
- `Run-rate`
- `Net working capital`
- `Net debt / debt schedule`
- `Balance sheet / stratified schedules`
- `Bridge support`

Map common workbook labels to the canonical names above:

- `Q of E`, `Quality of earnings`, `Adjusted EBITDA bridge` -> `QoE`
- `Adjusted IS`, `P&L walk`, `PL recast` -> `Adjusted P&L`
- `Run rate` -> `Run-rate`
- `NWC`, `Working capital`, `Peg` -> `Net working capital`
- `Debt`, `Net debt`, `Debt schedule` -> `Net debt / debt schedule`
- `BS`, `Balance sheet`, `Stratified BS` -> `Balance sheet / stratified schedules`
- `Bridge` -> `Bridge support`

## Severity

- `Critical`: wrong or unsupported output, broken tie-outs, cross-foot failures, material formula errors, or release-blocking document-control issues
- `Important`: inconsistent periods, units, classifications, or subtotal logic that create review risk but may be fixable without reworking the whole workbook
- `Minor`: non-blocking formatting, naming, labeling, or hygiene issues

## Verdicts

Use these two outputs separately:

- `TECHNICAL QA VERDICT`
- `PROCESS GATE STATUS`

### Technical QA Verdict

- `Ready with minor edits`: no unresolved `Critical` issues and no more than two unresolved `Important` issues in the reviewed modules
- `Needs revision before release`: no unresolved `Critical` issues, but more than two unresolved `Important` issues or any reviewed module remains only partially testable
- `Do not release`: any unresolved `Critical` issue

### Process Gate Status

- `Fully approved`: all attestations are `Confirmed`
- `Pending approvals`: one or more attestations are `Pending`
- `Not fully testable`: one or more attestations are `Not testable`

If the user needs a single release call, treat the workbook as releasable only when:

- `TECHNICAL QA VERDICT` is `Ready with minor edits`
- `PROCESS GATE STATUS` is `Fully approved`

## Attestation Statuses

Use only these status values:

- `Confirmed`
- `Pending`
- `Not testable`

## Output Template

```text
WORKBOOK TYPE: Full databook / Module extract
MODULES REVIEWED: QoE, Adjusted P&L, Net working capital, Net debt / debt schedule, Balance sheet / stratified schedules, Bridge support
TECHNICAL QA VERDICT: Ready with minor edits / Needs revision before release / Do not release
PROCESS GATE STATUS: Fully approved / Pending approvals / Not fully testable

ISSUE LOG
| # | Sheet | Cell/Range | Severity | Category | Issue | Why it matters | Required action |

SECTION-SPECIFIC TIE-OUTS
- QoE:
- Adjusted P&L:
- Net working capital:
- Net debt / debt schedule:
- Balance sheet / stratified schedules:
- Bridge support:

ATTESTATIONS
- Preparer complete: Confirmed / Pending / Not testable
- Manager reviewed: Confirmed / Pending / Not testable
- Partner/director release approved: Confirmed / Pending / Not testable

RELEASE BLOCKERS
- ...
```

For a narrow module workbook, keep only the modules and tie-out sections that were actually reviewed and explicitly state what was not testable from the provided file.
