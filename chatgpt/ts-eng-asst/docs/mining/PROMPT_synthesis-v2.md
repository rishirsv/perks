# Synthesis Prompt v2: FDD Scope Library

## Role

You are a Financial Due Diligence (FDD) scope librarian. Your job is to merge 11 industry mining outputs into a single unified scope library.

## Context

11 industry mining agents have each produced a structured JSON catalog (`docs/mining/*.json`) containing FDD scope sections and bullets extracted verbatim from real SOW documents. Your job is to synthesize these into a unified library at `reference/fdd_scope_library.json`.

A previous synthesis attempt failed verification on 3 of 7 checks. This prompt includes explicit rules to prevent those failures.

## Input Files

Read ALL of these before producing any output:

- `docs/mining/construction.json`
- `docs/mining/eyecare.json`
- `docs/mining/healthcare.json`
- `docs/mining/hvac.json`
- `docs/mining/manufacturing.json`
- `docs/mining/prof-services.json`
- `docs/mining/real-estate.json`
- `docs/mining/service.json`
- `docs/mining/supermarket.json`
- `docs/mining/tech.json`
- `docs/mining/transportation.json`

Also read the previous audit results for context on what went wrong:
- `docs/mining/audit-verification-results.md`
- `docs/mining/audit-mapping.md`

## Output

Write to: `reference/fdd_scope_library.json`

## Output Schema

```json
{
  "common_skeleton": [
    {
      "heading": "Human-readable heading",
      "normalized_heading": "snake_case_key",
      "default_bullets": ["bullet 1", "bullet 2"]
    }
  ],
  "industry_modules": {
    "construction": {
      "normalized_heading_1": ["industry-specific bullet", "..."],
      "normalized_heading_2": ["..."]
    }
  },
  "metadata": {
    "industries_analyzed": 11,
    "common_threshold": "8 of 11",
    "total_sections_found": 0,
    "total_bullets_cataloged": 0
  }
}
```

## Rules

### RULE 1: Common skeleton must include 11 sections (not 9)

The previous attempt only included 9 common sections. The audit confirmed two additional sections exceed the 8-of-11 threshold:

| Section | Frequency | Must include? |
|---|---|---|
| Business overview | 9/11 | YES |
| Quality of earnings | 11/11 | YES |
| Revenue analysis | 9/11 | YES |
| Operating expenses | 11/11 | YES |
| Working capital | 11/11 | YES |
| Accounts receivable | 10/11 | YES |
| AP and accrued liabilities | 10/11 | YES |
| Capital expenditure requirements | 10/11 | YES |
| Net debt | 11/11 | YES |
| **Accounting overview** | **10/11** | **YES — was missing** |
| **Commitments and contingencies** | **9/11** | **YES — was missing** |

For accounting_overview, source generic default bullets from the mining files covering: finance function, reporting framework, significant accounting policies, recent/contemplated changes in accounting principles, significant estimates, intercompany/related party transactions.

For commitments_and_contingencies, source generic default bullets covering: pending/threatened litigation, lease obligations, purchase commitments, employee benefit obligations, off-balance sheet transactions. Also REMOVE the placeholder bullet "Commitment and contingencies." from the net_debt section.

### RULE 2: Revenue analysis defaults must be cross-industry

The previous attempt stuffed manufacturing/retail-specific bullets into the common revenue_analysis defaults (e.g., "SKU", "raw materials", "hedging programs", "scrap/waste", "packaging materials"). These are NOT cross-industry.

The common revenue_analysis default_bullets MUST be generic enough for ALL industries (including tech, professional services, healthcare, real estate). Use bullets like:

- Revenue trends by customer, segment, and geography
- Revenue concentration analysis
- Price versus volume analysis
- Seasonality and monthly trends
- Non-recurring components of revenue
- Revenue recognition policies and practices
- Gross-to-net revenue bridge (if applicable)
- Margin analysis by key dimension

Move any industry-specific revenue bullets (SKU, COGS breakdowns, raw material hedging, ARR, payor mix, tonnage, etc.) into the relevant industry_modules.

### RULE 3: Coverage must be ≥70% for every industry

The previous attempt dropped large numbers of bullets — 6 industries fell below 70% coverage:

| Industry | Previous coverage |
|---|---|
| Eyecare | 37.5% |
| Prof. Services | 24.3% |
| Manufacturing | 49.6% |
| Service | 52.6% |
| Supermarket | 53.3% |
| HVAC | 60.4% |

**Every bullet from every mining output must appear SOMEWHERE in the library** — either in common_skeleton.default_bullets or in industry_modules.{industry}.{section}. The only acceptable reason to exclude a bullet is if it is a duplicate of another bullet already included (same text, same meaning).

To achieve this:
1. Start by collecting ALL bullets from ALL mining files
2. Assign each bullet to either common_skeleton or industry_modules
3. Verify no bullets were dropped

### RULE 4: De-identify all proper nouns

The previous attempt included client names, project names, brand names, and advisor-specific language. This is a confidentiality risk.

Search for and replace the following patterns across ALL bullets:

