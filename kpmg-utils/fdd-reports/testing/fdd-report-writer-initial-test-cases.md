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
| TC-01 | Yes | Yes | Pass with note | Produced a QoE section with placeholders and close-out note; user wants bold adjustment names in adjustment narratives. |
| TC-02 | Yes | Yes | Pass with note | Produced a clean client-ready rewrite for the NWC adjustment; user wants the final sentence removed. |
| TC-03 | Yes | Removed from current review set | Removed | Removed from the active evaluation set for now per user feedback. |
| TC-04 | Yes | Yes | Pass | Produced a scoped business overview with good perimeter handling. |
| TC-05 | Yes | Yes | Pass with note | Produced an exhibit-style net debt narrative with placeholders, but user flagged the adjustment narrative structure as not yet in the desired format. |
| TC-06 | Yes | Yes | Pass | Produced a practical reporting environment section with implication language; user feedback was very strong. |
| TC-07 | Yes | Yes | Pass | Returned an outline-only full-report response as intended; user feedback was very strong. |
| TC-08 | No | No | Pass | User confirmed the skill did not trigger. |
| TC-09 | No | No | Pass | User confirmed the skill did not trigger and the outcome was good. |
| TC-10 | Borderline yes | Yes | Pass with note | Proceeded with placeholders and stayed anchored to section drafting; user wants stronger exhibit formatting and bold adjustment names. |

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
- User feedback: make the adjustment names bold in this format, e.g. `**Transaction fees:**` and `**ERP migration costs:**`.

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
- User feedback: remove the sentence `Excluding this balance avoids distorting the average net working capital analysis.`

### TC-03

**Should trigger:** Yes

**Prompt**

Polish the following executive summary draft without changing the overall structure: "Net debt was 22.5m at close. Main items were term debt and bonuses. Working capital was below target because receivables were high."

**What success looks like**

- Routes to `section` + `polish`
- Preserves the draft’s basic structure and meaning
- Improves tone, precision, and readability
- Does not re-architect the whole section

**Triggered:** Removed from current review set

**Result**

```text
[Removed from active review set]
```

**Notes**

- Removed from the active review set for now per user feedback.

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
- User feedback: looks very good.

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
- User feedback: this is not yet adhering to the desired adjustment narrative structure.

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
- User feedback: very strong.

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
- User feedback: very strong.

### TC-08

**Should trigger:** No

**Prompt**

Build me a PowerPoint slide summarizing the key QoE findings from this deal and make it suitable for an IC deck.

**What success looks like**

- The skill should not be the main path here
- The system should route toward slide-generation behavior instead of report-writing behavior

**Triggered:** No

**Result**

```text
[Confirmed non-trigger outcome]
```

**Notes**

- User feedback: confirmed that nothing was triggered, which is the desired behavior.

### TC-09

**Should trigger:** No

**Prompt**

Update the quality-of-earnings reference file so it has better examples and a cleaner structure.

**What success looks like**

- The skill should not trigger
- The task should be treated as reference maintenance rather than report writing

**Triggered:** No

**Result**

```text
[Confirmed non-trigger outcome]
```

**Notes**

- User feedback: confirmed this was good and did not trigger the report-writing path.

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
- User feedback: the lead-in sentence works, but the exhibit should break into new lines with bold adjustment names such as `**Cash:**` and `**Transaction bonus:**`, and the stray quoted placeholder text should be removed.

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

## Second-Pass Evaluation Summary

| ID | Should trigger | Actual result | Status | Notes |
| --- | --- | --- | --- | --- |
| QS-01 | Yes | Yes | Pass with note | Strong substance, but the section behaved more like bridge commentary than a standard QoE section with diligence adjustments presented in the usual structure. |
| QS-02 | Yes | Yes | Pass | Good schedule-aligned NWC section with materially better specificity. |
| QS-03 | Yes | Yes | Pass with note | Strong treatment judgment; net debt bridge depends on the stated cash definition assumption. |
| QS-04 | Yes | Yes | Pass with note | Good perimeter and mix handling, but the bullet structure should compress into grouped narrative rather than feeling like prose broken into bullets. |
| QS-05 | Yes | Yes | Pass | Better process sequencing and policy-change framing than the first-pass reporting test; user feedback was strong. |
| QS-06 | Yes | Yes | Pass | Stayed tightly scoped to two sections and carried the reporting limitation through both. |

## Second-Pass Detailed Results

### QS-01

**Should trigger:** Yes

**Prompt**

Draft a full quality of earnings section from the following inputs. Period: TTM Jun-24. Reported EBITDA: $21.3 million. Adjusted EBITDA: $24.0 million. Adjustments: transaction fees $0.9 million, founder payroll normalization $1.1 million, ERP implementation costs $0.7 million. Gross margin declined 180 bps in FY24 due to a temporary customer mix shift. Customer A represented 28% of FY24 revenue and renewed on a three-year contract in May 2024. The seller also presented a $0.6 million add-back for under-market rent, but support is incomplete and should remain outside the bridge unless clearly supportable.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Quality of Earnings

TTM Jun-24 reported EBITDA was $21.3 million. Based on the adjustments identified below, adjusted EBITDA was $24.0 million, reflecting $2.7 million of add-backs for items that do not represent the normalized earnings profile of the business.

| $ in millions | TTM Jun-24 |
| --- | ---: |
| Reported EBITDA | 21.3 |
| Transaction fees | 0.9 |
| Founder payroll normalization | 1.1 |
| ERP implementation costs | 0.7 |
| Adjusted EBITDA | 24.0 |

