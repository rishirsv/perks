# FDD Scope Library Synthesis — Mapping Audit

## Overview

The synthesized library at `reference/fdd_scope_library.json` defines **9 common skeleton sections** drawn from 11 industry mining outputs. This audit traces which raw `normalized_heading` from each industry was mapped into each common section, and identifies headings that were NOT mapped.

---

## Part 1: Common Skeleton Section Mapping

### 1. Business overview (`business_overview`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | _(none — preamble in `financial_due_diligence`)_ | NOT FOUND |
| Eyecare | `overview` + `summary_financials` | INDIRECT |
| Healthcare | `business_overview` | EXACT |
| HVAC | `overview` | INDIRECT |
| Manufacturing | `overview` | INDIRECT |
| Prof. Services | `overview` | INDIRECT |
| Real Estate | _(none — closest is `accounting_overview`)_ | NOT FOUND |
| Service | `general` | INDIRECT |
| Supermarket | `financial_overview` | INDIRECT |
| Tech | `business_understanding` + `business_overview` | EXACT (partial) |
| Transportation | `overview` | INDIRECT |

**Contributing: 9 / 11** (Real Estate and Construction lack standalone equivalent)

---

### 2. Quality of earnings (`quality_of_earnings`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `quality_of_earnings` | EXACT |
| Eyecare | `quality_of_earnings` | EXACT |
| Healthcare | `quality_of_earnings_analysis` | VARIANT |
| HVAC | `quality_of_earnings` + `sell_side_quality_of_earnings_assessment` | EXACT |
| Manufacturing | `quality_of_earnings` + `sell_side_qoe_assessment` | EXACT |
| Prof. Services | `quality_of_earnings` | EXACT |
| Real Estate | `sustainability_of_net_operating_income_on_a_consolidated_basis` | INDIRECT (NOI-based) |
| Service | `quality_of_earnings` | EXACT |
| Supermarket | `quality_of_earnings` | EXACT |
| Tech | `quality_of_earnings` | EXACT |
| Transportation | `quality_sustainability_of_earnings` | VARIANT |

**Contributing: 11 / 11** — most universal section

---

### 3. Revenue analysis (`revenue_analysis`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `sales_and_margin_trends` | INDIRECT |
| Eyecare | _(closest: `cost_of_revenue_and_corporate_expenses`)_ | NOT FOUND |
| Healthcare | `revenue_and_profitability` + `revenue_and_margin_analysis` | VARIANT |
| HVAC | `revenue_and_profitability_analysis` + `revenue_and_gross_margin_analysis` | VARIANT |
| Manufacturing | `revenue_and_margin_trends` + `revenue_value_add_contribution_margin` | VARIANT |
| Prof. Services | `revenue_revenue_recognition_and_margins` | VARIANT |
| Real Estate | _(embedded in NOI)_ | NOT FOUND |
| Service | `revenue_analysis` | EXACT |
| Supermarket | `supporting_analysis_for_quality_of_earnings` (contains revenue) | INDIRECT |
| Tech | `quality_of_revenue` | INDIRECT |
| Transportation | `revenue_and_profitability_trends` | VARIANT |

**Contributing: 9 / 11** (Eyecare, Real Estate lack standalone)

---

### 4. Operating expenses (`operating_expenses`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `cost_of_sales_and_operating_costs` | VARIANT |
| Eyecare | `cost_of_revenue_and_corporate_expenses` | VARIANT |
| Healthcare | `operating_expenses` | EXACT |
| HVAC | `direct_and_operating_expenses` + `expenses` | VARIANT |
| Manufacturing | `operating_expenses_and_sga` + `expenses` | VARIANT |
| Prof. Services | `operating_expenses` | EXACT |
| Real Estate | `operating_expenses` | EXACT |
| Service | `cost_structure` | INDIRECT |
| Supermarket | `sga_expenses` | VARIANT |
| Tech | _(embedded in `profitability_drivers`)_ | INDIRECT |
| Transportation | `cost_of_revenues_and_operating_expenses` | VARIANT |

**Contributing: 11 / 11**

---

### 5. Working capital (`working_capital`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `working_capital` | EXACT |
| Eyecare | `working_capital` | EXACT |
| Healthcare | `working_capital_analysis` | VARIANT |
| HVAC | `working_capital` | EXACT |
| Manufacturing | `working_capital` | EXACT |
| Prof. Services | `working_capital` | EXACT |
| Real Estate | _(embedded in `balance_sheet`)_ | INDIRECT |
| Service | `working_capital` | EXACT |
| Supermarket | `working_capital` | EXACT |
| Tech | `net_working_capital` | VARIANT |
| Transportation | `working_capital` | EXACT |

**Contributing: 11 / 11**

---

### 6. Accounts receivable (`accounts_receivable`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `accounts_receivable` | EXACT |
| Eyecare | `trade_and_other_receivables` | VARIANT |
| Healthcare | `accounts_receivable_analysis` | VARIANT |
| HVAC | `accounts_receivable` | EXACT |
| Manufacturing | `accounts_receivable` | EXACT |
| Prof. Services | `receivables` | VARIANT |
| Real Estate | _(embedded in `balance_sheet`)_ | INDIRECT |
| Service | `accounts_receivable` | EXACT |
| Supermarket | _(embedded in working capital)_ | NOT FOUND |
| Tech | _(embedded in `net_working_capital`)_ | INDIRECT |
| Transportation | `accounts_receivable` | EXACT |

