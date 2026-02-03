# FDD Scope Library Viewer

This report renders the scope library into a nested bullet structure for review.

Notes:
- Nesting can be inferred (colon-parents + directive boundaries) or read from `scope_schema` if present.
- Mode: schema (if available)
- Index labels like `[03]` refer to the bullet's position in the original JSON list (0-based).


## Common skeleton

### Business overview (`business_overview`)
- total bullets: 5
- top-level items (what a user would see as checkboxes): 1

- [00] Meet with Target's officers and management in order to develop an understanding of operations, including its:
  - [01] Basis of financial information;
  - [02] Organization structure;
  - [03] Historical growth by geography; and
  - [04] Finance function, financial reporting framework and internal control environment.

### Accounting overview (`accounting_overview`)
- total bullets: 12
- top-level items (what a user would see as checkboxes): 3

- [00] Read Target's financial statements and discuss Target's accounting policies and practices with management, including:
  - [01] Finance function, financial reporting framework, and management reporting relationships (including processes, timing, structure of financial reporting, and interaction with the information/accounting systems);
  - [02] Significant accounting policies and recent or contemplated changes in accounting principles, procedures, or estimates;
  - [03] Significant accounting estimates (e.g. bad debt provision, rebates, capitalized R&D, etc.); and
  - [04] Intercompany accounts and related party transactions, if any.
- [05] Analyze the accounting policies as disclosed in the audited financial statements and perform a high-level gap assessment to identify differences between the Target’s accounting policies and practices and IFRS Accounting Standards as applied by Parent.
- [06] Consider if the following accounting policies have been applied consistently within and across historical periods:
  - [07] Cash versus accrual accounting policies;
  - [08] Capitalization policies;
  - [09] Depreciation policies; and
  - [10] Differences between interim and year-end procedures; and
  - [11] Revenue recognition policies;

### Quality of earnings (`quality_of_earnings`)
- total bullets: 9
- top-level items (what a user would see as checkboxes): 1

- [00] Identify, and where possible quantify, potential earnings before interest, taxes, depreciation, and amortization ("EBITDA") normalization items by considering:
  - [01] The impact of the normalization adjustments identified by Management;
  - [02] Large, unusual or non-recurring events, or transactions that may have distorted results;
  - [03] The impact of any changes to senior management or management team structure;
  - [04] The impact of provisions (allowance for doubtful accounts, inventory obsolescence, other), management estimates or adjusting entries on the reported results;
  - [05] The impact of foreign currency transactions;
  - [06] The impact of related party transactions and shared services provided by other entities, if applicable;
  - [07] The impact of any changes in accounting policies, procedures and estimates; and
  - [08] Other potential items identified during the due diligence process.

### Revenue analysis (`revenue_analysis`)
- total bullets: 20
- top-level items (what a user would see as checkboxes): 3

- [00] Obtain a comprehensive view of revenue and margins. Obtain the underlying transactional data (i.e. sales database), if available, and gain an understanding of the major trends in revenue and margins addressing areas including:
  - [01] Revenue and margin by significant customer and end market/ segment/ region;
  - [02] Price and volume trends.
- [03] Discuss with Management:
  - [04] impact of large or long-term orders/ seasonality (if applicable); and
  - [05] any non-recurring components of revenue.
  - [06] customer category (i.e. individual, business);
  - [07] distribution channel (i.e. online, wholesale, etc.); and
  - [08] price, volume, mix and cross-sell analysis.
  - [09] Seasonal fluctuations in demand and monthly sales trends; and
- [10] Obtain and read an analysis of Target's revenue and inquire about:
  - [11] Gross to net revenue;
  - [12] Revenue recognition policies;
  - [13] Revenue and gross margin by customer;
  - [14] Organic growth and delineation between price vs. volume;
  - [15] Pricing practices;
  - [16] Promotions and discounts;
  - [17] Any non-recurring components of revenue;
  - [18] Revenue seasonality, if any;
  - [19] Other components of cost of sales and key suppliers.

### Operating expenses (`operating_expenses`)
- total bullets: 7
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain and read an analysis of Target’s expenses and inquire about:
  - [01] Costing methodology;
  - [02] Cost of sale trends, impact of material change in vendors (if any);
  - [03] Employee compensation and related costs by function;
  - [04] Selling, general, and administrative expenses;
  - [05] Repairs and maintenance expense;
  - [06] Unusual and extraordinary items (if any).