The reported-to-adjusted EBITDA bridge is driven by three adjustments. First, $0.9 million of transaction fees were added back. These costs relate to the contemplated transaction process and are not expected to recur as part of the ongoing operating cost base.

Second, EBITDA was increased by $1.1 million for founder payroll normalization. This adjustment reflects the difference between historical founder compensation and a supportable go-forward management cost structure. Based on the information provided, the adjustment is treated as a normalization item to align earnings to the expected post-close cost base.

Third, $0.7 million of ERP implementation costs were added back. These costs relate to a discrete systems implementation project and reflect temporary spend rather than the recurring cost required to operate the business on a go-forward basis.

Outside of the EBITDA bridge, FY24 gross margin declined by 180 basis points due to a temporary customer mix shift. This movement should be considered in evaluating recent earnings quality, as the margin decline reflects mix rather than an identified structural change in pricing or underlying cost absorption based on the facts provided. Customer concentration also remains an important consideration, with Customer A representing 28% of FY24 revenue. Management indicated that Customer A renewed on a three-year contract in May 2024, which provides visibility over a significant portion of the current revenue base and reduces near-term contract rollover risk.

The seller also presented a $0.6 million add-back for under-market rent. This item remains outside the adjusted EBITDA bridge because support is incomplete. Unless the seller provides clear evidence that the historical rent expense is below a supportable market rate and that the proposed normalization reflects the go-forward occupancy cost of the business, the item should remain excluded from normalized earnings.

**What changed / assumptions**

Drafted as a full QoE section using the provided TTM Jun-24 bridge and key diligence points. I assumed the founder payroll normalization is supportable and included in adjusted EBITDA as provided, but I did not add support detail beyond the facts given. I also treated the under-market rent item as an excluded seller adjustment rather than a sensitivity because the input indicated it should remain outside the bridge unless clearly supportable.
```

**Notes**

- Strong underlying substance, but this reads more like adjustment-bridge commentary than a standard QoE section.
- For a true QoE section, the drafting should default to a standard lead-in sentence and then present the diligence adjustments as adjustments, with each adjustment name in bold parentheses followed by the adjustment description.
- The `first / second / third adjustment` sequencing and the `outside of the EBITDA bridge` framing are not the preferred section structure unless the prompt is specifically asking for bridge commentary tied to a waterfall-style exhibit.

### QS-02

**Should trigger:** Yes

**Prompt**

Write the net working capital section using this sample exhibit data. Reported average NWC: $8.4 million. Adjusted average NWC: $7.2 million. Adjustments: deferred revenue ($0.5 million exclusion), annual bonus accrual ($0.4 million normalization), related-party receivable ($0.3 million exclusion). Supporting notes: deferred revenue relates to annual prepaid maintenance contracts; bonus accrual is paid each March and spikes at calendar year-end; related-party receivable relates to a shareholder management fee balance not expected post-close. Include a concise basis-of-presentation paragraph and schedule-aligned commentary.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Net working capital

Average reported net working capital was $8.4 million. After the adjustments described below, adjusted average net working capital was $7.2 million, reflecting a net $1.2 million reduction for items that do not represent the normalized operating working-capital position of the business.

Basis of presentation  
The schedule below presents reported average net working capital and the adjustments identified to arrive at adjusted average net working capital. The adjustments reflect definitional and normalization items to exclude balances not expected to recur in the go-forward working-capital profile and to align certain accruals to the underlying operating cycle.

| $ in millions | Average NWC |
| --- | ---: |
| Reported average NWC | 8.4 |
| Deferred revenue exclusion | (0.5) |
| Annual bonus accrual normalization | (0.4) |
| Related-party receivable exclusion | (0.3) |
| Adjusted average NWC | 7.2 |

Net working capital adjustments

1. **Deferred revenue:** Deferred revenue of $0.5 million was excluded from average net working capital. The balance relates to annual prepaid maintenance contracts and reflects amounts billed in advance of service delivery rather than operating liquidity required to support the business on a normalized basis.

2. **Annual bonus accrual:** Average net working capital was reduced by $0.4 million to normalize the annual bonus accrual. The accrual is paid each March and peaks at calendar year-end, which creates a timing-driven increase in accrued liabilities that is not representative of the average intra-year working-capital requirement.

3. **Related-party receivable:** A $0.3 million related-party receivable was excluded from average net working capital. The balance relates to a shareholder management fee receivable and is not expected to remain outstanding following the transaction, so it has been removed from the go-forward operating working-capital profile.

No target or peg conclusion is presented based on the information provided; accordingly, this section is limited to reported and adjusted average net working capital.

**What changed / assumptions**

Drafted as a full NWC section with a concise basis-of-presentation paragraph and schedule-aligned commentary. I assumed each listed adjustment reduces reported average NWC as presented, and I treated the deferred revenue and related-party receivable items as definitional exclusions and the bonus item as a normalization adjustment.
```

**Notes**

- This is a good quality-scaling result: the section became more specific without adding filler or unnecessary placeholders.
- The schedule and commentary stayed tightly aligned, which is what we want from richer NWC prompts.

### QS-03

**Should trigger:** Yes

**Prompt**

Draft a net debt exhibit narrative from this sample schedule. Cash: $6.8 million, including $0.6 million of outstanding deposits in transit. Restricted cash: $1.4 million held in regulated insurance entities and excluded from available cash. Debt: revolver $12.0 million. Debt-like items: change-of-control bonuses $1.1 million, unpaid transaction fees $0.7 million, finance leases $2.3 million. Notes: the seller argues transaction fees should be excluded from net debt because they are deal-related; the buyer view is that unpaid fees at closing remain debt-like.

