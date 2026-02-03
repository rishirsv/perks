# Synthesis Verification Results

## Summary
- Overall grade: FAIL
- Checks passed: 4 / 7
- Critical issues:
  - Check 6: 6 / 11 industries fall below 70% bullet coverage (coverage as low as 24.3%), meaning large parts of the mined scope are missing from the synthesized library.
  - Check 3: Common `revenue_analysis` default bullets are heavily manufacturing/retail-oriented (e.g., “SKU”, raw materials, hedging, packaging), so they are not cross-industry safe.
  - Confidentiality risk: Multiple industry modules contain client-/engagement-specific proper nouns (e.g., “Zeno”, “Orion Group”, “Bird Construction”, brand names), which is risky if the library is used to generate client-facing deliverables.
- Recommendations:
  - Add `accounting_overview` and `commitments_and_contingencies` to the common skeleton (with de-identified, cross-industry default bullets).
  - Rewrite the common `revenue_analysis` defaults to be truly cross-industry; move industry-specific revenue bullets into industry modules.
  - Raise coverage for low-coverage industries to ≥70% by re-incorporating dropped bullets (or explicitly documenting intentional exclusions).
  - Sanitize/de-identify proper nouns in all bullets (Target/Company/Parent placeholders; remove “KPMG proprietary …”, brand/entity names, project names).

## Check 1: Common Skeleton Threshold

All 9 common skeleton sections meet the ≥8-of-11 threshold **as sections/headings present in the mining outputs (including mapped “variant” and “embedded” headings per `docs/mining/audit-mapping.md`)**. I also found two count inconsistencies in the mapping audit (details below).

- `business_overview`: **9 / 11** (absent in Construction and Real Estate)
  - Present as: `overview` / `summary_financials` (`docs/mining/eyecare.json`), `business_overview` (`docs/mining/healthcare.json`), `overview` (`docs/mining/hvac.json`, `docs/mining/manufacturing.json`, `docs/mining/prof-services.json`, `docs/mining/transportation.json`), `general` (`docs/mining/service.json`), `financial_overview` (`docs/mining/supermarket.json`), `business_understanding` + `business_overview` (`docs/mining/tech.json`).
- `quality_of_earnings`: **11 / 11**
  - Present as: `quality_of_earnings` (many), plus variants such as `quality_of_earnings_analysis` (`docs/mining/healthcare.json`) and `quality_sustainability_of_earnings` (`docs/mining/transportation.json`), and NOI-based analogue in Real Estate (`docs/mining/real-estate.json`).
- `revenue_analysis`: **9 / 11** (absent in Eyecare and Real Estate)
  - Present as variants like `sales_and_margin_trends` (`docs/mining/construction.json`), `quality_of_revenue` (`docs/mining/tech.json`), and “supporting analysis” in Supermarket (`docs/mining/supermarket.json`).
- `operating_expenses`: **11 / 11**
  - Present as variants like `cost_structure` (`docs/mining/service.json`) and `profitability_drivers` (`docs/mining/tech.json`).
- `working_capital`: **11 / 11**
  - Includes Real Estate via `balance_sheet` (`docs/mining/real-estate.json`) and Tech via `net_working_capital` (`docs/mining/tech.json`).
- `accounts_receivable`: **10 / 11** (missing only in Supermarket as a standalone section)
  - Present directly or embedded (e.g., `balance_sheet` in Real Estate contains an “Accounts receivable:” bullet; `docs/mining/real-estate.json`).
  - Mapping audit claims **9 / 11**; based on the mining files and the audit’s own “indirect” mappings, the count is **10 / 11** (all except Supermarket).
- `accounts_payable_and_accrued_liabilities`: **10 / 11** (missing only in Supermarket as a standalone section)
  - Present directly or embedded (e.g., Real Estate `balance_sheet` includes “Accounts payable and accrued liabilities:” bullets; `docs/mining/real-estate.json`).
  - Mapping audit claims **9 / 11**; based on the mining files and the audit’s own “indirect” mappings, the count is **10 / 11** (all except Supermarket).