### Working capital (`working_capital`)
- total bullets: 5
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain monthly details of the Company's consolidated working capital and analyze and comment on:
  - [01] The composition of individual working capital accounts (e.g., trade receivables, accounts payable and accruals, etc.);
  - [02] Monthly working capital trends, metrics, and seasonality;
  - [03] Large, unusual, or non-operating items that may have affected normal working capital trends, (such as accruals for bonuses, capital accruals, month end vs quarter end differences, etc.); and
  - [04] Understanding the accounting impact of allowance for uncollectible amounts and other accruals requiring judgment.

### Accounts receivable (`accounts_receivable`)
- total bullets: 5
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain and read an analysis of the Target’s accounts receivable and inquire and comment on:
  - [01] Billed/unbilled aging analysis, turnover and days sales outstanding;
  - [02] Credit terms;
  - [03] Trade and non-trade balances;
  - [04] Allowance for uncollectible accounts and write-offs.

### Accounts payable and accrued liabilities (`accounts_payable_and_accrued_liabilities`)
- total bullets: 5
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain and read an analysis of accounts payable, accrued liabilities and customer deposits and inquire about:
  - [01] Accounts payable aging and days outstanding;
  - [02] Accrued liabilities;
  - [03] Supplier settlement terms; and
  - [04] Other current and non-current liabilities.

### Capital expenditure requirements (`capital_expenditure_requirements`)
- total bullets: 3
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain and read an analysis of existing and future capital cost requirements including:
  - [01] Maintenance versus growth capital expenditures;
  - [02] Other historical, deferred, and planned capital expenditures

### Commitments and contingencies (`commitments_and_contingencies`)
- total bullets: 8
- top-level items (what a user would see as checkboxes): 1

- [00] Inquire about significant commitments and contingent liabilities including:
  - [01] Pending or threatened litigation or investigations by regulatory or other authorities; and
  - [02] Contractual obligations, including leases;
  - [03] Purchase commitments; and
  - [04] Employee agreements (e.g. transaction/retention bonuses, change-in-control, deferred compensation, or severance agreements, etc.);
  - [05] Incentive compensation and employee benefit obligations;
  - [06] Expected or contingent liabilities (e.g. environmental, litigation, regulatory and tax); and
  - [07] Other off-balance sheet transactions.

### Net debt (`net_debt`)
- total bullets: 2
- top-level items (what a user would see as checkboxes): 2

- [00] Summarize and comment on net debt items (on and off-balance sheet) presented by Management and other potential debt-like items;
- [01] Consider whether elements of working capital have the nature of and may be reclassified as net debt, and if so, summarize the potential impact of these adjustments on working capital and net debt; and


## Industry: healthcare

### Business Overview (`business_overview`)
- total bullets: 9
- top-level items (what a user would see as checkboxes): 1

- [00] Meet with Target's officers and management to obtain background information about Target, including its:
  - [01] History;
  - [02] Organizational structure and management reporting relationships;
  - [03] Services offered;
  - [04] Trends in payor mix;
  - [05] De novo expansion;
  - [06] Financing arrangements with patients, if applicable;
  - [07] Business risks and opportunities; and
  - [08] Information systems.

### Accounting Overview (`accounting_overview`)
- total bullets: 10
- top-level items (what a user would see as checkboxes): 8

- [00] Reporting methodology;
- [01] Basis for cost allocations, if any;
- [02] Revenue recognition policies by service type, and any recent changes in policy;
- [03] Significant accounting estimates;
- [04] Recent or contemplated changes in accounting principles, procedures, or estimates;
- [05] Intercompany accounts and related party transactions;
- [06] Non-recurring transactions.
- [07] Read Target's financial statements and discuss them with management to gain an understanding of accounting policies and practices including:
  - [08] Finance function, financial reporting framework, and management reporting relationships (including process, timing, structure of financial reporting, and interaction with the information/accounting systems);
  - [09] Significant accounting estimates (i.e. allowances for doubtful accounts, inventory provisions, accruals, etc.);

### Quality Of Earnings (`quality_of_earnings`)
- total bullets: 12
- top-level items (what a user would see as checkboxes): 3