**Verb / team:** `draft` + `exhibit`

**Triggered:** Yes

**Result**

```text
## Net debt and debt-like items

The schedule below presents the Company's net debt position based on reported cash, funded debt, and identified debt-like items. On the basis provided, reported cash totals $6.8 million, of which $0.6 million relates to outstanding deposits in transit. Restricted cash of $1.4 million held in regulated insurance entities is excluded from available cash.

| $ in millions | Balance |
| --- | ---: |
| Cash | 6.8 |
| Revolver | (12.0) |
| Change-of-control bonuses | (1.1) |
| Unpaid transaction fees | (0.7) |
| Finance leases | (2.3) |
| **Net debt** | **(9.3)** |

The main components of the net debt schedule are as follows:

**Cash:** Reported cash was $6.8 million. This balance includes $0.6 million of deposits in transit that remained outstanding as of the reference date and should be confirmed as cleared cash in the closing funds flow. Separately, $1.4 million of restricted cash held in regulated insurance entities is excluded from available cash given it is not freely accessible to the parent for transaction settlement purposes.

**Revolver:** The Company had $12.0 million drawn on its revolving credit facility. This balance represents the primary funded debt item in the schedule and would be expected to be addressed through the closing indebtedness settlement mechanics unless otherwise refinanced or assumed.

**Change-of-control bonuses:** Change-of-control bonus obligations of $1.1 million are treated as debt-like. These amounts would crystallize in connection with the transaction and remain a purchase-price relevant obligation if unpaid at closing.

**Unpaid transaction fees:** Unpaid transaction fees of $0.7 million are included as debt-like in the buyer view. While the seller has argued these fees should be excluded because they are deal-related, unpaid advisory costs that remain outstanding at closing represent a cash outflow required to complete the transaction and are typically reflected in net debt or the funds flow if for the seller's account.

**Finance leases:** Finance lease obligations of $2.3 million are included in net debt. These balances represent contractual financing obligations that remain outstanding beyond closing unless specifically settled as part of the transaction.

On the basis of the balances provided, net debt is $9.3 million. The principal classification point for discussion is the treatment of unpaid transaction fees, which should remain included if they are unpaid at closing and borne by the seller.

**What changed / assumptions**

Drafted this as an exhibit narrative rather than a full section, with commentary aligned to the schedule order. I treated the $6.8 million cash balance as the starting reported cash figure and separately flagged the deposits in transit and excluded restricted cash in the narrative, rather than subtracting restricted cash again in the bridge, because the prompt stated it is excluded from available cash but did not provide a separate reported gross cash figure inclusive of that balance.
```

**Notes**

- Good exhibit routing and strong purchase-price mechanics language.
- The explicit cash-definition assumption is helpful, but it also shows why future automated tests should separately validate schedule math and narrative logic.

### QS-04

**Should trigger:** Yes

**Prompt**

Write the business overview section for a specialty dental platform. The platform operates 42 clinics across Texas, Arizona, and Nevada. Revenue mix is 62% fee-for-service, 23% PPO, and 15% capitated Medicaid. The transaction perimeter excludes a captive lab business and all owned real estate. The Company completed six tuck-in acquisitions in FY24 and still relies on the seller for centralized procurement and treasury support.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Business overview

- The Company operates a specialty dental platform with 42 clinics across Texas, Arizona, and Nevada.
- The transaction perimeter includes the clinic operations and related operating activities, and excludes a captive lab business and all owned real estate.
- The platform provides specialty dental services through its clinic network, with revenue generated from a mix of fee-for-service patient billings, PPO reimbursement, and capitated Medicaid arrangements.
- Fee-for-service represented 62% of revenue, PPO represented 23%, and capitated Medicaid represented 15%, resulting in a predominantly visit- and procedure-based revenue model with a smaller contracted reimbursement component.
- The current footprint across three states provides regional density, while the multi-payor mix creates different reimbursement and margin dynamics across patient cohorts.
- The Company completed six tuck-in acquisitions in FY24. These acquisitions expanded the clinic base and form part of the current operating platform.
- The business continues to rely on the seller for centralized procurement and treasury support. As a result, historical operations reflect shared-service support that would need to be replaced or transitioned in a standalone post-close structure.

**What changed / assumptions**