**Contributing: 9 / 11**

---

### 7. AP and accrued liabilities (`accounts_payable_and_accrued_liabilities`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `accounts_payable_and_accrued_liabilities` | EXACT |
| Eyecare | `trade_and_other_payables_and_accrued_liabilities` | VARIANT |
| Healthcare | `accounts_payable_and_accrued_liabilities_analysis` | VARIANT |
| HVAC | `accounts_payable_accrued_liabilities_and_other_current_liabilities` | VARIANT |
| Manufacturing | `accounts_payable_and_accrued_liabilities` | EXACT |
| Prof. Services | `accounts_payables_and_accrued_liabilities` | VARIANT |
| Real Estate | _(embedded in `balance_sheet`)_ | INDIRECT |
| Service | `accounts_payable_accrued_liabilities_and_other_liabilities` | VARIANT |
| Supermarket | _(embedded in working capital)_ | NOT FOUND |
| Tech | _(embedded in `net_working_capital`)_ | INDIRECT |
| Transportation | `accounts_payable_and_accrued_liabilities` | EXACT |

**Contributing: 9 / 11**

---

### 8. Capital expenditure requirements (`capital_expenditure_requirements`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `fixed_asset_equipment_and_vehicles` | INDIRECT |
| Eyecare | `capital_expenditure_requirements` | EXACT |
| Healthcare | `capital_expenditure_requirements` | EXACT |
| HVAC | `capital_expenditure` | VARIANT |
| Manufacturing | `capital_expenditures_and_fixed_assets` | VARIANT |
| Prof. Services | `capital_expenditure_requirements` | EXACT |
| Real Estate | _(embedded in `balance_sheet`)_ | INDIRECT |
| Service | `capital_expenditure_requirements` | EXACT |
| Supermarket | `capital_expenditures` | VARIANT |
| Tech | _(none standalone)_ | NOT FOUND |
| Transportation | `capital_expenditure_and_fixed_assets` | VARIANT |

**Contributing: 10 / 11** (Tech lacks standalone capex)

---

### 9. Net debt (`net_debt`)

| Industry | Raw heading mapped | Match type |
|---|---|---|
| Construction | `net_debt_and_other_assets_liabilities` | VARIANT |
| Eyecare | `net_debt_debt_like_items` | VARIANT |
| Healthcare | `net_debt_debt_like_items` | VARIANT |
| HVAC | `net_debt` | EXACT |
| Manufacturing | `net_debt` | EXACT |
| Prof. Services | `net_debt_debt_like_items` | VARIANT |
| Real Estate | _(embedded in `balance_sheet`)_ | INDIRECT |
| Service | `net_debt_debt_like_items` | VARIANT |
| Supermarket | `net_debt_and_other_liabilities` | VARIANT |
| Tech | `stratified_balance_sheet_and_net_debt` + `locked_box` | INDIRECT |
| Transportation | `net_debt` | EXACT |

**Contributing: 11 / 11**

---

## Part 2: Contribution Summary

| Common Section | EXACT | VARIANT | INDIRECT | NOT FOUND | Total |
|---|---|---|---|---|---|
| Business overview | 2 | 0 | 7 | 2 | **9** |
| Quality of earnings | 9 | 2 | 1 | 0 | **11** |
| Revenue analysis | 1 | 6 | 2 | 2 | **9** |
| Operating expenses | 3 | 6 | 2 | 0 | **11** |
| Working capital | 8 | 2 | 1 | 0 | **11** |
| Accounts receivable | 5 | 3 | 2 | 1 | **9** |
| AP and accrued liabilities | 3 | 5 | 2 | 1 | **9** |
| Capital expenditure | 4 | 4 | 2 | 1 | **10** |
| Net debt | 3 | 5 | 2 | 0 | **11** |

All 9 sections meet the 8-of-11 threshold.

---

## Part 3: Sections Missing From Common Skeleton (Candidates)

These headings appear across multiple industries but were NOT included in the common skeleton:

| Candidate Section | Frequency | Industries |
|---|---|---|
| **Accounting overview / consistency** | 10 / 11 | All except Eyecare |
| **Commitments and contingencies** | 9 / 11 | Construction, Eyecare, Healthcare, HVAC, Manufacturing, Real Estate, Service, Supermarket, Transportation |
| **Inventory** | 7 / 11 | Construction, Eyecare, Healthcare, HVAC, Manufacturing, Supermarket, Transportation |
| **Related parties** | 5 / 11 | Construction, HVAC, Manufacturing, Prof. Services, Transportation |
| **Audit work papers** | 5 / 11 | Healthcare, HVAC, Real Estate, Service, Supermarket |

**Accounting overview** (10/11) and **Commitments & contingencies** (9/11) both exceed the 8-of-11 threshold and should arguably be added to the common skeleton.

---

## Part 4: Naming Variant Map

Quick reference showing all raw heading variants that map to each common section:

| Common Section | Variant Names Found |
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