- `capital_expenditure_requirements`: **10 / 11** (Tech has no standalone capex section)
- `net_debt`: **11 / 11**

## Check 2: Missing Common Candidates

The audit claims:
- Accounting overview: **10 / 11** (all except Eyecare)
- Commitments & contingencies: **9 / 11**

After checking the raw mining JSONs, I **cannot confirm these exact counts** under any consistent “section heading” definition; however, I **do** confirm both topics appear in **≥8 industries** (in fact, in practice they appear in almost all industries, often embedded within other sections).

### Accounting overview

Two ways to count this, depending on whether you require a standalone section heading:

- **Standalone accounting-related section headings:** **7 / 11**
  - Present as explicit sections like `accounting_overview`, `consistency_of_accounting_policies`, `financial_statement_accounting_overview`, or `financial_reporting_environment` in:
    - Construction (`docs/mining/construction.json`: `accounting_overview`, `accounting_comparison_ifrs_vs_aspe`)
    - Healthcare (`docs/mining/healthcare.json`: `financial_reporting_and_accounting_policies`, `targets_accounting_profile`)
    - HVAC (`docs/mining/hvac.json`: `financial_statement_accounting_overview`, `consistency_of_accounting_policies`)
    - Manufacturing (`docs/mining/manufacturing.json`: `consistency_of_accounting_policies`)
    - Real Estate (`docs/mining/real-estate.json`: `accounting_overview`)
    - Tech (`docs/mining/tech.json`: `financial_reporting_environment`, `phase_1_gaap_considerations`)
    - Transportation (`docs/mining/transportation.json`: `consistency_of_accounting_policies`)
- **Accounting overview topic appears in bullets (even if embedded in “overview/general”):** **11 / 11**
  - Example in Eyecare (contradicts audit’s “except Eyecare”): `docs/mining/eyecare.json` → `overview` includes “Read Target's financial statements … gain an understanding of Target's accounting policies and practices …”.

**Recommendation:** Add a dedicated common skeleton section `accounting_overview` and populate `default_bullets` with de-identified, cross-industry bullets sourced from the 7 industries that have standalone accounting sections, plus the “embedded” bullets from overview/general sections in the remaining industries.

### Commitments & contingencies

Again, two ways to count:

- **Standalone commitments/contingencies section headings:** **6 / 11**
  - Present as explicit sections in: Construction, Eyecare, Healthcare, HVAC, Manufacturing, Transportation (`docs/mining/{industry}.json` includes `commitments_*` normalized headings).
- **Commitments/contingencies topic appears in bullets (embedded elsewhere):** effectively **11 / 11**
  - Example embeddings:
    - Service: `docs/mining/service.json` → `net_debt_debt_like_items` includes bullet “Commitment and contingencies.”
    - Supermarket: `docs/mining/supermarket.json` → `net_debt_and_other_liabilities` includes “Other purchase commitments (operating leases) and contingencies (legal matters).”
    - Tech: `docs/mining/tech.json` → `stratified_balance_sheet_and_net_debt` includes “contingent liabilities … other obligations … committed capex …”.
    - Real Estate: `docs/mining/real-estate.json` → `balance_sheet` includes “Significant lease and purchase obligations.”

**Recommendation:** Add a dedicated common skeleton section `commitments_and_contingencies` (and remove the placeholder “Commitment and contingencies.” bullet from the common `net_debt` defaults, or replace it with a reference to the new section).

## Check 3: Default Bullet Quality

I checked each common skeleton section’s `default_bullets` in `reference/fdd_scope_library.json` for (a) cross-industry genericity, (b) completeness, and (c) provenance (verbatim match vs mining outputs). All defaults **do** appear verbatim in at least one mining output (0 “not found” defaults).

- `business_overview`: PASS
  - Generic and usable across industries. Example bullet: “Finance function, financial reporting framework and internal control environment.” appears in multiple mining outputs (e.g., `docs/mining/transportation.json` → `overview`).
- `quality_of_earnings`: PASS
  - Generic and reasonably complete. Bullets appear verbatim across multiple mining outputs.