Drafted as a full business overview section in bullet form, consistent with the section contract. I assumed the captive lab and owned real estate are fully outside the transaction perimeter and kept the standalone point focused on procurement and treasury because those were the only seller dependencies provided.
```

**Notes**

- The content quality improved meaningfully on perimeter, mix, and seller dependency handling.
- The main miss is format: this should use fewer bullets and group related points into a more narrative structure.
- A good revision lens here is that some current outputs read like narrative content broken into bullets rather than true bullet-point presentation.

### QS-05

**Should trigger:** Yes

**Prompt**

Write the reporting environment section from the following facts. FY22-FY24 are audited under US GAAP. Monthly close takes 9 business days, with revenue cut-off and reserves finalized on day 7. NetSuite is the ERP, Adaptive is used for reporting packs, and payroll is outsourced to ADP. Revenue recognition for implementation fees changed in Q1 FY25 from milestone-based recognition to a ratable model for certain contracts. Bad debt reserves are reviewed monthly by the controller and CFO.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Reporting environment

- The Company’s FY22 through FY24 financial statements were audited under US GAAP. These audited annual periods provide the primary basis for historical analysis, while FY25 should be read in the context of the accounting policy change noted below.
- **Close process:** Management completes the monthly close in approximately nine business days. Revenue cut-off and reserve balances are finalized on day 7, which means the principal judgmental entries are completed before the close is finalized and the reporting pack is issued.
- **Systems environment:** NetSuite serves as the core ERP and Adaptive is used to prepare monthly reporting packs. Payroll processing is outsourced to ADP, which separates payroll administration from the core financial reporting system but leaves financial reporting and close ownership within the finance function.
- **Revenue recognition:** In Q1 FY25, the Company changed its revenue recognition policy for implementation fees on certain contracts from milestone-based recognition to a ratable model. This change affects comparability between FY25 and the audited FY22-FY24 periods for the affected contract population and should be considered when evaluating period-over-period revenue trends and margin conversion.
- **Reserve process:** Bad debt reserves are reviewed monthly by the controller and CFO. This review process places ownership of a key estimate area with senior finance leadership and indicates that reserve balances are reassessed as part of the recurring close cycle rather than only at quarter-end or year-end.
- **Implication for diligence:** The reporting environment appears established, with audited annual financial statements, a defined monthly close cadence, and a standard finance systems stack. The main point affecting comparability is the Q1 FY25 change in implementation fee recognition, while revenue cut-off and bad debt reserves remain the most relevant recurring judgment areas within the close process.

**What changed / assumptions**

Drafted this as a standard reporting environment section with topic-led bullets, consistent with the section contract. I assumed the revenue recognition change applies only to a subset of implementation contracts, as stated, and did not infer any broader change to the Company’s overall revenue policy.
```

**Notes**

- This is stronger than the first-pass reporting test because it sequences close, systems, policy change, and reserve ownership more clearly.
- The content was strong overall.

### QS-06

**Should trigger:** Yes

**Prompt**

Draft only the executive summary and net debt sections for a payments business. Facts: adjusted EBITDA $31.2 million, NWC neutral to target, net debt $18.7 million including deferred acquisition consideration of $2.5 million and trapped cash of $1.3 million. Reporting issue: TTM balances rely on management accounts reconciled to the trial balance. Do not draft any other sections.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Executive summary

- The analysis for the payments business indicates adjusted EBITDA of $31.2 million.
- Net working capital is neutral to target based on the information provided, indicating no identified surplus or deficit against the current target basis.
- Net debt is $18.7 million, including $2.5 million of deferred acquisition consideration and $1.3 million of trapped cash.
- TTM balances rely on management accounts reconciled to the trial balance rather than audited financial statements. As a result, the TTM analysis is usable for current deal purposes but should be read with the reporting-basis limitation in mind.

## Net debt and debt-like items

The schedule indicates net debt of $18.7 million as of the reference date provided by management. This balance includes deferred acquisition consideration and trapped cash, each of which affects the purchase-price analysis and closing indebtedness position.

**Deferred acquisition consideration:** Net debt includes $2.5 million of deferred consideration relating to prior acquisitions. This balance represents an outstanding purchase-price obligation that remains payable post-close unless otherwise settled through the transaction mechanics.

**Trapped cash:** Net debt includes $1.3 million of trapped cash. Although this cash may be recorded on the balance sheet, it is not currently available for general transaction settlement or upstreaming and is therefore treated as unavailable in the net debt analysis.

The net debt position should be read together with the reporting-basis note that TTM balances are derived from management accounts reconciled to the trial balance. While this provides a current-period basis for analysis, final closing indebtedness should be confirmed against the latest balance-sheet support and funds flow.

**What changed / assumptions**