- [00] Summarize potential adjustments identified regarding the profit and loss performance of Target in the form of a quality of earnings analysis, summarizing the risks that may impact EBITDA, including:
  - [01] Management identified adjustments;
  - [02] Non-recurring revenue and expenses;
  - [03] Significant out of period revenue and expense (e.g., cash to accrual accounting impact); and
  - [04] Pro forma impacts for items such as recent de novo.
- [05] Read and comment on the adjusted EBITDA prepared by Target and its sell-side advisors, and:
  - [06] Roll-forward the quality of earnings analysis included in the sell-side diligence report accordingly;
- [07] Propose any additional potential adjustments to historical earnings before interest, taxes, depreciation, and amortization ("EBITDA"), presented on a consolidated basis, by considering:
  - [08] The validity / impact of adjustments proposed by Management and the sell-side due diligence advisors, including Restructuring costs; Impact of loyalty program breakage; Sourcing changes; Vacation policy change; Accounting changes; Other normalization adjustments; Pro forma and run-rate adjustments; Carve-out, stand alone, corporate allocation considerations.
  - [09] Work with Client to consider synergy considerations, purchasing rebates, etc.(See below synergies validation for additional detail);
  - [10] Other large, unusual or non-recurring events or transactions that may have distorted results;
  - [11] Other potential items discovered in the due diligence process.

### Store Portfolio Analysis (`store_portfolio_analysis`)
- total bullets: 9
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain store P&L data to perform analysis to understand the drivers of historical sales and profitability development within the store portfolio to perform the following (to the extent possible based on information availability and transaction timelines):
  - [01] Sales and profitability by store location (including same store sales analysis, front store vs pharmacy, cost and margin profiles);
- [02] Segment the store portfolio to assess historical performance based on the following:
  - [03] Outlier performance – top quartile vs bottom quartile performing stores
  - [04] Store-type – Suburban / Dense Urban / Rural / etc., size format, storefront vs mall, etc
  - [05] Existing (same) stores, new stores, renovated stores, closed stores; standard, specialty, next gen
  - [06] Cohort analysis based on vintage year:
    - [07] Ramp analysis to understand ramp profile and assess reasonability of pro forma revenue and EBITDA maturity adjustments for recently opened locations;
    - [08] Store productivity and KPI metrics (e.g. Rx count, Rx revenue per Rx, sales/profitability per square foot);

### Revenue Analysis (`revenue_analysis`)
- total bullets: 21
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain and read center-level financial information including key operating metrics as well as related revenue and EBITDA. Inquire of Target regarding unusual trends or fluctuations in center performance over the historical period, including:
  - [01] Unusual or non-standard contracts;
- [02] Bridge revenue and profitability for the following changes:
  - [03] Same location and de novo center;
  - [04] Center-based vs. home-based;
  - [05] Type of procedure by CPT code;
  - [06] Top patient and/or top payers; and
  - [07] Changes in direct and indirect operating expenses.
  - [08] Center-level expense trends;
  - [09] Allocations of corporate overhead costs, if any;
  - [10] De novo start-up costs; and
  - [11] Components of other income and expense for the historical periods. Consider items that may impact EBITDA.
  - [12] Understands the health and sustainability of revenue and margin, that will bring clarity and insights into the drivers of business performance to strengthen deal conviction. Provides confidence in value creation planning / realization by uncovering opportunities earlier.
  - [13] Leveraging proprietary analytics tool, use the transaction / sales database from the IT / ERP systems to analyze revenue and profitability (cost, price, margin), key KPIs (e.g., average sales price, average order size, etc.) and performance trends (e.g., concentration, price-volume-mix, high growth SKUs, negative margins, etc.); evaluating by front-store and Pharmacy (Rx), Category (Dispensary, Over-the-Counter Products, Health and Beauty, Home Healthcare, Grocery, etc.), sub-category (by brand and sub-category), channel (brick & mortar, eCom), by brand, and by geography (store ID, postal code, city, etc.)
  - [14] Where information is available, also include Front of Store Partners (e.g.,, etc.) and eCom Partners (,, etc.)
  - [15] Where information is available, generic versus branded drugs
  - [16] Where information is available, public, private, or cash
  - [17] Integrate anonymized customer data to understand revenue and mix (one-time versus recurring) across different locations; use of loyalty programs loyalty programs (e.g., impact of discounts, recurring nature of customers, etc.); and how this impacts overall revenue sustainability
  - [18] Store costs analysed as a percentage of sales or applicable metric (selling payroll, other store payroll, store rent, marketing, shrinkage, sales-by-square footage, etc.).
  - [19] Sales and COGS adjustments (including sales returns, markdowns, supplier revenue, stock shrinkage, obsolescence, other income, loyalty points and gift cards);
  - [20] Consolidate the data into a clean Excel data cube and PowerBI Analysis file, and extract and understand any patterns and trends that might inform value creation and optimization opportunities

