# Deletion and Optional Tracker

Purpose: keep a single log of scope items removed from default flow, so they can be treated as optional add-ons instead of being lost.

## Essential Default Rule (v1)

For default scope, keep items that are required in most deals:

1. Business overview essentials:
- operating model and what the business does
- org structure and reporting lines
- basis of financial information

2. Accounting overview essentials:
- key accounting policies
- key estimates/judgment areas
- consistency across periods
- related party/intercompany considerations

3. Industry specifics stay default only when they add clear industry signal.

Move to optional when items are:
- engagement framing (deliverable format, period coverage notes)
- highly deal-specific one-offs
- useful but not universally required

## Status definitions

- `REMOVED_DEFAULT`: no longer included by default output
- `OPTIONAL_CANDIDATE`: keep text in optional library for user add-on
- `PENDING_REVIEW_DELETE`: marked `ACTION_DELETE` in review docs, not yet removed from canonical library
- `REMOVED_CANONICAL`: removed from `dist/scope-library.json`

## Tracker

| Scope ID | Path | Short text | Current status | Recommended disposition | Notes |
|---|---|---|---|---|---|
| `scope.047` | `eyecare.business_overview.scope.047` | Read financials / accounting policies intro | `REMOVED_CANONICAL` | `OPTIONAL_CANDIDATE` | Removed due to overlap with common business/accounting overview. |
| `scope.048` | `eyecare.business_overview.scope.048` | Read financials / performance and accounting intro | `REMOVED_CANONICAL` | `OPTIONAL_CANDIDATE` | Removed due to overlap with common business/accounting overview. |
| `scope.017` | `construction.financial_due_diligence.scope.017` | Deliverable format statement | `REMOVED_DEFAULT` | `OPTIONAL_CANDIDATE` | Removed from construction default output; keep as optional framing add-on. |
| `scope.018` | `construction.financial_due_diligence.scope.018` | Time-period coverage framing | `REMOVED_DEFAULT` | `OPTIONAL_CANDIDATE` | Removed from construction default output; useful in selected situations. |
| `scope.021` | `construction.quality_of_earnings.scope.021` | Incentive compensation, dis-synergies/synergies | `REMOVED_DEFAULT` | `OPTIONAL_CANDIDATE` | Removed from construction default output; can be added when transaction thesis needs it. |
| `scope.022` | `construction.quality_of_earnings.scope.022` | JV dredging impact | `REMOVED_DEFAULT` | `OPTIONAL_CANDIDATE` | Removed from construction default output; specialized topic kept optional. |

## User Exclusion Batch A (Applied)

Requested action: exclude from reusable library (hard delete or rewrite before reuse).

Total applied in this batch: **25** bullets.