Drafted only the two requested sections and did not expand into any other report areas. I assumed the net debt figure of $18.7 million already reflects the inclusion of deferred acquisition consideration and trapped cash, so I described those items as components of net debt rather than rebuilding the bridge.
```

**Notes**

- Strong scope control: it stayed inside the two requested sections and preserved coherence across them.
- The reporting-basis limitation carried through cleanly, which is exactly what we want from multi-section scoped drafting.

## Third-Pass Manual Expansion

Use this third pass before revisions if you want one more round of manual checking focused on the main gaps and risks surfaced by the second pass.

| ID | Focus | Should trigger | Prompt | What success looks like |
| --- | --- | --- | --- | --- |
| QS-07 | Informal alias + narrative format discipline | Yes | Write the QoE section for this distributor. TTM Mar-25 reported EBITDA was $14.8 million and adjusted EBITDA was $16.0 million. Adjustments were restructuring costs of $0.6 million and one-time cyber incident response costs of $0.6 million. Revenue concentration is modest, with no customer above 10%. Keep it in normal report prose rather than bullets. | The skill should map the informal `QoE` alias correctly, route to `section` + `draft`, and produce narrative section prose rather than a bullet summary. |
| QS-08 | Reporting environment subtopic depth | Yes | Draft the reporting environment section with emphasis on payroll and IT dependencies. FY23-FY25 are audited. Monthly close takes 11 business days. ERP is Sage Intacct, payroll is outsourced to Ceridian, and management relies on a seller-owned data warehouse for monthly KPI reporting. User-access reviews are informal and there is no documented quarterly access recertification. | The section should stay within reporting environment, integrate payroll and IT dependency commentary naturally, and avoid drifting into a standalone IT diligence memo. |
| QS-09 | Net debt math edge case | Yes | Draft a net debt exhibit narrative from this schedule. Cash available to the business is $4.2 million. Total cash on the balance sheet is $5.0 million, including $0.8 million of restricted escrow cash. Debt includes a term loan of $9.5 million and finance leases of $1.4 million. Debt-like items include unpaid bonuses of $0.9 million. Make the treatment of restricted cash explicit and keep the bridge internally consistent. | The output should avoid ambiguity between gross cash and available cash, explain the restricted cash treatment clearly, and not create schedule math confusion. |
| QS-10 | Weak-source placeholder discipline | Yes | Write the net working capital section. Average NWC was $5.9 million and adjusted average NWC was $5.1 million. Management said deferred revenue and accrued rebates were the main adjustments, but no amounts by line item were provided. Keep the section client-ready and do not overstate support. | The skill should still proceed, but it should ring-fence missing detail much more explicitly than in a fully supported case and avoid fake precision. |
| QS-11 | Multi-section scope under pressure | Yes | Draft the executive summary, business overview, and reporting environment sections only for a software-enabled healthcare company. Facts: revenue is recurring subscription plus implementation fees, adjusted EBITDA is $27.4 million, net debt is modest, and monthly reporting is prepared from audited GL data. Do not draft QoE, NWC, or net debt. | The response should stay inside the three requested sections and resist the temptation to spill into adjacent sections just because the fact pattern suggests them. |
| QS-12 | Non-trigger lookalike | No | Update the business overview reference guidance so it better teaches when to discuss seller dependencies and transaction perimeter. | The skill should not treat this as report writing. The task should be handled as reference maintenance or another documentation workflow, not `fdd-report-writer` drafting. |
| QS-13 | Exhibit vs. section boundary | Yes | Write a concise bridge note explaining why deferred revenue, customer deposits, and rent accrual true-ups were excluded from average working capital. Do not draft the full NWC section. | The skill should route to `exhibit`, stay narrow, and avoid expanding into basis-of-presentation or target-working-capital commentary. |
| QS-14 | Rewrite vs. polish distinction | Yes | Rewrite this reporting environment paragraph so it is client-ready: "Close is okay but kind of slow, ERP is Netsuite, rev rec changed, and the CFO checks reserves every month." | The skill should choose a narrow rewrite path, materially improve the wording, and not expand this into a full reporting environment section. |

## Third-Pass Evaluation Summary

| ID | Should trigger | Actual result | Status | Notes |
| --- | --- | --- | --- | --- |
| QS-07 | Yes | Yes | Pass with note | Correctly handled the `QoE` alias and stayed in prose, but the output again behaved more like bridge commentary than a standard QoE section. |
| QS-08 | Yes | Yes | Pass | Strong payroll and IT dependency treatment without drifting into a standalone IT memo. |
| QS-09 | Yes | Yes | Pass | Strong net debt exhibit structure with explicit restricted-cash treatment and internally consistent bridge math. |
| QS-10 | Yes | Yes | Pass | Good weak-support discipline and appropriate restraint around unquantified adjustments. |
| QS-11 | Yes | Yes | Pass with note | Stayed within the requested sections and handled sparse inputs reasonably, though limited detail constrained the depth. |
| QS-12 | No | No | Pass | Correctly handled as reference-maintenance work rather than report writing. |
| QS-13 | Yes | Yes | Pass | Stayed narrow as a bridge note and did not over-expand into a full NWC section. |
| QS-14 | Yes | Yes | Pass | Clean rewrite behavior without over-expanding into a full section. |

## Third-Pass Detailed Results

### QS-07

**Should trigger:** Yes

**Prompt**

Write the QoE section for this distributor. TTM Mar-25 reported EBITDA was $14.8 million and adjusted EBITDA was $16.0 million. Adjustments were restructuring costs of $0.6 million and one-time cyber incident response costs of $0.6 million. Revenue concentration is modest, with no customer above 10%. Keep it in normal report prose rather than bullets.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Quality of earnings

TTM Mar-25 reported EBITDA was $14.8 million. After the adjustments identified below, adjusted EBITDA was $16.0 million, reflecting $1.2 million of add-backs for items that do not represent the normalized earnings profile of the business.

The increase from reported to adjusted EBITDA is driven by two items. First, EBITDA was increased by $0.6 million for restructuring costs. These costs relate to actions taken during the period to reorganize the business and do not reflect the ongoing cost base expected to support normal operations. Second, EBITDA was increased by $0.6 million for one-time cyber incident response costs. These costs relate to a discrete incident and associated remediation activity rather than the recurring earnings profile of the distributor.

Based on the information provided, the adjusted EBITDA bridge reflects only these two non-recurring items and does not indicate broader normalization issues within the current earnings base. Customer concentration also appears limited, with no customer representing more than 10% of revenue, which reduces dependence on any single account in assessing the sustainability of the current revenue base.

Overall, TTM Mar-25 adjusted EBITDA of $16.0 million reflects the removal of identified non-recurring restructuring and cyber response costs from reported EBITDA of $14.8 million. On the basis of the facts provided, the earnings profile appears supported by a diversified customer base and a limited set of specific period adjustments.

**What changed / assumptions**

Drafted this as a normal prose QoE section rather than bullets, while keeping the reported-to-adjusted EBITDA bridge central to the discussion. I assumed both restructuring and cyber response costs are fully non-recurring based on the wording provided and did not add any further commentary on margin, growth, or customer-specific trends beyond the concentration note supplied.
```

**Notes**

- Correct alias handling and strong prose-format discipline.
- This still has the same structural issue as QS-01: it behaves more like adjustment-bridge commentary than a standard QoE section.
- A revision should make the section default to adjustment-led presentation, with the adjustments clearly introduced as diligence adjustments rather than narrated as a bridge.

