# FDD Report Writer Initial Test Cases

## Purpose

Use this prompt set to do an initial manual evaluation of the `fdd-report-writer` skill and catch regressions early.

This first pass is intentionally small and targeted. It focuses on the highest-value things to test first:

- whether the skill should trigger
- whether it routes to the right artifact shape
- whether it respects section-first behavior
- whether it handles `rewrite` vs. `draft` vs. `polish` correctly
- whether it avoids expanding into adjacent tasks outside the skill boundary

## How To Use

For each test case:

1. Run the prompt in the environment where the skill is available.
2. Record whether the skill triggered.
3. Paste the response or summarize the result in the test case block.
4. Note any misses, overreach, or regressions in the `Notes` field.

## Success Criteria

Use these evaluation lenses for every case:

- The skill should trigger for section-writing and exhibit-writing asks.
- The skill should stay scoped to the requested artifact.
- The skill should prefer section-by-section drafting over full-report expansion.
- The skill should use placeholders instead of inventing facts.
- The skill should preserve structure for `polish`, improve weak structure for `rewrite`, and synthesize fresh prose for `draft`.
- The skill should not trigger for PowerPoint-building or reference-maintenance tasks.

## Initial Evaluation Summary

| ID | Should trigger | Actual result | Status | Notes |
| --- | --- | --- | --- | --- |
| TC-01 | Yes | Yes | Pass | Produced a QoE section with placeholders and close-out note. |
| TC-02 | Yes | Yes | Pass | Produced a clean client-ready rewrite for the NWC adjustment. |
| TC-03 | Yes | Not yet tested | Open | No pasted result yet. |
| TC-04 | Yes | Yes | Pass | Produced a scoped business overview with good perimeter handling. |
| TC-05 | Yes | Yes | Pass | Produced an exhibit-style net debt narrative with placeholders. |
| TC-06 | Yes | Yes | Pass | Produced a practical reporting environment section with implication language. |
| TC-07 | Yes | Yes | Pass | Returned an outline-only full-report response as intended. |
| TC-08 | No | Not yet tested | Open | No pasted result yet. |
| TC-09 | No | Not yet tested | Open | No pasted result yet. |
| TC-10 | Borderline yes | Yes | Pass | Proceeded with placeholders and stayed anchored to section drafting. |

## Detailed Test Cases

### TC-01

**Should trigger:** Yes

**Prompt**

Draft a quality of earnings section from these notes: TTM Jun-24 adjusted EBITDA is $18.4 million, reported EBITDA is $16.9 million, add-backs relate to transaction fees of $0.8 million and one-time ERP migration costs of $0.7 million. Keep placeholders for any unsupported details.

**What success looks like**

- Routes to `section` + `draft`
- Produces a QoE section, not just loose bullets
- Keeps unsupported details as placeholders
- Adds a short `What changed / assumptions` note

**Triggered:** Yes

**Result**

```text
Quality of earnings
TTM Jun-24 reported EBITDA was $16.9 million. Adjusted EBITDA was $18.4 million, reflecting $1.5 million of add-backs for items identified as non-recurring and not representative of the ongoing earnings profile. Based on the adjustment schedule provided, these add-backs comprised $0.8 million of transaction fees and $0.7 million of one-time ERP migration costs.

Transaction fees: Reported EBITDA was increased by $0.8 million to remove fees incurred in connection with the transaction process. These costs relate to the contemplated transaction and are not expected to recur in the normal course of operations, and accordingly have been excluded from adjusted EBITDA. [Nature of fees and support not provided.]

ERP migration costs: Reported EBITDA was increased by $0.7 million to remove one-time costs associated with the ERP migration. Based on the information provided, these costs reflect a discrete implementation event rather than ongoing operating spend, and accordingly have been excluded from adjusted EBITDA. [Timing, scope of project, and support not provided.]

What changed / assumptions
Drafted this as a concise QoE section anchored to the reported-to-adjusted EBITDA bridge for TTM Jun-24. I assumed both items are included add-backs and kept placeholders where the notes did not support additional detail, recurrence analysis beyond the captions, or source attribution.
```

**Notes**

- Strong first-pass behavior.
- Stayed scoped to a section draft.
- Good use of placeholders.

### TC-02

**Should trigger:** Yes

**Prompt**

Rewrite this net working capital adjustment wording so it sounds client-ready: "Deferred revenue should probably be out because it's not normal wc and it messes up the average."