- `revenue_analysis`: FAIL (not cross-industry generic)
  - Multiple default bullets are clearly manufacturing/retail specific and should not be in a cross-industry common skeleton:
    - “Revenue and margin trends by customer, program, SKU, and product category:” (`reference/fdd_scope_library.json` → common `revenue_analysis`) originates from Manufacturing (`docs/mining/manufacturing.json` → `revenue_and_margin_trends`).
    - “Breakdown of costs of goods sold including: materials, scrap/waste, labour expense, manufacturing overhead, packing and outbound freight for product sales; and” (same location) originates from Manufacturing.
    - “Raw material costs including hedging programs … embedded inventory gains and/or losses;” (same location) is not appropriate for most services/tech/professional services engagements.
  - Completeness is also uneven: it over-indexes on product COGS mechanics and under-represents services/SaaS revenue drivers (which are pushed into industry modules like Tech’s `arr_drivers`).
- `operating_expenses`: PASS WITH ISSUES
  - Generally generic, but includes items like “Repairs and maintenance expense” which may be irrelevant for asset-light models.
- `working_capital`: PASS
- `accounts_receivable`: PASS
- `accounts_payable_and_accrued_liabilities`: PASS WITH ISSUES
  - Includes “customer deposits”, which is not universal (fine as optional wording).
- `capital_expenditure_requirements`: PASS
- `net_debt`: FAIL (incomplete / points to missing section)
  - Default includes “Commitment and contingencies.” (`reference/fdd_scope_library.json` → common `net_debt`). This is too thin to stand alone and strongly indicates the missing common candidate section should exist.

## Check 4: Industry Module Completeness

Deep-dive industries: Healthcare, Tech, Construction.

### Healthcare
- Verbatim/source integrity spot-check: PASS
  - `reference/fdd_scope_library.json` → `industry_modules.healthcare.waterfall_revenue_analysis` includes bullet “If available, obtain patient/encounter-level detail … claims-level revenue analysis …”; this matches verbatim in `docs/mining/healthcare.json` → `waterfall_revenue_analysis` (source: “Project Academy - Draft SOW (2025.04.21)vS.json”).
  - `reference/fdd_scope_library.json` → `industry_modules.healthcare.store_portfolio_analysis` matches verbatim in `docs/mining/healthcare.json` → `store_portfolio_analysis`.
- Industry-specificity: PASS WITH ISSUES
  - Some module sections mix industry-specific bullets with generic bullets that already exist (or should exist) in the common skeleton. Example:
    - `reference/fdd_scope_library.json` → `industry_modules.healthcare.accounts_receivable` contains healthcare-specific bullets like “Aging analysis by center by payor;” but also generic AR bullets like “Trade and non-trade balances;” and “Allowance for uncollectible accounts and write-offs; and” which overlap with the common AR defaults.
- Confidentiality/proper noun risk: FAIL
  - Healthcare module contains highly specific brand/entity references and “KPMG proprietary” tooling language, e.g.:
    - `reference/fdd_scope_library.json` → `industry_modules.healthcare.revenue_analysis` includes “Leveraging KPMG's proprietary SPI … (Rexall … Well.ca …)” and partner/platform brand names. This is sourced from mining, but it is not safe to reuse in generated client deliverables.

### Tech
- Verbatim/source integrity spot-check: PASS
  - `reference/fdd_scope_library.json` → `industry_modules.tech.arr_drivers` (ARR/churn/cohorts bullets) matches `docs/mining/tech.json` → `arr_drivers`.
  - `reference/fdd_scope_library.json` → `industry_modules.tech.phase_1_gaap_considerations` matches `docs/mining/tech.json` → `phase_1_gaap_considerations`.
- Industry-specificity: PASS
  - ARR/churn, deferred revenue days, etc. are appropriately tech/SaaS-specific and do not belong in the common skeleton.
- Confidentiality/proper noun risk: FAIL
  - Tech module includes engagement-specific names (should be de-identified), e.g.:
    - `reference/fdd_scope_library.json` → `industry_modules.tech.accounting_overview` includes “Present the income statement and balance sheet of Zeno …” and multiple references to “Orion Group”.