### QS-08

**Should trigger:** Yes

**Prompt**

Draft the reporting environment section with emphasis on payroll and IT dependencies. FY23-FY25 are audited. Monthly close takes 11 business days. ERP is Sage Intacct, payroll is outsourced to Ceridian, and management relies on a seller-owned data warehouse for monthly KPI reporting. User-access reviews are informal and there is no documented quarterly access recertification.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
## Reporting environment

The Company’s FY23 through FY25 financial statements are audited, which provides an established basis for the historical financial analysis. Management completes the monthly close in approximately 11 business days, indicating a relatively standard reporting cadence, although the close environment should be considered alongside the system and control dependencies noted below.

Payroll processing is outsourced to Ceridian. This arrangement reduces internal processing activity within the finance function, but it also creates reliance on a third-party provider for payroll execution and related data flows into the financial reporting environment. Payroll therefore remains dependent on the completeness and accuracy of the Ceridian interface, internal review of payroll outputs, and timely posting of payroll-related entries through the close process.

Sage Intacct serves as the Company’s ERP. In addition to the core ERP environment, management relies on a seller-owned data warehouse to produce monthly KPI reporting. This dependency is relevant because a portion of management reporting and operating visibility sits outside the Company’s owned systems environment and would require transition or replacement in a standalone post-close structure. Historical KPI reporting should therefore be read in the context of this seller-supported data architecture.

IT control formality appears limited in at least one key area. User-access reviews are informal, and there is no documented quarterly access recertification process. As a result, access governance over financial and reporting systems appears less formalized than in more mature control environments, which is relevant when considering reliance on system access management and segregation of duties.

Overall, the reporting environment includes audited financial statements and a functioning monthly close process, but payroll outsourcing and dependence on a seller-owned data warehouse create important operating dependencies. The lack of documented periodic access recertification also indicates a weaker IT control environment around user access that should be considered in evaluating the reporting infrastructure on a standalone basis.

**What changed / assumptions**

Drafted this as a standard reporting environment section with added emphasis on payroll and IT dependencies, as requested. I assumed the seller-owned data warehouse supports KPI reporting only and did not infer that it is used for core general ledger processing or statutory financial reporting.
```

**Notes**

- Strong payroll and IT dependency commentary with good scope control.
- This stays inside reporting environment rather than drifting into a separate IT diligence memo.

### QS-09

**Should trigger:** Yes

**Prompt**

Draft a net debt exhibit narrative from this schedule. Cash available to the business is $4.2 million. Total cash on the balance sheet is $5.0 million, including $0.8 million of restricted escrow cash. Debt includes a term loan of $9.5 million and finance leases of $1.4 million. Debt-like items include unpaid bonuses of $0.9 million. Make the treatment of restricted cash explicit and keep the bridge internally consistent.

**Verb / team:** `draft` + `exhibit`

**Triggered:** Yes

**Result**

```text
The schedule below presents the Company’s adjusted net debt position based on cash available to the business of $4.2 million. Total cash on the balance sheet is $5.0 million, of which $0.8 million relates to restricted escrow cash and is excluded from available cash for net debt purposes.

| Line item | Balance ($m) |
| --- | ---: |
| Total cash on balance sheet | 5.0 |
| Less: restricted escrow cash | (0.8) |
| Cash available to the business | 4.2 |
| Term loan | (9.5) |
| Finance leases | (1.4) |
| Reported debt | (10.9) |
| Unpaid bonuses | (0.9) |
| Adjusted net debt | (7.6) |

Cash available to the business: The balance sheet shows total cash of $5.0 million; however, $0.8 million is held in restricted escrow and is not treated as available cash in the net debt bridge. Accordingly, only $4.2 million is credited against indebtedness.

Term loan: The Company’s funded debt position includes a term loan of $9.5 million outstanding at the reference date.

Finance leases: Debt also includes $1.4 million of finance lease obligations, which are reflected as part of indebtedness in the net debt calculation.

Unpaid bonuses: In addition to reported debt, the schedule includes $0.9 million of unpaid bonuses as a debt-like item. This amount should be reflected in the purchase price adjustment to the extent it remains unpaid at closing.

After excluding restricted escrow cash and including identified debt-like items, adjusted net debt totals $7.6 million.

What changed / assumptions: Assumed the requested output was an exhibit narrative tied to a simple bridge. Treated restricted escrow cash as excluded from available cash, not as a separate debt-like item, to keep the bridge internally consistent from $5.0 million total cash to $4.2 million available cash and $7.6 million adjusted net debt.
```

**Notes**

- Strong net debt exhibit structure and explicit cash-definition treatment.
- User feedback: this looks great.

### QS-10

**Should trigger:** Yes

**Prompt**

Write the net working capital section. Average NWC was $5.9 million and adjusted average NWC was $5.1 million. Management said deferred revenue and accrued rebates were the main adjustments, but no amounts by line item were provided. Keep the section client-ready and do not overstate support.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
Net working capital
Adjusted average net working capital was $5.1 million, compared to reported average net working capital of $5.9 million. Based on management’s description of the schedule, the reduction of $0.8 million reflects adjustments related primarily to deferred revenue and accrued rebates; however, no line-item quantification was provided for those categories.

Basis of presentation
The working capital analysis is presented on an average basis and distinguishes between reported and adjusted net working capital. On the information provided, the adjusted view reflects management-defined changes to reported working capital rather than a fully supported line-by-line reclass or diligence adjustment schedule.

Reported average net working capital: Reported average net working capital was $5.9 million over the period presented.

Adjusted average net working capital: Adjusted average net working capital was $5.1 million, or $0.8 million below the reported average basis. The schedule support provided does not include the amount attributable to each adjustment line, so the bridge from reported to adjusted working capital cannot be quantified by category.

Deferred revenue and accrued rebates: Management represented that deferred revenue and accrued rebates were the main adjustments in arriving at adjusted average net working capital. Based on that description, these items appear to have been treated as the principal drivers of the difference between reported and adjusted working capital; however, the relative weighting of each item and the detailed adjustment logic remain unconfirmed pending line-item support.

On the information available, adjusted average net working capital of $5.1 million is the most supportable normalized reference point for purchase price discussions. The final target or peg should be confirmed against the detailed working capital schedule and underlying support for the deferred revenue and accrued rebate adjustments.

What changed / assumptions: Assumed the user wanted a concise, client-ready section rather than a full exhibit. Avoided assigning amounts to deferred revenue or accrued rebates because management identified them qualitatively, but no line-item support or quantified bridge was provided.
```