**What success looks like**

- Routes to `exhibit` or a narrow adjustment-writing path
- Rewrites the wording cleanly without inventing support
- Does not turn it into a full NWC section

**Triggered:** Yes

**Result**

```text
Deferred revenue is excluded from net working capital to the extent it reflects advance billings for services to be provided in future periods, rather than the recurring operating working-capital requirements of the business. Excluding this balance avoids distorting the average net working capital analysis.

What changed / assumptions: I rewrote this as a client-ready adjustment note and assumed the intended conclusion is that deferred revenue should be excluded from the average NWC calculation on a definitional basis.
```

**Notes**

- Good scope control.
- The wording is client-ready and avoids overbuilding.

### TC-03

**Should trigger:** Yes

**Prompt**

Polish the following executive summary draft without changing the overall structure: "Net debt was 22.5m at close. Main items were term debt and bonuses. Working capital was below target because receivables were high."

**What success looks like**

- Routes to `section` + `polish`
- Preserves the draft’s basic structure and meaning
- Improves tone, precision, and readability
- Does not re-architect the whole section

**Triggered:** 

**Result**

```text
[Paste result here]
```

**Notes**

- Not yet tested.

### TC-04

**Should trigger:** Yes

**Prompt**

Write the business overview section for a regional primary care platform operating 24 clinics across Ontario. Revenue is generated through capitated contracts, fee-for-service billings, and employer-paid programs. The carve-out excludes real estate entities.

**What success looks like**

- Maps to canonical `Business overview`
- Writes the right section shape
- Explains perimeter and revenue model clearly
- Does not drift into financial performance or risk commentary

**Triggered:** Yes

**Result**

```text
Business overview
The Company operates a regional primary care platform across 24 clinics in Ontario.
The transaction perimeter includes the operating clinic entities and excludes the real estate entities associated with the platform.
The business provides primary care services through its clinic network, with revenue generated from capitated contracts, fee-for-service billings, and employer-paid programs.
Capitated contracts provide a recurring revenue base tied to enrolled patient populations, while fee-for-service billings vary with clinical activity and service volumes. Employer-paid programs represent a separate revenue stream tied to services delivered under corporate or sponsored arrangements. [Program mix and customer concentration not provided.]
The 24-clinic footprint provides a regional delivery network across Ontario and supports patient access through multiple care locations. [Clinic distribution by city / region not provided.]
Historical results should be read in the context of the carve-out perimeter, as the transaction excludes the related real estate entities. [Any lease, occupancy, or shared-service arrangements between the operating entities and excluded real estate entities were not provided.]

What changed / assumptions
Drafted this as a concise business overview focused on transaction perimeter, operating model, and revenue mechanics. I assumed the in-scope business is the clinic operating platform only, and I kept placeholders for unsupported details such as regional mix, employer program specifics, and carve-out interdependencies.
```

**Notes**

- Strong perimeter handling.
- Good section discipline and placeholder use.

### TC-05

**Should trigger:** Yes

**Prompt**

Draft an exhibit narrative for a net debt schedule. Cash excludes $1.2 million of trapped cash in regulated entities and includes $0.4 million of outstanding checks. There is also a $0.9 million accrued transaction bonus expected to settle at closing.

**What success looks like**

- Routes to `exhibit`
- Writes a concise net-debt narrative aligned to the schedule logic
- Distinguishes cash treatment and debt-like items
- Does not create a full report section unless asked

**Triggered:** Yes

**Result**

```text
The schedule presents the Company’s net debt position as at [Date]. Cash has been adjusted to exclude $1.2 million of trapped cash held in regulated entities, as these balances are not freely available for general corporate purposes at closing. Cash also includes $0.4 million of outstanding checks, consistent with the reported bank position and related cash reconciliation. [Further detail on the nature of the outstanding checks and any offsetting liability treatment was not provided.]

In addition to the reported cash definition, the schedule includes a $0.9 million accrued transaction bonus expected to settle at closing. This balance represents a closing-related obligation and should be reflected in the purchase price analysis to the extent it remains payable by the seller at completion. [Employee population, payment timing, and supporting bonus documentation were not provided.]

What changed / assumptions: Drafted this as an exhibit-style narrative for a net debt schedule rather than a full section. I assumed the trapped cash is excluded from available cash and the accrued transaction bonus is treated as a debt-like item expected to be settled through the closing funds flow.
```

**Notes**