### Construction
- Verbatim/source integrity spot-check: PASS
  - `reference/fdd_scope_library.json` → `industry_modules.construction.accounting_comparison_ifrs_vs_aspe` matches `docs/mining/construction.json` → `accounting_comparison_ifrs_vs_aspe` verbatim.
  - `reference/fdd_scope_library.json` → `industry_modules.construction.prepaid_materials_and_other_assets` matches `docs/mining/construction.json` → `prepaid_materials_and_other_assets`.
- Industry-specificity: PASS
  - “IFRS vs ASPE” and “prepaid materials” are construction-relevant and appropriately sit outside the common skeleton.
- Confidentiality/proper noun risk: FAIL
  - Construction module includes client-specific references, e.g.:
    - `reference/fdd_scope_library.json` → `industry_modules.construction.accounting_comparison_ifrs_vs_aspe` includes “Bird Construction”.

## Check 5: Bullet Verbatim Integrity

Method: I sampled 10 bullets from the synthesized library using a fixed random seed (`20260130`) and verified each bullet exists **verbatim** in at least one raw mining file.

Result: **PASS** — in this sample, no bullets appeared paraphrased or rewritten (so no side-by-side diffs are needed).

| # | Library location | Bullet text | Source mining file | Source section | Source doc |
|---:|---|---|---|---|---|
| 1 | `industry_modules.tech` → `locked_box` | Consider the locked box analysis provided by the seller, and consider a potential buy-side position. To consider: | `docs/mining/tech.json` | `locked_box` | Project Vortex - scope.json |
| 2 | `industry_modules.tech` → `supporting_analysis_to_quality_of_earnings` | Trends in other relevant KPIs tracked by management; and | `docs/mining/tech.json` | `supporting_analysis_to_quality_of_earnings` | Project Zeno - scope.json |
| 3 | `industry_modules.manufacturing` → `commitments_and_contingencies` | Other off-balance sheet transactions. | `docs/mining/manufacturing.json` | `commitments_and_contingencies` | Project Diamond - Draft SOW (02-Jul-24) vSENT.json |
| 4 | `industry_modules.healthcare` → `commitments_and_contingencies` | Leases; | `docs/mining/healthcare.json` | `commitment_and_contingencies` | Project Academy - Draft SOW (2025.04.21)vS.json |
| 5 | `industry_modules.healthcare` → `revenue_analysis` | Center-level expense trends; | `docs/mining/healthcare.json` | `revenue_and_profitability` | Project Academy - Draft SOW (2025.04.21)vS.json |
| 6 | `industry_modules.transportation` → `capital_expenditure_requirements` | Historical replacement cycle and costs; | `docs/mining/transportation.json` | `capital_expenditure_and_fixed_assets` |  |
| 7 | `common_skeleton` → `operating_expenses` | Obtain and read an analysis of Target’s expenses and inquire about: | `docs/mining/construction.json` | `cost_of_sales_and_operating_costs` |  |
| 8 | `industry_modules.real_estate` → `operating_expenses` | Primary components of property operating costs, property tax expenses; | `docs/mining/real-estate.json` | `operating_expenses` |  |
| 9 | `industry_modules.hvac` → `operations_performance_da` | Analyze employee census by role, position, annual salary, and bonus; where appropriate (e.g., technicians, sales people) tie back to revenue / margin performance to understand returns (e.g., salary vs sales or utilization multiples) and other associated metrics (e.g., revenue per tech, utilization, margin by tech, etc.) | `docs/mining/hvac.json` | `operations_performance_da` | KPMG Financial Due Diligence Scope of Work - Aug 8.json |
| 10 | `industry_modules.prof_services` → `revenue_analysis` | Key performance indicators (proposal win-rates, personnel availability/utilization rates, billing rates) | `docs/mining/prof-services.json` | `revenue_revenue_recognition_and_margins` | Project DGA_KPMG DRAFT EL_June 2022.json |

Note: Several mining outputs store bullets as plain strings (no `source` field), so some bullets can only be traced to `docs/mining/{industry}.json` (not to a specific underlying SOW file) in this repo.