| Find | Replace with |
|---|---|
| Specific company/entity names (e.g., "Zeno", "Orion Group", "Bird Construction", "Rexall", "Well.ca", "DAVIDsTea", "Staples", "Doordash", "Uber Eats", "Haley", "A.B. May", "Korte", "C&C Horizon Contracting Ltd.", "McKesson", "Clio", "Redstone", "Le Bon", "Tasty Selection", "Imperial", "Cowen") | "Target" or remove the reference entirely |
| "KPMG's proprietary SPI" or "KPMG proprietary" | "proprietary analytics tool" or remove |
| "Bird Construction Inc." | "Parent" |
| "PwC" / "EY" | "sell-side advisor" |
| Specific brand lists (e.g., "Rexall - Chronic, Acute, Services, Specialty, etc.; Well.ca – Food & Snacks, Vitamins, Beauty, etc.") | Generic description: "by brand and sub-category" |
| Project code names (e.g., "Project Vortex", "Project Zeno") | Remove |
| Specific fiscal years that are engagement-specific (e.g., "FY22", "FY24 budget") | Use generic placeholders: "the Historical Period", "the most recent fiscal year", "the forecast period" |
| "BeWell loyalty programs" | "loyalty programs" |
| Specific geographic references tied to a client (e.g., "GTA, Cambridge, London, Barrie") | "by geography" |

**IMPORTANT**: De-identify the text but preserve the analytical instruction. "Analyze revenue by brand (Rexall, Kit, Nosh & Co)" becomes "Analyze revenue by brand". Do NOT delete the entire bullet — just remove the identifying details.

### RULE 5: No duplicate bullets within a section

When multiple mining files contribute bullets to the same section, deduplicate. If two bullets say the same thing in slightly different words, keep the more complete version. Do NOT include both.

### RULE 6: Industry module keys must use consistent slugs

Use these exact keys for industry_modules:

- `construction`
- `eyecare`
- `healthcare`
- `hvac`
- `manufacturing`
- `prof_services`
- `real_estate`
- `service`
- `supermarket`
- `tech`
- `transportation`

### RULE 7: Section heading normalization

When mining outputs use different heading names for the same concept, map them to the canonical normalized_heading. Use this reference:

| Canonical | Variants to group |
|---|---|
| `business_overview` | `overview`, `general`, `financial_overview`, `business_understanding`, `summary_financials` |
| `quality_of_earnings` | `quality_of_earnings_analysis`, `quality_sustainability_of_earnings`, `sell_side_quality_of_earnings_assessment`, `sell_side_qoe_assessment`, `sustainability_of_net_operating_income_on_a_consolidated_basis` |
| `revenue_analysis` | `sales_and_margin_trends`, `revenue_and_profitability`, `revenue_and_margin_analysis`, `revenue_and_profitability_analysis`, `revenue_and_gross_margin_analysis`, `revenue_and_margin_trends`, `revenue_value_add_contribution_margin`, `revenue_revenue_recognition_and_margins`, `quality_of_revenue`, `revenue_and_profitability_trends` |
| `operating_expenses` | `cost_of_sales_and_operating_costs`, `cost_of_revenue_and_corporate_expenses`, `direct_and_operating_expenses`, `expenses`, `operating_expenses_and_sga`, `sga_expenses`, `cost_structure`, `cost_of_revenues_and_operating_expenses`, `profitability_drivers` |
| `working_capital` | `working_capital_analysis`, `net_working_capital` |
| `accounts_receivable` | `trade_and_other_receivables`, `accounts_receivable_analysis`, `receivables` |
| `accounts_payable_and_accrued_liabilities` | `trade_and_other_payables_and_accrued_liabilities`, `accounts_payable_and_accrued_liabilities_analysis`, `accounts_payable_accrued_liabilities_and_other_current_liabilities`, `accounts_payables_and_accrued_liabilities`, `accounts_payable_accrued_liabilities_and_other_liabilities` |
| `capital_expenditure_requirements` | `capital_expenditure`, `capital_expenditures`, `capital_expenditures_and_fixed_assets`, `capital_expenditure_and_fixed_assets`, `fixed_asset_equipment_and_vehicles` |
| `net_debt` | `net_debt_debt_like_items`, `net_debt_and_other_assets_liabilities`, `net_debt_and_other_liabilities`, `stratified_balance_sheet_and_net_debt` |
| `accounting_overview` | `financial_statement_accounting_overview`, `consistency_of_accounting_policies`, `financial_reporting_and_accounting_policies`, `targets_accounting_profile`, `financial_reporting_environment`, `accounting_comparison_ifrs_vs_aspe` |
| `commitments_and_contingencies` | `commitment_and_contingencies`, `commitments_and_contingent_liabilities` |

Any heading NOT in this table keeps its original normalized_heading and goes into the relevant industry module.

### RULE 8: Verbatim integrity (with de-identification)

Copy all bullet text verbatim from the mining outputs. The ONLY modifications allowed are:
- De-identification (Rule 4)
- Deduplication (Rule 5)
- No other rewording, summarizing, or paraphrasing

### RULE 9: Update metadata

After building the library, count and set:
- `total_sections_found`: number of unique normalized_heading values across all common + industry modules
- `total_bullets_cataloged`: total number of bullet strings across all common + industry modules

## Verification

After writing the library, self-check:
1. Common skeleton has exactly 11 sections
2. Every industry_modules key is present (11 industries)
3. No proper nouns from Rule 4 remain in any bullet
4. Net debt section does NOT contain "Commitment and contingencies." as a bullet
5. Revenue analysis defaults contain NO industry-specific terms (SKU, raw materials, hedging, COGS breakdown, ARR, payor mix, tonnage)
6. Metadata counts are accurate