- Strong exhibit routing.
- Good treatment framing for trapped cash and transaction bonuses.

### TC-06

**Should trigger:** Yes

**Prompt**

Write the reporting environment section based on the following: FY22-FY24 audited financial statements are available, monthly close takes 12 business days, reporting is run from NetSuite, payroll is outsourced, and revenue recognition for implementation fees is still under review.

**What success looks like**

- Produces a reporting-environment section with practical company-specific policy/process commentary
- Highlights the implication of the revenue recognition review
- Keeps the focus on reporting environment rather than QoE

**Triggered:** Yes

**Result**

```text
Reporting environment
FY22 through FY24 financial statements are audited and provide the primary basis for historical analysis.
Monthly reporting is prepared through a close process that takes approximately 12 business days, which is longer than a more compressed month-end cycle and should be considered when assessing the timeliness of interim reporting.
NetSuite is the core financial reporting system and serves as the primary ERP for general ledger and monthly reporting activities. [Further detail on system integrations, reporting packages, and manual journal activity was not provided.]
Payroll processing is outsourced, with payroll data flowing into the reporting environment through the Company’s third-party provider. [The allocation of review and approval responsibilities between the Company and the outsourced provider was not provided.]
Revenue recognition: Revenue recognition for implementation fees remains under review. As a result, the timing of revenue recognition for this stream should be considered an open accounting policy area pending completion of the Company’s assessment and any related conclusions. [The affected periods, revenue quantum, and current versus proposed accounting treatment were not provided.]
Implication for diligence: The reporting environment appears established, supported by audited FY22-FY24 financial statements and a defined ERP platform, although interim period analysis should be read in the context of the 12-business-day close cycle and the unresolved revenue recognition review for implementation fees.

What changed / assumptions
Drafted this as a concise reporting environment section focused on audit status, close cadence, systems, payroll processing, and the identified accounting policy matter. I assumed the implementation fee review remains unresolved and kept placeholders where the notes did not support additional detail on ownership, process controls, or the magnitude of the affected revenue stream.
```

**Notes**

- Good implication framing.
- Stayed in the right section boundary.

### TC-07

**Should trigger:** Yes

**Prompt**

Create an outline for a full FDD report for a healthcare services target covering executive summary, business overview, QoE, NWC, net debt, and reporting environment. Stop after the outline.

**What success looks like**

- Uses the explicit rare `full_report` path
- Returns a concise outline only
- Does not continue into drafting unless asked

**Triggered:** Yes

**Result**

```text
FDD report outline

Executive summary
- Transaction perimeter, including the healthcare services businesses in scope and any excluded entities, assets, or activities
- Headline historical financial profile, including revenue, EBITDA, and any notable recent trends over the review period
- Key QoE findings, including the principal adjustments from reported EBITDA to adjusted EBITDA
- Key NWC findings, including reported versus adjusted working capital and any implications for a normalized target or peg
- Key net debt findings, including reported indebtedness, debt-like items, cash availability, and closing considerations
- Key reporting environment observations, including audit status, close process, systems, and policy matters affecting diligence interpretation
- Principal diligence considerations and open items requiring confirmation before close

Business overview
- Description of the target’s healthcare services offering and operating model
- Transaction perimeter, including included operating entities and excluded businesses, real estate, or non-core assets
- Revenue model, including reimbursement structure, payer mix, contract types, and other revenue streams
- Operating footprint, including geography, sites, clinics, providers, and other scale indicators as relevant
- Business composition, including service lines, channels, or care settings where relevant
- Structural considerations, including carve-out issues, shared services, regulatory context, and standalone matters where relevant

Quality of earnings
- Earnings basis and period covered by the QoE analysis
- Summary bridge from reported EBITDA to adjusted EBITDA
- Commentary on management adjustments, diligence adjustments, and any excluded considerations
- Discussion of the major earnings normalization items, including rationale, support, and recurrence assessment
- Observations on revenue quality, margin profile, customer or payer concentration, and any unusual period-specific items where relevant
- Summary conclusion on adjusted earnings and any remaining sensitivities or open items

Net working capital
- Basis of presentation, including whether the analysis is period-end, average, adjusted, or target-based
- Summary bridge from reported to adjusted net working capital
- Commentary on key definitional and diligence adjustments
- Discussion of major working-capital drivers, including receivables, payables, accrued liabilities, deferred revenue, or other relevant balances
- Seasonality, billing, collection, or payment-cycle considerations where relevant
- Conclusion on adjusted working capital and, if supported, target or peg implications

Net debt
- Net debt schedule as at the relevant reference date
- Definition of cash, including any restricted, trapped, or otherwise unavailable balances
- Commentary on reported debt balances and other financial obligations
- Debt-like and cash-like adjustments, including transaction-related items, bonuses, taxes, leases, or reclasses from working capital where relevant
- Closing and funds-flow considerations, including items expected to settle at completion
- Summary conclusion on adjusted net debt and outstanding classification items

Reporting environment
- Reporting basis and audit status of historical financial information
- Close process, reporting cadence, and timeliness of monthly and annual reporting
- Core systems supporting financial reporting, payroll, and related processes
- Key accounting policies affecting diligence interpretation, with emphasis on revenue recognition and other material estimate areas
- Ownership and process context for finance, reporting, and outsourced functions where relevant
- Implication for diligence, including any policy areas, process limitations, or open reviews that affect reliance on the historical financial analysis

What changed / assumptions
Outlined only the sections you requested and stopped before drafting, consistent with a full-report outline request. I assumed a standard healthcare services FDD structure and kept the outline high level because no company-specific facts, periods, or transaction mechanics were provided.
```