## Check 6: Coverage Gaps

Definition used: For each industry, I counted **unique** bullet strings in the mining output (`docs/mining/{industry}.json`) and computed what % appear in the synthesized library when taking the union of:
- all common skeleton `default_bullets`, plus
- that industry’s module bullets (`reference/fdd_scope_library.json` → `industry_modules.{industry_slug}`)

Result: **FAIL** — 6 / 11 industries are below 70% coverage.

| Industry | Unique mined bullets | Bullets found in library | Coverage % | Status |
|---|---:|---:|---:|---|
| construction | 65 | 57 | 87.7% | PASS |
| eyecare | 56 | 21 | 37.5% | **FAIL** |
| healthcare | 160 | 123 | 76.9% | PASS |
| hvac | 182 | 110 | 60.4% | **FAIL** |
| manufacturing | 236 | 117 | 49.6% | **FAIL** |
| prof-services | 70 | 17 | 24.3% | **FAIL** |
| real-estate | 41 | 41 | 100.0% | PASS |
| service | 38 | 20 | 52.6% | **FAIL** |
| supermarket | 60 | 32 | 53.3% | **FAIL** |
| tech | 110 | 92 | 83.6% | PASS |
| transportation | 72 | 58 | 80.6% | PASS |

Illustrative examples of dropped (uncovered) bullets contributing to low coverage:
- Eyecare: `docs/mining/eyecare.json` → `quality_of_earnings` includes multiple bullets not present in the library, e.g. “Leveraging Target commissioned Sell-side Due Diligence Report … physician compensation …” (not found anywhere in `reference/fdd_scope_library.json`).
- Prof. Services: `docs/mining/prof-services.json` → `overview` includes “Significant accounting estimates including percentage of completion (“POC”) revenue; …” (not found anywhere in `reference/fdd_scope_library.json`).

## Check 7: Structural Consistency

Result: **PASS**

Validated in `reference/fdd_scope_library.json`:
- Every `common_skeleton` entry has `heading`, `normalized_heading`, and `default_bullets`.
- `industry_modules` is an object; each industry key is snake_case and maps to an object of `normalized_heading` → array-of-string bullets.
- No structural type violations found (no non-string bullets; no non-array bullet lists).
- No duplicate normalized headings can exist within a single industry module due to JSON object key uniqueness; no evidence of key collisions.

## Recommended Actions

1. Add `accounting_overview` to the common skeleton:
   - Create `common_skeleton` entry with generic bullets (finance function, reporting framework, key accounting policies, consistency/change in policies, GAAP/IFRS/ASPE considerations), all sourced verbatim from existing mining bullets but de-identified.
2. Add `commitments_and_contingencies` to the common skeleton:
   - Move/replace the `net_debt` default bullet “Commitment and contingencies.” with a pointer to the new section, and add a proper commitments/contingencies procedure list (leases, litigation, environmental, guarantees, purchase obligations, off-balance-sheet items).
3. Replace the common `revenue_analysis` defaults with a cross-industry baseline:
   - Keep: revenue trends by customer/segment/channel/region, concentration, price-volume-mix, seasonality, non-recurring revenue, revenue recognition considerations.
   - Move out of common defaults into relevant industry modules: SKU-level analyses, COGS breakdowns, raw material hedging/inventory gains, packaging/ingredients specifics.
4. Fix coverage gaps (target ≥70% for every industry):
   - For each failing industry, re-add missing bullets either to (a) the industry module under normalized headings, or (b) to the common skeleton if generic.
   - If exclusions are intentional (e.g., removing “sell-side only” steps), document the exclusion rules explicitly in `reference/CHANGELOG.md` or synthesis metadata.
5. De-identify and neutralize all bullets:
   - Replace project names/entities/brands and advisor names (e.g., “Zeno”, “Orion Group”, “Bird Construction”, “Rexall”, “KPMG proprietary …”) with placeholders (“Target”, “Parent”, “Seller”, “Advisor tool (if applicable)”) so the library is safe for reuse.