### Operating Expenses (`operating_expenses`)
- total bullets: 18
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain and read an analysis of Target's expenses and inquire about:
  - [01] Behavior Therapists (registered and unregistered) and Board Certified Behavior Analyst; compensation and benefits, including incentive compensation and historical turnover;
  - [02] Non-provider salaries, wages, and benefits, including incentive compensation;
  - [03] Owner compensation and benefits;
  - [04] Treatment supplies, including key suppliers and purchasing terms;
  - [05] Center-level costs and sub-leasing arrangements;
  - [06] Insurance expense;
  - [07] Selling, general and administrative/corporate expenses;
  - [08] Overhead allocations; and
  - [09] Unusual and extraordinary items.
- [10] Obtain and read an analysis of the Target's selling, general and administration expenses and inquire about:
  - [11] Salaries and wages (including headcount by area and function, if possible);
  - [12] General and administrative expenses;
  - [13] Information systems expenses;
  - [14] Corporate costs and any allocations to store level as applicable; clarify expenses with
  - [15] Extraordinary expenses;
  - [16] Rent and leases; and
  - [17] Miscellaneous and other expenses.

### Working Capital (`working_capital`)
- total bullets: 8
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain and read an analysis of working capital on a monthly basis. Inquire about historical trends, including seasonality, fluctuations in key metrics such as days revenue outstanding, days payable outstanding, and working capital as a percent of trailing revenue, and other significant items.
- [01] Summarize historical working capital in the business including:
  - [02] The composition of individual working capital accounts (e.g. trade receivables, inventory, accounts payable and accruals, etc.);
  - [03] Working capital trends and impact on reported metrics;
  - [04] Large, unusual or non-operating items that may have affected normal working capital trends, (such as accruals for bonuses, understanding non-trade balances, etc.);
  - [05] Understanding the accounting impact of allowance for uncollectible amounts, provisions, and other accruals requiring judgment;
  - [06] Working capital seasonality; and
  - [07] Historical trends in key working capital metrics.

### Accounts Receivable (`accounts_receivable`)
- total bullets: 11
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain and read an analysis of Target's accounts receivable and inquire about:
  - [01] Aging analysis by center by payor;
  - [02] Contractual allowances;
  - [03] Allowance for doubtful accounts and write-offs;
  - [04] Prior period accounts receivable adjustments;
  - [05] Self-pay and credit balances;
  - [06] Collection experience; and
  - [07] Other reserves and adjustments.
  - [08] Aging analysis and related credit terms (including special terms);
  - [09] Allowance for uncollectible accounts and write-offs; and
  - [10] Reserve and adjustments.

### Inventory (`inventory`)
- total bullets: 5
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain and read an analysis of Target's inventory and inquire and comment on:
  - [01] The inventory valuation methodology (e.g. standard costing);
  - [02] Significant vendor allowances, rebates, allowances and/or purchase commitments and related programs;
  - [03] Return to vendor provisions;
  - [04] Inventory aging and estimated provision, if any (i.e. slow-moving inventory).

### Other Assets (`other_assets`)
- total bullets: 1
- top-level items (what a user would see as checkboxes): 1

- [00] Obtain a summary of and comment on unusual items, significant fluctuations, and significant balances.

### Accounts Payable And Accrued Liabilities (`accounts_payable_and_accrued_liabilities`)
- total bullets: 6
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain and read an analysis of Target's accounts payable and accrued liabilities and inquire about:
  - [01] Accounts payable aging;
  - [02] Deferred revenue; and
