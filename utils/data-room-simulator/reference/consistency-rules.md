# Data Consistency Rules

All validation rules enforced by the verification script.

## Universal Rules

### Financial Statement Integrity

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| U-001 | Trial balance balances | Σ Debits = Σ Credits | $1 |
| U-002 | Balance sheet equation | Assets = Liabilities + Equity | $1 |
| U-003 | Revenue consistency | IS Revenue = TB Revenue | 0.1% |
| U-004 | Net income tie | IS Net Income = BS RE Change | $100 |

### Aging Schedule Ties

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| U-010 | AR aging total | AR Aging Total = BS AR | 1% |
| U-011 | AP aging total | AP Aging Total = BS AP | 1% |
| U-012 | Aging bucket sum | Σ Buckets = Total | $1 |

### HR Data Ties

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| U-020 | Headcount tie | Census Count ≈ Seed Headcount | ±3 |
| U-021 | Salary tie | Σ Salaries ≈ P&L Salary Expense | 5% |
| U-022 | Payroll periods | Payroll Entries = Employees × Months | Exact |

### Cash Flow Ties

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| U-030 | Cash flow tie | CF Ending Cash = BS Cash | $100 |
| U-031 | Net income source | CF Net Income = IS Net Income | $1 |

---

## SaaS-Specific Rules

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| S-001 | MRR to revenue | MRR = Monthly P&L Revenue | 0.1% |
| S-002 | ARR calculation | ARR = MRR × 12 | $1 |
| S-003 | Customer count | Active Subs = Customer Master Active | Exact |
| S-004 | Invoice tie | Σ Invoices = P&L Revenue | 0.1% |
| S-005 | Deferred revenue | DR Schedule = BS Deferred Revenue | $100 |

### MRR Cohort Rules
| Rule ID | Rule | Formula |
|---------|------|---------|
| S-010 | MRR movement | End MRR = Begin + New - Churn + Expansion |
| S-011 | Churn rate | Churn MRR / Begin MRR < 5% monthly |

---

## Construction-Specific Rules

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| C-001 | WIP revenue tie | Σ WIP Revenue = P&L Revenue | 0.1% |
| C-002 | WIP asset | Costs > Billings → Asset | N/A |
| C-003 | WIP liability | Billings > Costs → Liability | N/A |
| C-004 | Project sum | Σ Project Revenue = WIP Revenue | 0.1% |
| C-005 | Retention tie | Retention Receivable ≤ 10% of Billings | N/A |

### Percent Complete Rules
| Rule ID | Rule | Formula |
|---------|------|---------|
| C-010 | % complete | Revenue = Contract × % Complete |
| C-011 | % complete calc | % Complete = Costs / Est. Total Costs |
| C-012 | Completion range | 0% ≤ % Complete ≤ 100% |

---

## Manufacturing-Specific Rules

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| M-001 | Invoice tie | Σ Invoice Amounts = P&L Revenue | 0.1% |
| M-002 | Inventory tie | Inventory Ledger = BS Inventory | 1% |
| M-003 | COGS flow | COGS = Begin + Purchases - End | 1% |
| M-004 | BOM tie | Σ Component Costs ≈ Product Cost | 5% |

### Inventory Rules
| Rule ID | Rule | Formula |
|---------|------|---------|
| M-010 | Inventory layers | Raw + WIP + FG = Total Inventory |
| M-011 | Inventory turns | COGS / Avg Inventory = Turns |

---

## Professional Services-Specific Rules

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| P-001 | Revenue tie | Σ Billed Revenue = P&L Revenue | 0.1% |
| P-002 | WIP tie | WIP Schedule = BS Unbilled | 1% |
| P-003 | Timesheet tie | Σ Billed Amount ≈ Revenue | 5% |
| P-004 | Utilization | Billable / Available = Util Rate | N/A |

### Engagement Rules
| Rule ID | Rule | Formula |
|---------|------|---------|
| P-010 | Budget check | Σ Billed ≤ Budget (per engagement) |
| P-011 | Rate card | Billed Rate = Staff Rate × Hours |

---

## Retail-Specific Rules

| Rule ID | Rule | Formula | Tolerance |
|---------|------|---------|-----------|
| R-001 | Transaction tie | Σ Transactions = P&L Revenue | 0.1% |
| R-002 | Inventory tie | Inventory Ledger = BS Inventory | 1% |
| R-003 | Store rollup | Σ Store Sales = Total Sales | 0.1% |
| R-004 | Shrink limit | Shrink % < 3% | N/A |

### Store-Level Rules
| Rule ID | Rule | Formula |
|---------|------|---------|
| R-010 | Store P&L | Store Revenue - Costs = Margin |
| R-011 | Sales/sqft | Revenue / Store Sqft |

---

## QoE Issue Detection Rules

### Non-Recurring Items
| Type | Detection |
|------|-----------|
| Legal/Settlement | Event type = "legal" |
| Restructuring | Event type = "restructuring" |
| Insurance | Event type = "insurance" |
| One-time | Event.one_time = true |

### Owner Add-backs
| Type | Detection |
|------|-----------|
| Excess compensation | Owner salary > market benchmark |
| Related party | Transaction with related entity |
| Personal expenses | Flagged expense categories |

---

*These rules are enforced by `verify_data_room.py` and documented in `verification_report.json`.*