**Notes**

- Good weak-support discipline and appropriate restraint around unquantified adjustments.
- User feedback: looks good.

### QS-11

**Should trigger:** Yes

**Prompt**

Draft the executive summary, business overview, and reporting environment sections only for a software-enabled healthcare company. Facts: revenue is recurring subscription plus implementation fees, adjusted EBITDA is $27.4 million, net debt is modest, and monthly reporting is prepared from audited GL data. Do not draft QoE, NWC, or net debt.

**Verb / team:** `draft` + `section`

**Triggered:** Yes

**Result**

```text
Executive summary
[Company name] is a software-enabled healthcare company that generates revenue from recurring subscription fees and implementation services.
Based on the information provided, adjusted EBITDA is $27.4 million, supported by a revenue model with a recurring subscription component and a lower-volume implementation fee component.
Net debt appears modest on the current basis, which indicates a limited leverage burden relative to the reported earnings profile.
The reporting environment is established for diligence purposes, with monthly reporting prepared from audited general ledger data. This provides a consistent basis for monthly financial analysis, although the detail and review procedures supporting monthly reporting beyond the audited ledger were not separately described.

Business overview
[Company name] provides software-enabled solutions to healthcare customers, combining a recurring software offering with implementation services required to onboard or deploy the platform.
The business model appears to be primarily subscription-based, with recurring revenue generated over the customer contract term and implementation fees earned as new customers are launched or existing customers expand their use of the platform.
The recurring subscription component is the core revenue stream and likely represents the primary driver of revenue visibility, while implementation fees add project-based revenue linked to customer onboarding, configuration, or deployment activity.
The healthcare focus indicates that the Company operates in a customer environment where workflow continuity, service reliability, and implementation execution are likely important to customer retention and expansion; however, no additional detail was provided on end markets, customer types, or the transaction perimeter.
On the information provided, the business should be understood as a healthcare technology platform with a contracted recurring revenue base supplemented by non-recurring implementation activity.

Reporting environment
The Company prepares monthly financial reporting using audited general ledger data as the underlying source. This indicates that monthly reporting is based on a ledger foundation that has been subject to annual audit procedures, rather than being built solely from separate management schedules.
The use of audited general ledger data in the monthly reporting process provides a stronger basis for historical financial analysis than a fully off-system reporting process, as the monthly results appear to be derived from the same core accounting records used for statutory reporting.
No additional information was provided on the month-end close timeline, reporting systems, finance team structure, or key judgmental accounting areas. As a result, the reporting environment should be viewed as established at a general ledger level, with more detailed assessment of process maturity dependent on further information regarding close procedures, review controls, and reporting ownership.
On the current fact pattern, the reporting environment appears decision-useful for diligence purposes, with monthly reporting grounded in audited ledger data and no indicated disconnect between the accounting records and monthly management reporting.

What changed / assumptions: Drafted only the three requested sections and excluded QoE, NWC, and net debt analysis. Assumed a neutral section style without transaction-specific perimeter detail because no company name, reporting periods, customer mix, or legal entity scope was provided.
```

**Notes**

- Stayed within the requested sections and handled the sparse fact pattern reasonably.
- User feedback: okay given the limited information available.

### QS-12

**Should trigger:** No

**Prompt**

Update the business overview reference guidance so it better teaches when to discuss seller dependencies and transaction perimeter.

**Verb / team:** `non-trigger`

**Triggered:** No

**Result**

```text
I’m updating the business overview reference guidance directly in the skill so it gives clearer drafting cues around transaction perimeter and when seller dependencies belong in the section.
```

**Notes**

- Correctly treated as reference-maintenance work rather than FDD report drafting.
- Good non-trigger boundary behavior.

### QS-13

**Should trigger:** Yes

**Prompt**

Write a concise bridge note explaining why deferred revenue, customer deposits, and rent accrual true-ups were excluded from average working capital. Do not draft the full NWC section.

**Verb / team:** `draft` + `exhibit`

**Triggered:** Yes

**Result**

```text
Deferred revenue, customer deposits, and rent accrual true-ups were excluded from average working capital because they do not appear to reflect the recurring operating liquidity required to run the business on a go-forward basis. Deferred revenue and customer deposits represent customer prepayments that are driven by billing and cash collection timing rather than the underlying operating cost base, while rent accrual true-ups reflect period-end normalization of occupancy-related liabilities rather than a day-to-day working capital requirement. On this basis, these items were removed from the average working capital calculation to focus the analysis on the more representative operating asset and liability balances.

What changed / assumptions: Kept this as a bridge note only, not a full NWC section. Assumed the intended treatment was a definitional exclusion from average working capital rather than a quantified diligence adjustment, and avoided assigning amounts because none were provided.
```