| Scope ID | Path | Short text | Current status | Recommended disposition | Notes |
|---|---|---|---|---|---|
| `scope.003` | `common.accounting_overview.scope.003` | Analyze the accounting policies as disclosed in the audited financial statements and perform... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Parent/jurisdiction-specific IFRS framing. |
| `scope.046` | `construction.accounting_overview.scope.046` | Understand and summarize the financial statement preparation process, including: | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Engagement pricing/fee + Parent-specific GAAP framing. |
| `scope.049` | `eyecare.quality_of_earnings.scope.049` | Summarize potential adjustments identified regarding the profit and loss performance of Targ... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.083` | `healthcare.quality_of_earnings.scope.083` | Read and comment on the adjusted EBITDA prepared by Target and its sell-side advisors, and: | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side advisor framing in reusable baseline. |
| `scope.084` | `healthcare.quality_of_earnings.scope.084` | Propose any additional potential adjustments to historical earnings before interest, taxes,... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side advisor framing in reusable baseline. |
| `scope.123` | `hvac.quality_of_earnings.scope.123` | Based on the analysis and discussion with the sell-side due diligence advisor, comment on Ma... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side advisor framing in reusable baseline. |
| `scope.124` | `hvac.quality_of_earnings.scope.124` | Perform a traffic light assessment of Management and sell-side proposed adjustments; | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.125` | `hvac.quality_of_earnings.scope.125` | Propose any significant adjustments identified that are not reflected in the sell-side Quali... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.138` | `hvac.quality_of_earnings.scope.138` | Quality of earnings – To the extent not covered by the sell-side due diligence report. Asses... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side/report-rollforward framing in reusable baseline. |
| `scope.225` | `manufacturing.quality_of_earnings.scope.225` | Based on the analysis and discussion with the sell-side due diligence advisor, comment on Ma... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side advisor framing in reusable baseline. |
| `scope.226` | `manufacturing.quality_of_earnings.scope.226` | Perform a traffic light assessment of Management and sell-side proposed adjustments; and | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.227` | `manufacturing.quality_of_earnings.scope.227` | Propose any significant adjustments identified that are not reflected in the sell-side Quali... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.229` | `manufacturing.quality_of_earnings.scope.229` | Summarize potential adjustments identified regarding the earnings of Target in the form of a... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | VDD/sell-side framing in reusable baseline. |
| `scope.357` | `supermarket.business_overview.scope.357` | Summarize and comment on the key Target’s accounting processes: | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | US GAAP vs IFRS-specific framing; needs gating. |
| `scope.360` | `supermarket.quality_of_earnings.scope.360` | Summarize potential adjustments identified regarding the profit and loss performance of Targ... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.394` | `tech.accounting_overview.scope.394` | Using analysis performed by you, and discussions with you and Target: | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("by you"). |
| `scope.398` | `tech.accounting_overview.scope.398` | Review a reconciliation of trial balance information to internal and external financial stat... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("to be performed by you"). |
| `scope.399` | `tech.accounting_overview.scope.399` | Review a reconciliation of net income and net assets period-over-period (to be performed by... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("to be performed by you"). |
| `scope.405` | `tech.quality_of_earnings.scope.405` | Consider the quality of earnings analysis prepared by the sell side. Form a view on seller p... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Sell-side framing in reusable baseline. |
| `scope.410` | `tech.quality_of_earnings.scope.410` | Using analysis performed by you, and discussions with you and Target: | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("analysis performed by you"). |
| `scope.411` | `tech.quality_of_earnings.scope.411` | Discuss whether additional EBITDA adjustments might be considered, in addition to those alre... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("your analysis"). |
| `scope.414` | `tech.quality_of_earnings.scope.414` | Review a reconciliation of employee costs included in adjusted EBITDA to the planned go-forw... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("to be performed by you"). |
| `scope.415` | `tech.quality_of_earnings.scope.415` | * The quality of earnings analysis will consider the allocated costs included in the reporte... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("reviewed by you"). |
| `scope.416` | `tech.quality_of_earnings.scope.416` | We will flag in our report if, in the course of our analysis and discussion with Target, the... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("prepared by you"). |
| `scope.418` | `tech.supporting_analysis_to_quality_of_earnings.scope.418` | Consider the following analysis, to be performed by you, and consider the impact on the qual... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Client-performed work framing ("to be performed by you"). |

## User Exclusion Batch B (Applied)

Category: Transaction Support and Reporting

Requested action: exclude from reusable core library (hard delete or rewrite before reuse).

Total applied in this batch: **5** bullets.

| Scope ID | Path | Short text | Current status | Recommended disposition | Notes |
|---|---|---|---|---|---|
| `scope.111` | `healthcare.assistance_with_transaction_documentation.scope.111` | Assist with relevant asset purchase agreement financial definitions (e.g. net working capita... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Transaction documentation support is deal-specific; purchase agreement definition framing. |
| `scope.110` | `healthcare.purchase_and_sale_agreement.scope.110` | Read available draft of the Purchase and Sale Agreement and offer commentary to you and your... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Transaction legal-document support is deal-specific; purchase-and-sale-agreement attorney framing. |
| `scope.214` | `hvac.optional_fdd_procedures.scope.214` | Review purchase agreement and all relevant definitions (e.g. NWC, debt-like items definition... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Explicitly optional procedure; purchase agreement legal-document support framing. |
| `scope.212` | `hvac.phase_2_post_bid_support.scope.212` | Participate in buyer diligence calls | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Post-bid/phase-2 support is engagement-specific; buyer diligence call framing. |
| `scope.213` | `hvac.phase_2_post_bid_support.scope.213` | Read and provide feedback to management with respect to their responses to potential Buyer (... | `REMOVED_CANONICAL` | `EXCLUDE_REUSABLE_OR_REWRITE` | Post-bid/phase-2 support is engagement-specific; potential buyer inquiry framing. |

## Workflow

1. Reviewer marks items in `docs/Scope Review/01-07`.
2. Approved removals get logged here first.
3. For each removal, choose:
- `OPTIONAL_CANDIDATE` (preserve text in optional set), or
- full exclusion from reusable library.
4. Apply canonical edits in `dist/scope-library.json`.
5. Regenerate review pack and exports.