**Notes**

- Correctly used the rare explicit `full_report` path.
- Stopped after the outline as requested.

### TC-08

**Should trigger:** No

**Prompt**

Build me a PowerPoint slide summarizing the key QoE findings from this deal and make it suitable for an IC deck.

**What success looks like**

- The skill should not be the main path here
- The system should route toward slide-generation behavior instead of report-writing behavior

**Triggered:** 

**Result**

```text
[Paste result here]
```

**Notes**

- Not yet tested.

### TC-09

**Should trigger:** No

**Prompt**

Update the quality-of-earnings reference file so it has better examples and a cleaner structure.

**What success looks like**

- The skill should not trigger
- The task should be treated as reference maintenance rather than report writing

**Triggered:** 

**Result**

```text
[Paste result here]
```

**Notes**

- Not yet tested.

### TC-10

**Should trigger:** Borderline yes

**Prompt**

Write the working capital section. I only know that average NWC was $6.3 million, reported average NWC was $7.1 million, and deferred revenue plus annual bonus accruals were the main adjustments.

**What success looks like**

- The skill should still proceed with placeholders where support is thin
- It should write an NWC section rather than block unnecessarily
- It should not invent support for the adjustments

**Triggered:** Yes

**Result**

```text
Net working capital
Average reported net working capital was $7.1 million, which decreased to adjusted average net working capital of $6.3 million after the main working-capital adjustments for deferred revenue and annual bonus accruals.

Basis of presentation
The working-capital analysis is presented on an average net working capital basis. Based on the information provided, the principal adjustments relate to balances that do not reflect the recurring operating working-capital requirements of the business or require normalization to align with the underlying operating profile. No supported target or peg basis was provided, and accordingly the section presents adjusted average net working capital only.

Net working capital adjustments

Deferred revenue: Deferred revenue is excluded from net working capital to the extent it reflects advance billings for services to be provided in future periods, rather than the recurring operating liquidity requirements of the business. Including this balance would overstate the average working-capital position. [Deferred revenue quantum and underlying billing mechanics not provided.]

Annual bonus accruals: Annual bonus accruals are adjusted to the extent the reported balance does not reflect the normalized recurring working-capital profile of the business on an average basis. This adjustment removes the distorting effect of bonus-related accrual timing within the reporting period. [Bonus accrual quantum, payout timing, and whether the adjustment reflects a definitional exclusion or timing normalization were not provided.]

No supported seasonality, driver, or days analysis was provided, and no target working capital conclusion has been included on the basis of the information available.

What changed / assumptions
Drafted this as a concise full working-capital section anchored to the reported average NWC of $7.1 million and adjusted average NWC of $6.3 million. I assumed deferred revenue and annual bonus accruals are the only main adjustments driving the $0.8 million decrease, but the split between those items and their exact treatment were not provided, so I kept the commentary high level and ring-fenced unsupported detail.
```

**Notes**

- Good example of the skill proceeding under incomplete information.
- Correct use of placeholders and ring-fencing.

## Second-Pass Quality Scaling Test Set

Use this second table once the first-pass behavior feels stable. These prompts provide more detail, richer analytical framing, and sample exhibit-style inputs so you can test whether output quality scales with better source material rather than just whether the skill triggers.