- [03] Obtain and read an analysis of Target's accounts payable and accrued expenses and inquire about:
  - [04] AP aging analysis, terms of trade with major vendors and days payables outstanding;
  - [05] Accrued expenses; and

### Capital Expenditure Requirements (`capital_expenditure_requirements`)
- total bullets: 9
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain and read an analysis of Target's fixed assets, capital expenditures, and other assets and inquire about:
  - [01] Historical, deferred and planned capital expenditures;
  - [02] Capitalized internal labor;
  - [03] Under-utilized assets; and
  - [04] Impairment write-downs and issues.
- [05] Obtain and read an analysis of historical and future capital cost requirements including:
  - [06] Fixed asset continuity schedules (including significant additions and disposals);
  - [07] Maintenance versus growth capital expenditures; and
  - [08] Planned, committed, and deferred capital expenditures.

### Net Debt (`net_debt`)
- total bullets: 2
- top-level items (what a user would see as checkboxes): 2

- [00] Obtain, read, and discuss with management net debt and debt-like items, whether recorded on the balance sheet or off-balance sheet, including the expected future payout timing and amounts.
- [01] Prepare a summary of debt and debt-like items (e.g. notes payable, capital vendor payables, deferred purchase price of property or services, accrued bonuses, capital lease obligation, etc.), commitments and contingencies.

### Commitments And Contingencies (`commitments_and_contingencies`)
- total bullets: 8
- top-level items (what a user would see as checkboxes): 8

- [00] Debt;
- [01] Self-insurance;
- [02] Post-retirement benefits;
- [03] Incentive compensation plans;
- [04] Leases;
- [05] Pending or threatened litigation or investigations by regulatory or other authorities;
- [06] Capital expenditures; and
- [07] Other significant and/or unusual liabilities.

### Purchase And Sale Agreement (`purchase_and_sale_agreement`)
- total bullets: 1
- top-level items (what a user would see as checkboxes): 1

- [00] Read available draft of the Purchase and Sale Agreement and offer commentary to you and your attorneys primarily concerning sections relating to accounting matters, based on the results of the due diligence assistance we provide to you. You agree to review with your attorney all our comments and suggestions concerning the Purchase and Sale agreement before acting on any of our suggestions.

### Assistance With Transaction Documentation (`assistance_with_transaction_documentation`)
- total bullets: 1
- top-level items (what a user would see as checkboxes): 1

- [00] Assist with relevant asset purchase agreement financial definitions (e.g. net working capital and debt-like item definitions and adjustment procedures).

### Waterfall Revenue Analysis (`waterfall_revenue_analysis`)
- total bullets: 15
- top-level items (what a user would see as checkboxes): 2

- [00] If available, obtain patient/encounter-level detail from the billing and collections systems utilized by Target to perform a claims-level revenue analysis reflecting net cash received on closed claims, and estimated cash expected to be received on open claims (based on historical reimbursement trends). Discuss with management:
  - [01] Drivers of monthly/quarterly/annual net revenue trends:
    - [02] By location (8 clinic locations and 2 de novo locations);
    - [03] By significant payor; and
    - [04] By significant service code.
    - [05] Reimbursement trends by payor, by service, and by location;
    - [06] Pricing/volume trends by location by payor by service;
    - [07] Payor mix in total and by location;
    - [08] Trends and drivers of fluctuation in the cash collection cycle;
    - [09] Reconciliation of cash collections reported in the billing system to third-party bank statements (on a sample basis);
    - [10] Reconciliation of billing and collection information to financial statements; and
- [11] Bridge revenue for the following changes:
  - [12] Patient volumes;
  - [13] Same store, de novo, and acquired facilities; and
  - [14] Changes in direct and indirect operating expense

### Audit Working Papers (`audit_working_papers`)
- total bullets: 5
- top-level items (what a user would see as checkboxes): 5

- [00] Obtain and read the auditor's working papers for the latest fiscal year:
- [01] Comment on the nature and volume of audit differences (recorded and unrecorded adjustments), use of accounting estimates, any changes in accounting policies or methods; and
- [02] Comment on control issues identified by the external auditors, if applicable.
- [03] Comment on any additional "red flags" or key risks as identified in the provided audit materials
- [04] Review of the audit committee reporting and presentations from the audit firm
