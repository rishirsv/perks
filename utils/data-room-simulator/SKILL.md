---
name: data-room-simulator
description: Generate complete M&A data rooms for fictitious companies with consistent financial data. Use when the user asks to "create a data room", "simulate due diligence", "generate M&A documents", or mentions "data room", "QoE", "quality of earnings".
---

# M&A Data Room Simulator

Generate realistic, internally consistent M&A data rooms for training, testing, or demonstration purposes.

## When to Use This Skill

- User asks to create/generate a data room or M&A documents
- User wants to simulate due diligence materials
- User mentions QoE (quality of earnings) analysis training
- User needs test data for financial analysis tools

## Workflow

```markdown
Progress:
- [ ] Step 1: Gather requirements (industry, size, realism mode)
- [ ] Step 2: Generate company seed
- [ ] Step 3: Generate financial data
- [ ] Step 4: Generate operations data
- [ ] Step 5: Generate HR data
- [ ] Step 6: Generate narrative documents
- [ ] Step 7: Verify consistency
```

### Step 1: Gather Requirements

Ask for:
- **Industry**: `saas`, `construction`, `manufacturing`, `professional_services`, `retail`
- **Size**: `small` ($5-20M), `mid` ($20-100M), `large` ($100-500M)
- **Realism**: `clean` (no issues), `realistic` (QoE adjustments), `messy` (intentional errors)

### Step 2: Generate Company Seed

```bash
cd /Users/rishi/Code/agents/data-room-simulator
python scripts/generate_company.py --industry <industry> --size <size> --realism-mode <mode>
```

Creates `output/company_seed.json` with company profile, brand identity, management team, and events timeline.

### Step 3: Generate Financial Data

```bash
python scripts/generate_financials.py
```

Creates trial balance, income statement, balance sheet, cash flow, and supporting schedules (AR/AP aging, fixed assets, debt, NWC).

### Step 4: Generate Operations Data

```bash
python scripts/generate_operations.py
```

Creates industry-specific revenue detail:
- **SaaS**: subscriptions, MRR analysis, customer master
- **Construction**: projects, WIP, % completion
- **Manufacturing**: products, inventory, BOM
- **Services**: engagements, timesheets, utilization
- **Retail**: transactions, inventory, product catalog

### Step 5: Generate HR Data

```bash
python scripts/generate_hr_data.py
```

Creates employee census, payroll register, department summary. Salary totals tie to P&L.

### Step 6: Generate Narrative Documents

Use templates in `templates/` to generate:
- CIM (Confidential Information Memorandum)
- Company overview
- Accounting policies

### Step 7: Verify Consistency

```bash
python scripts/verify_data_room.py
```

Validates all cross-document ties. Output: `output/verification_report.json`

## Key Consistency Rules

- Trial balance balances (debits = credits)
- Balance sheet equation (A = L + E)
- Operations revenue = P&L revenue (exact match)
- Payroll totals = P&L salary expense
- AR/AP aging = balance sheet amounts
- Industry-specific rules (MRR × 12 = ARR, WIP ties, etc.)

## Supporting Files

- `profiles/` — Industry configurations (accounts, documents, rules)
- `scripts/` — Python generators and validators
- `templates/` — Narrative document templates
- `reference/` — Industry metrics, checklists, guides

## Requirements

```bash
pip install pandas openpyxl faker numpy reportlab
```