| ID | Focus | Should trigger | Prompt | What success looks like |
| --- | --- | --- | --- | --- |
| QS-01 | High-detail QoE section | Yes | Draft a full quality of earnings section from the following inputs. Period: TTM Jun-24. Reported EBITDA: $21.3 million. Adjusted EBITDA: $24.0 million. Adjustments: transaction fees $0.9 million, founder payroll normalization $1.1 million, ERP implementation costs $0.7 million. Gross margin declined 180 bps in FY24 due to a temporary customer mix shift. Customer A represented 28% of FY24 revenue and renewed on a three-year contract in May 2024. The seller also presented a $0.6 million add-back for under-market rent, but support is incomplete and should remain outside the bridge unless clearly supportable. | The section should become more nuanced and analytical than the first-pass QoE test; it should distinguish included vs. excluded items cleanly; it should connect bridge items to the broader earnings view; it should not collapse into generic filler. |
| QS-02 | High-detail NWC section with sample exhibit | Yes | Write the net working capital section using this sample exhibit data. Reported average NWC: $8.4 million. Adjusted average NWC: $7.2 million. Adjustments: deferred revenue ($0.5 million exclusion), annual bonus accrual ($0.4 million normalization), related-party receivable ($0.3 million exclusion). Supporting notes: deferred revenue relates to annual prepaid maintenance contracts; bonus accrual is paid each March and spikes at calendar year-end; related-party receivable relates to a shareholder management fee balance not expected post-close. Include a concise basis-of-presentation paragraph and schedule-aligned commentary. | The output should use the richer facts to produce tighter, more specific adjustment narratives with better logic and less placeholder dependence. It should feel more like a real NWC section and less like a generic template. |
| QS-03 | Net debt exhibit quality | Yes | Draft a net debt exhibit narrative from this sample schedule. Cash: $6.8 million, including $0.6 million of outstanding deposits in transit. Restricted cash: $1.4 million held in regulated insurance entities and excluded from available cash. Debt: revolver $12.0 million. Debt-like items: change-of-control bonuses $1.1 million, unpaid transaction fees $0.7 million, finance leases $2.3 million. Notes: the seller argues transaction fees should be excluded from net debt because they are deal-related; the buyer view is that unpaid fees at closing remain debt-like. | The narrative should read like a real purchase-price mechanics note, show treatment judgment clearly, and explain the contested item without becoming a negotiation memo. |
| QS-04 | Business overview with better source support | Yes | Write the business overview section for a specialty dental platform. The platform operates 42 clinics across Texas, Arizona, and Nevada. Revenue mix is 62% fee-for-service, 23% PPO, and 15% capitated Medicaid. The transaction perimeter excludes a captive lab business and all owned real estate. The Company completed six tuck-in acquisitions in FY24 and still relies on the seller for centralized procurement and treasury support. | The section should scale up in quality by integrating mix, perimeter, recent acquisitions, and shared-service dependencies in a disciplined way without drifting into diligence commentary outside the section. |
| QS-05 | Reporting environment with process depth | Yes | Write the reporting environment section from the following facts. FY22-FY24 are audited under US GAAP. Monthly close takes 9 business days, with revenue cut-off and reserves finalized on day 7. NetSuite is the ERP, Adaptive is used for reporting packs, and payroll is outsourced to ADP. Revenue recognition for implementation fees changed in Q1 FY25 from milestone-based recognition to a ratable model for certain contracts. Bad debt reserves are reviewed monthly by the controller and CFO. | The section should show better process sequencing, ownership, systems flow, and policy-change implications than the lighter first-pass test. |
| QS-06 | Multi-section scoped drafting | Yes | Draft only the executive summary and net debt sections for a payments business. Facts: adjusted EBITDA $31.2 million, NWC neutral to target, net debt $18.7 million including deferred acquisition consideration of $2.5 million and trapped cash of $1.3 million. Reporting issue: TTM balances rely on management accounts reconciled to the trial balance. Do not draft any other sections. | The response should stay tightly scoped to the two requested sections, maintain coherence across them, and avoid expanding into a full report. |

## Suggested Next Expansion

After this second pass, add test cases for:

- informal section aliases
- multi-section requests that should stay scoped
- weak source materials with heavy placeholder use
- QoE grouped adjustment sets
- net debt edge cases with other considerations
- reporting-environment requests for payroll or IT policy subtopics
- prompts that look similar to writing tasks but should route to another skill