**Notes**

- Stayed narrow as a bridge note and did not over-expand into a full NWC section.
- User feedback: looks good.

### QS-14

**Should trigger:** Yes

**Prompt**

Rewrite this reporting environment paragraph so it is client-ready: "Close is okay but kind of slow, ERP is Netsuite, rev rec changed, and the CFO checks reserves every month."

**Verb / team:** `rewrite` + `section`

**Triggered:** Yes

**Result**

```text
The Company’s reporting environment is established, although the monthly close process is somewhat extended relative to faster-cycle organizations. NetSuite serves as the core ERP. Revenue recognition policy changed during the period, which should be considered in evaluating period-over-period comparability for the affected revenue streams. Reserve balances are reviewed monthly by the CFO, indicating ongoing senior finance oversight over a key judgment area.

**What changed / assumptions**

Rewrote the paragraph in client-ready diligence language while preserving the original points. I kept the close-process comment measured because no specific close timeline or details on the revenue recognition change were provided.
```

**Notes**

- Clean rewrite behavior with good restraint.
- It improved tone and precision without turning the prompt into a full reporting environment section.

## Suggested Revision Themes

After this review round, the revision themes should be prioritized as follows:

### Priority 1: Critical structural issues

- `QoE section` vs. `adjustment bridge` distinction: the skill needs a clearer internal contract for when the user is asking for a full quality of earnings section versus when they are effectively asking for adjustment-bridge commentary. This is the clearest recurring miss in the current outputs.
- QoE default structure: when drafting a full QoE section, the section should begin with a standard lead-in sentence and then identify the relevant diligence adjustments as adjustments. The default pattern should not be `first / second / third adjustment` sequencing if a normal section was requested.
- Adjustment-led presentation: when an item is being presented as an adjustment, the skill should default to an adjustment label followed by explanation, rather than embedding the item inside generic bridge narration. This is especially important for QoE and net debt commentary.
- Adjustment formatting conventions: adjustment names should generally appear in bold and read like labeled subpoints, for example `**Transaction fees:**`, `**ERP migration costs:**`, `**Cash:**`, or `**Transaction bonus:**`, rather than appearing as plain-text inline phrases.

### Priority 2: Major section-formatting issues

- Section prose vs. bullet output: several section outputs still treat bullets as a default container even when the content is really narrative prose. The section contract should steer toward fuller prose by default and reserve bullets for cases where bullets are genuinely the better presentation format.
- Narrative grouping inside bullets: where bullets are appropriate, related points should be grouped into fewer, more substantive bullets rather than split into many single-sentence bullets that read like prose broken apart.
- Business overview section quality: business overview outputs were substantively strong, but the formatting should evolve toward grouped narrative treatment of perimeter, revenue model, footprint, and seller dependencies rather than an over-fragmented bullet list.
- Reporting environment section quality: reporting environment outputs were among the strongest results. Revisions here should focus less on substance and more on making sure strong process-sequencing content can be expressed in prose when prose is the better format.

### Priority 3: Artifact-shape and drafting-contract issues

- Scope control by artifact type: the distinction between `section`, `exhibit`, `rewrite`, `polish`, and `full_report outline` is mostly working, but the drafting contracts should be tightened so each path has a more distinctive output shape and does not drift into a neighboring artifact type.
- Rewrite vs. draft behavior: rewrite prompts should continue improving tone and precision without expanding into full sections, while draft prompts should synthesize the appropriate section structure rather than merely rephrasing the source facts.
- Canonical section templates: a practical revision path may be to clarify a small number of canonical output shapes for recurring artifacts such as QoE section, NWC section, net debt exhibit note, business overview section, and reporting environment section, with stronger defaults for headings, lead-ins, adjustment labels, and commentary order.

### Priority 4: Support-quality and analytical-discipline issues

- Working capital adjustment narrative structure: NWC sections and bridge notes should continue distinguishing definitional exclusions, normalization items, and unsupported management adjustments. Where support is thin, the language should stay precise about what is known versus what remains unconfirmed.
- Weak-source restraint: the skill handled sparse-input cases fairly well, but revisions should reinforce that missing line-item support should lead to explicit caveats, no fake precision, and no unnecessary expansion into conclusions that sound more supported than they are.

### Priority 5: Preserve and lightly refine strong behavior

- Net debt exhibit structure: the net debt drafting pattern is generally strong, but it should more consistently use the preferred exhibit structure of lead-in sentence, then line-item labels, then concise commentary. This is a refinement priority rather than a major correction.
- Cash-definition and bridge math discipline: net debt prompts need stronger internal guardrails around gross cash, restricted cash, available cash, deposits in transit, and debt-like items so that the schedule math and the narrative always reconcile cleanly. The current behavior is already strong and should be preserved while tightening consistency.
- Non-trigger boundary stability: the current boundary between report writing and reference-maintenance work is good and should be preserved. Revisions should avoid accidentally broadening the trigger behavior for meta-documentation or workflow-maintenance asks.

In short, the implementation order should be:

1. Fix the QoE section-vs-bridge distinction and default adjustment structure.
2. Reduce bullet overuse and improve grouped narrative formatting in full sections.
3. Tighten artifact-specific drafting contracts and canonical output shapes.
4. Preserve the current strengths in net debt math, exhibit boundary control, and non-trigger routing while refining consistency.
