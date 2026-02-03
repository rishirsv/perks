# FDD Scope Library — Proposed Bullet Nesting Report (draft)

This report is generated from `reference/fdd_scope_library.json` using a heuristic: bullets ending in `:` become parents; subsequent items attach beneath them; “new directive” bullets (e.g. start with “obtain”, “analyze”, “perform”, etc.) end the nesting.

The goal is to (1) make indentation correct in generated `.docx` and (2) expose only **top-level** bullets to the user for scope curation (children follow the parent).

## Common skeleton (all industries)

### Business overview (`business_overview`)
- parents: 1, child bullets: 4, max depth: 2

- [business_overview.a57092a5] Meet with Target's officers and management in order to develop an understanding of operations, including its:
  - [business_overview.7d713ade] Basis of financial information;
  - [business_overview.251fd972] Organization structure;
  - [business_overview.2823d94e] Historical growth by geography; and
  - [business_overview.64149c0c] Finance function, financial reporting framework and internal control environment.

### Accounting overview (`accounting_overview`)
- parents: 2, child bullets: 9, max depth: 2

- [accounting_overview.980ff673] Read Target's financial statements and discuss Target's accounting policies and practices with management, including:
  - [accounting_overview.85310802] Finance function, financial reporting framework, and management reporting relationships (including processes, timing, structure of financial reporting, and interaction with the information/accounting systems);
  - [accounting_overview.c03f84b6] Significant accounting policies and recent or contemplated changes in accounting principles, procedures, or estimates;
  - [accounting_overview.f8299f27] Significant accounting estimates (e.g. bad debt provision, rebates, capitalized R&D, etc.); and
  - [accounting_overview.6029ad2b] Intercompany accounts and related party transactions, if any.
- [accounting_overview.95827fa3] Analyze the accounting policies as disclosed in the audited financial statements and perform a high-level gap assessment to identify differences between the Target’s accounting policies and practices and IFRS Accounting Standards as applied by Parent.
- [accounting_overview.0a3155ee] Consider if the following accounting policies have been applied consistently within and across historical periods:
  - [accounting_overview.5bd90cc7] Cash versus accrual accounting policies;
  - [accounting_overview.a35b7cc8] Capitalization policies;
  - [accounting_overview.aead3a5c] Depreciation policies; and
  - [accounting_overview.a0dedcaa] Differences between interim and year-end procedures; and
  - [accounting_overview.6fcb193a] Revenue recognition policies;

### Quality of earnings (`quality_of_earnings`)
- parents: 1, child bullets: 8, max depth: 2

- [quality_of_earnings.1c70f0b4] Identify, and where possible quantify, potential earnings before interest, taxes, depreciation, and amortization ("EBITDA") normalization items by considering:
  - [quality_of_earnings.2127da8f] The impact of the normalization adjustments identified by Management;
  - [quality_of_earnings.335ac28f] Large, unusual or non-recurring events, or transactions that may have distorted results;
  - [quality_of_earnings.e9e2fb1b] The impact of any changes to senior management or management team structure;
  - [quality_of_earnings.7f472600] The impact of provisions (allowance for doubtful accounts, inventory obsolescence, other), management estimates or adjusting entries on the reported results;
  - [quality_of_earnings.a6ec8cfa] The impact of foreign currency transactions;
  - [quality_of_earnings.9e5d2294] The impact of related party transactions and shared services provided by other entities, if applicable;
  - [quality_of_earnings.aab89cb6] The impact of any changes in accounting policies, procedures and estimates; and
  - [quality_of_earnings.55c4076c] Other potential items identified during the due diligence process.

### Revenue analysis (`revenue_analysis`)
- parents: 3, child bullets: 17, max depth: 2

- [revenue_analysis.99519c05] Obtain a comprehensive view of revenue and margins. Obtain the underlying transactional data (i.e. sales database), if available, and gain an understanding of the major trends in revenue and margins addressing areas including:
  - [revenue_analysis.56871b87] Revenue and margin by significant customer and end market/ segment/ region;
  - [revenue_analysis.371c9210] Price and volume trends.
- [revenue_analysis.e3b32b68] Discuss with Management:
  - [revenue_analysis.f189b3bd] impact of large or long-term orders/ seasonality (if applicable); and
  - [revenue_analysis.a7da2eac] any non-recurring components of revenue.
  - [revenue_analysis.5f6c2410] customer category (i.e. individual, business);
  - [revenue_analysis.265435e4] distribution channel (i.e. online, wholesale, etc.); and
  - [revenue_analysis.80b871fd] price, volume, mix and cross-sell analysis.
  - [revenue_analysis.45e7f410] Seasonal fluctuations in demand and monthly sales trends; and
- [revenue_analysis.19cbb1d2] Obtain and read an analysis of Target's revenue and inquire about:
  - [revenue_analysis.02136b71] Gross to net revenue;
  - [revenue_analysis.6fcb193a] Revenue recognition policies;
  - [revenue_analysis.60799797] Revenue and gross margin by customer;
  - [revenue_analysis.238a452f] Organic growth and delineation between price vs. volume;
  - [revenue_analysis.aea6b97a] Pricing practices;
  - [revenue_analysis.62d95298] Promotions and discounts;
  - [revenue_analysis.f7d2ac65] Any non-recurring components of revenue;
  - [revenue_analysis.7b90c132] Revenue seasonality, if any;
  - [revenue_analysis.39abf588] Other components of cost of sales and key suppliers.

### Operating expenses (`operating_expenses`)
- parents: 1, child bullets: 6, max depth: 2

- [operating_expenses.de4053d9] Obtain and read an analysis of Target’s expenses and inquire about:
  - [operating_expenses.312e5edf] Costing methodology;
  - [operating_expenses.1dd74e45] Cost of sale trends, impact of material change in vendors (if any);
  - [operating_expenses.80d7319f] Employee compensation and related costs by function;
  - [operating_expenses.770825a6] Selling, general, and administrative expenses;
  - [operating_expenses.10257271] Repairs and maintenance expense;
  - [operating_expenses.67b43e0b] Unusual and extraordinary items (if any).

### Working capital (`working_capital`)
- parents: 1, child bullets: 4, max depth: 2

- [working_capital.3ccae96a] Obtain monthly details of the Company's consolidated working capital and analyze and comment on:
  - [working_capital.e4a8cf26] The composition of individual working capital accounts (e.g., trade receivables, accounts payable and accruals, etc.);
  - [working_capital.c24a1b14] Monthly working capital trends, metrics, and seasonality;
  - [working_capital.9cb76428] Large, unusual, or non-operating items that may have affected normal working capital trends, (such as accruals for bonuses, capital accruals, month end vs quarter end differences, etc.); and
  - [working_capital.1e495886] Understanding the accounting impact of allowance for uncollectible amounts and other accruals requiring judgment.

### Accounts receivable (`accounts_receivable`)
- parents: 1, child bullets: 4, max depth: 2

- [accounts_receivable.8338d0e4] Obtain and read an analysis of the Target’s accounts receivable and inquire and comment on:
  - [accounts_receivable.83bd1de9] Billed/unbilled aging analysis, turnover and days sales outstanding;
  - [accounts_receivable.f44b7841] Credit terms;
  - [accounts_receivable.c1ed12cf] Trade and non-trade balances;
  - [accounts_receivable.8f099cfe] Allowance for uncollectible accounts and write-offs.

### Accounts payable and accrued liabilities (`accounts_payable_and_accrued_liabilities`)
- parents: 1, child bullets: 4, max depth: 2

- [accounts_payable_and_accrued_liabilities.85f1dd1c] Obtain and read an analysis of accounts payable, accrued liabilities and customer deposits and inquire about:
  - [accounts_payable_and_accrued_liabilities.7eb41bbd] Accounts payable aging and days outstanding;
  - [accounts_payable_and_accrued_liabilities.23db900b] Accrued liabilities;
  - [accounts_payable_and_accrued_liabilities.90100730] Supplier settlement terms; and
  - [accounts_payable_and_accrued_liabilities.1332952e] Other current and non-current liabilities.

### Capital expenditure requirements (`capital_expenditure_requirements`)
- parents: 1, child bullets: 2, max depth: 2

- [capital_expenditure_requirements.720a2ef9] Obtain and read an analysis of existing and future capital cost requirements including:
  - [capital_expenditure_requirements.396b5c72] Maintenance versus growth capital expenditures;
  - [capital_expenditure_requirements.1c513e7d] Other historical, deferred, and planned capital expenditures

### Commitments and contingencies (`commitments_and_contingencies`)
- parents: 1, child bullets: 7, max depth: 2

- [commitments_and_contingencies.7a18c545] Inquire about significant commitments and contingent liabilities including:
  - [commitments_and_contingencies.8757741d] Pending or threatened litigation or investigations by regulatory or other authorities; and
  - [commitments_and_contingencies.1e2cfc97] Contractual obligations, including leases;
  - [commitments_and_contingencies.a30fe70f] Purchase commitments; and
  - [commitments_and_contingencies.e0f3b487] Employee agreements (e.g. transaction/retention bonuses, change-in-control, deferred compensation, or severance agreements, etc.);
  - [commitments_and_contingencies.f5c0cce1] Incentive compensation and employee benefit obligations;
  - [commitments_and_contingencies.af8a0678] Expected or contingent liabilities (e.g. environmental, litigation, regulatory and tax); and
  - [commitments_and_contingencies.e6c6ff29] Other off-balance sheet transactions.

## Industry modules (sections with nesting only)

### construction

- `revenue_analysis`: parents 1, child bullets 4, max depth 2
- `accounts_payable_and_accrued_liabilities`: parents 1, child bullets 3, max depth 2
- `capital_expenditure_requirements`: parents 1, child bullets 4, max depth 2
- `commitments_and_contingencies`: parents 1, child bullets 2, max depth 2
- `accounting_overview`: parents 1, child bullets 6, max depth 2

#### `revenue_analysis`
- [revenue_analysis.b4bff19b] To the extent available, obtain and read an analysis of Target’s revenues and margins and inquire about the following:
- [revenue_analysis.dcfea3a1] Analyze revenue, margin, pricing and average project length on a project basis by the following (where available):
  - [revenue_analysis.1e74e6c6] Revenue stream (civil work, special projects (buildings), services and equipment rental);
  - [revenue_analysis.b39f008e] Customer
  - [revenue_analysis.b27c2f67] Geography
  - [revenue_analysis.1984337f] Industry
- [revenue_analysis.61dc02a7] Understand Target’s job costing methodology (components included in margin, and periodic true ups)
- [revenue_analysis.c56e0acc] Understand Target’s revenue recognition and billing process (e.g. percentage of completion, periodic and contract completion true-ups (and its variability), loss provision process, policies in place to control accounting recognition and policy escalations, and lifecycle), with specific focus on Construction Management contracts, and its corresponding timing impact to EBITDA;
- [revenue_analysis.71cb4b44] Understanding the profile (and exposure) of major project/contracts (i.e. Indigenous Partnership with Target.);
- [revenue_analysis.d2bffead] Obtain and analyze the backlog and active backlog as at latest available date (backlog margin on a project basis, and analysis of historical backlog conversion)

#### `accounts_payable_and_accrued_liabilities`
- [accounts_payable_and_accrued_liabilities.926412aa] Obtain and read an analysis of Target’s accounts payable and accrued liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.6f4c0e41] Terms of trade with major suppliers, significant vendor allowances, rebates and/or purchase commitments;
  - [accounts_payable_and_accrued_liabilities.5432b879] Trade payables aging analysis and days payable outstanding analysis;
  - [accounts_payable_and_accrued_liabilities.8845abbb] Billings in excess of cost profile; and

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.8be75257] Obtain an understanding of the Company’s current equipment, including:
  - [capital_expenditure_requirements.3be37be8] Mix of owned versus leased equipment/ vehicles;
  - [capital_expenditure_requirements.14040c54] Average age of equipment/ vehicles;
  - [capital_expenditure_requirements.40e0297a] For leased fleet, understand the annual payment requirements;
  - [capital_expenditure_requirements.6ed98217] For owned fleet, obtain details of historical capital expenditures and comment on planned, committed, and deferred capital expenditures.

#### `commitments_and_contingencies`
- [commitments_and_contingencies.33734f5c] Obtain and comment on any contingent claims or liabilities including:
  - [commitments_and_contingencies.5140ea22] Pending or threatened litigation or investigation by regulatory or other authorities; and
  - [commitments_and_contingencies.293009b1] Other off-balance sheet transactions (including contingencies and guarantees).

#### `accounting_overview`
- [accounting_overview.a80d63c5] Understand and summarize the financial statement preparation process, including:
  - [accounting_overview.85e7557c] Finance function, financial reporting framework, and management reporting relationships (including process, timing, structure of financial reporting, and interaction with the information/ accounting systems);
  - [accounting_overview.ef321cbc] Integration of recent acquisitions and status of any ongoing integration processes;
  - [accounting_overview.e1f9438f] Significant accounts estimates and any recent or contemplated changes in accounting principles, procedures, or estimates.
  - [accounting_overview.e791b2f3] If available, understand the reviewed statements unrecorded differences, management letter points, and other significant findings encountered during the annual review.
  - [accounting_overview.b7261cd1] Target’s accounting policies and the key differences with IFRS Accounting Standards as applied by Parent
  - [accounting_overview.d121ba02] (Following the high-level gap assessment, if a more detailed gap assessment is required, we will work with Client to identify topics for further analysis and the estimate fees for the incremental analysis.)

### eyecare

- `business_overview`: parents 2, child bullets 5, max depth 2
- `quality_of_earnings`: parents 2, child bullets 6, max depth 2
- `supporting_analysis_to_quality_of_earnings`: parents 1, child bullets 4, max depth 2
- `quality_of_revenue_and_receivables_and_cash_proof`: parents 1, child bullets 3, max depth 2
- `working_capital`: parents 2, child bullets 4, max depth 2
- `accounts_payable_and_accrued_liabilities`: parents 1, child bullets 2, max depth 2

#### `business_overview`
- [business_overview.b3eccbc3] Read Target's financial statements and discuss them with management to gain an understanding of Target's accounting policies and practices, including:
  - [business_overview.7d31b5c8] Finance function, financial reporting framework, and management reporting relationships;
  - [business_overview.1138e901] Significant accounting policies and estimates (e.g. revenue recognition, capitalized costs, deferred revenue) and contemplated changes
- [business_overview.7cabccbe] Read Target's financial statements and discuss with Management to gain an understanding of the following:
  - [business_overview.bf3754ca] Financial performance over the historical period;
  - [business_overview.ddf7945f] Potential adjustments to the profit and loss performance identified by Management;
  - [business_overview.0f43a56c] Accounting policies and practices.

#### `quality_of_earnings`
- [quality_of_earnings.5faba2e5] Summarize potential adjustments identified regarding the profit and loss performance of Target in the form of a quality of earnings analysis, summarizing the risks that may impact earnings before interest, taxes, depreciation and amortization ("EBITDA"), including:
  - [quality_of_earnings.5596d20e] Leveraging Target commissioned Sell-side Due Diligence Report and understand proposed adjustments (including but not limited to cash to accrual, physician compensation, pro pricing adjustments, etc);
  - [quality_of_earnings.1428f5a4] Large, unusual, and non-recurring events or transactions that may have distorted results;
  - [quality_of_earnings.1e734252] The impact of provisions, management estimates or adjusting entries on the reported results; and
  - [quality_of_earnings.2d9898fa] Other potential items discovered during the due diligence process.
- [quality_of_earnings.99996c44] Provide a high-level analysis regarding the profit and loss performance of Target in the form of a quality of earnings analysis, summarizing the risks that may impact earnings before interest, taxes, depreciation and amortization ("EBITDA"), including:
  - [quality_of_earnings.829ce8a7] Adjustments proposed by Target;
  - [quality_of_earnings.31cda99f] Cash-to-accrual adjustments;

#### `supporting_analysis_to_quality_of_earnings`
- [supporting_analysis_to_quality_of_earnings.284225a7] Key performance metrics:
  - [supporting_analysis_to_quality_of_earnings.786ad97b] By clinic analysis: Revenue and direct costs (such as doctor/compensation, rent) by location;
  - [supporting_analysis_to_quality_of_earnings.770368d9] Revenue by type and pricing trends;
  - [supporting_analysis_to_quality_of_earnings.1c3d49d3] Per visit trends;
  - [supporting_analysis_to_quality_of_earnings.6dd6ea7f] Physician production.

#### `quality_of_revenue_and_receivables_and_cash_proof`
- [quality_of_revenue_and_receivables_and_cash_proof.f54dfb76] Using the underlying billing data, develop a revenue waterfall analysis and understand the following:
  - [quality_of_revenue_and_receivables_and_cash_proof.347c1424] Historical collection profile;
  - [quality_of_revenue_and_receivables_and_cash_proof.555da5ce] Variances between implied accrual revenue and the Company's internal records; and
  - [quality_of_revenue_and_receivables_and_cash_proof.46a35a53] Accounts receivable profile.
- [quality_of_revenue_and_receivables_and_cash_proof.921382fa] Compare the Company's cash receipts and disbursements to bank statement inflows and outflows

#### `working_capital`
- [working_capital.d26d43e2] Obtain details on Target's working capital and conduct the following:
  - [working_capital.50a805fb] Monthly working capital trends, including seasonality, for the past 24 months;
  - [working_capital.a64d4fd3] Historical trends in key working capital metrics (DSO, DIO, DPO); and
  - [working_capital.88860974] on factors that may have distorted the current or historical working capital position.
- [working_capital.3ce35fac] Obtain details on Target's working capital and conduct the following high-level analysis:
  - [working_capital.117dc5e5] Monthly working capital trends, including seasonality, for the historical period;
- [working_capital.6a98603c] Comment on factors that may have distorted the current or historical working capital position.

#### `accounts_payable_and_accrued_liabilities`
- [accounts_payable_and_accrued_liabilities.6b920163] Obtain and read an analysis of Target's payables and accrued liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.5f519eb2] Terms of trade with major suppliers, aging analysis;
  - [accounts_payable_and_accrued_liabilities.b0ab612b] Accrued liabilities; and

### healthcare

- `business_overview`: parents 1, child bullets 8, max depth 2
- `accounting_overview`: parents 1, child bullets 2, max depth 2
- `quality_of_earnings`: parents 3, child bullets 9, max depth 2
- `store_portfolio_analysis`: parents 3, child bullets 9, max depth 3
- `revenue_analysis`: parents 2, child bullets 19, max depth 2
- `operating_expenses`: parents 2, child bullets 16, max depth 2
- `working_capital`: parents 1, child bullets 6, max depth 2
- `accounts_receivable`: parents 1, child bullets 10, max depth 2
- `inventory`: parents 1, child bullets 4, max depth 2
- `accounts_payable_and_accrued_liabilities`: parents 2, child bullets 4, max depth 2
- `capital_expenditure_requirements`: parents 2, child bullets 7, max depth 2
- `waterfall_revenue_analysis`: parents 3, child bullets 22, max depth 3

#### `business_overview`
- [business_overview.93608a23] Meet with Target's officers and management to obtain background information about Target, including its:
  - [business_overview.0de25264] History;
  - [business_overview.2c72e07c] Organizational structure and management reporting relationships;
  - [business_overview.d60d58fd] Services offered;
  - [business_overview.ed7495b7] Trends in payor mix;
  - [business_overview.3217bb74] De novo expansion;
  - [business_overview.ff8c1140] Financing arrangements with patients, if applicable;
  - [business_overview.d645dac4] Business risks and opportunities; and
  - [business_overview.3e60fa4f] Information systems.

#### `accounting_overview`
- [accounting_overview.da83d3d0] Reporting methodology;
- [accounting_overview.3803d6b6] Basis for cost allocations, if any;
- [accounting_overview.d10c3355] Revenue recognition policies by service type, and any recent changes in policy;
- [accounting_overview.0df049c2] Significant accounting estimates;
- [accounting_overview.d712e666] Recent or contemplated changes in accounting principles, procedures, or estimates;
- [accounting_overview.3647e592] Intercompany accounts and related party transactions;
- [accounting_overview.739a6152] Non-recurring transactions.
- [accounting_overview.cac60fde] Read Target's financial statements and discuss them with management to gain an understanding of accounting policies and practices including:
  - [accounting_overview.e0feef13] Finance function, financial reporting framework, and management reporting relationships (including process, timing, structure of financial reporting, and interaction with the information/accounting systems);
  - [accounting_overview.d2705508] Significant accounting estimates (i.e. allowances for doubtful accounts, inventory provisions, accruals, etc.);

#### `quality_of_earnings`
- [quality_of_earnings.8cd69034] Summarize potential adjustments identified regarding the profit and loss performance of Target in the form of a quality of earnings analysis, summarizing the risks that may impact EBITDA, including:
  - [quality_of_earnings.19fcef76] Management identified adjustments;
  - [quality_of_earnings.f00cebc9] Non-recurring revenue and expenses;
  - [quality_of_earnings.96f2c011] Significant out of period revenue and expense (e.g., cash to accrual accounting impact); and
  - [quality_of_earnings.f2656912] Pro forma impacts for items such as recent de novo.
- [quality_of_earnings.2535af62] Read and comment on the adjusted EBITDA prepared by Target and its sell-side advisors, and:
  - [quality_of_earnings.12572828] Roll-forward the quality of earnings analysis included in the sell-side diligence report accordingly;
- [quality_of_earnings.d3022d79] Propose any additional potential adjustments to historical earnings before interest, taxes, depreciation, and amortization ("EBITDA"), presented on a consolidated basis, by considering:
  - [quality_of_earnings.7cddf853] The validity / impact of adjustments proposed by Management and the sell-side due diligence advisors, including Restructuring costs; Impact of loyalty program breakage; Sourcing changes; Vacation policy change; Accounting changes; Other normalization adjustments; Pro forma and run-rate adjustments; Carve-out, stand alone, corporate allocation considerations.
  - [quality_of_earnings.6886aa3e] Work with Client to consider synergy considerations, purchasing rebates, etc.(See below synergies validation for additional detail);
  - [quality_of_earnings.7cc7afb6] Other large, unusual or non-recurring events or transactions that may have distorted results;
  - [quality_of_earnings.d8e7c7da] Other potential items discovered in the due diligence process.

#### `store_portfolio_analysis`
- [store_portfolio_analysis.fe5054a1] Obtain store P&L data to perform analysis to understand the drivers of historical sales and profitability development within the store portfolio to perform the following (to the extent possible based on information availability and transaction timelines):
  - [store_portfolio_analysis.e04a66b9] Sales and profitability by store location (including same store sales analysis, front store vs pharmacy, cost and margin profiles);
- [store_portfolio_analysis.04bdd893] Segment the store portfolio to assess historical performance based on the following:
  - [store_portfolio_analysis.e0d48c54] Outlier performance – top quartile vs bottom quartile performing stores
  - [store_portfolio_analysis.7f0f48be] Store-type – Suburban / Dense Urban / Rural / etc., size format, storefront vs mall, etc
  - [store_portfolio_analysis.03862641] Existing (same) stores, new stores, renovated stores, closed stores; standard, specialty, next gen
  - [store_portfolio_analysis.58324327] Cohort analysis based on vintage year:
    - [store_portfolio_analysis.efc04fe4] Ramp analysis to understand ramp profile and assess reasonability of pro forma revenue and EBITDA maturity adjustments for recently opened locations;
    - [store_portfolio_analysis.ac14a012] Store productivity and KPI metrics (e.g. Rx count, Rx revenue per Rx, sales/profitability per square foot);

#### `revenue_analysis`
- [revenue_analysis.c2f0d0d8] Obtain and read center-level financial information including key operating metrics as well as related revenue and EBITDA. Inquire of Target regarding unusual trends or fluctuations in center performance over the historical period, including:
  - [revenue_analysis.8308d7cd] Unusual or non-standard contracts;
- [revenue_analysis.251ca73d] Bridge revenue and profitability for the following changes:
  - [revenue_analysis.55fa40b8] Same location and de novo center;
  - [revenue_analysis.8a9abe95] Center-based vs. home-based;
  - [revenue_analysis.a0258661] Type of procedure by CPT code;
  - [revenue_analysis.ca632d5f] Top patient and/or top payers; and
  - [revenue_analysis.7e77d5dc] Changes in direct and indirect operating expenses.
  - [revenue_analysis.2bac992b] Center-level expense trends;
  - [revenue_analysis.61658e9a] Allocations of corporate overhead costs, if any;
  - [revenue_analysis.137eca5c] De novo start-up costs; and
  - [revenue_analysis.bb263b12] Components of other income and expense for the historical periods. Consider items that may impact EBITDA.
  - [revenue_analysis.253d1f8f] Understands the health and sustainability of revenue and margin, that will bring clarity and insights into the drivers of business performance to strengthen deal conviction. Provides confidence in value creation planning / realization by uncovering opportunities earlier.
  - [revenue_analysis.325c40b8] Leveraging proprietary analytics tool, use the transaction / sales database from the IT / ERP systems to analyze revenue and profitability (cost, price, margin), key KPIs (e.g., average sales price, average order size, etc.) and performance trends (e.g., concentration, price-volume-mix, high growth SKUs, negative margins, etc.); evaluating by front-store and Pharmacy (Rx), Category (Dispensary, Over-the-Counter Products, Health and Beauty, Home Healthcare, Grocery, etc.), sub-category (by brand and sub-category), channel (brick & mortar, eCom), by brand, and by geography (store ID, postal code, city, etc.)
  - [revenue_analysis.be360aad] Where information is available, also include Front of Store Partners (e.g.,, etc.) and eCom Partners (,, etc.)
  - [revenue_analysis.e625019b] Where information is available, generic versus branded drugs
  - [revenue_analysis.78321eb5] Where information is available, public, private, or cash
  - [revenue_analysis.166f4a8c] Integrate anonymized customer data to understand revenue and mix (one-time versus recurring) across different locations; use of loyalty programs loyalty programs (e.g., impact of discounts, recurring nature of customers, etc.); and how this impacts overall revenue sustainability
  - [revenue_analysis.0e76b64b] Store costs analysed as a percentage of sales or applicable metric (selling payroll, other store payroll, store rent, marketing, shrinkage, sales-by-square footage, etc.).
  - [revenue_analysis.ad1f20b9] Sales and COGS adjustments (including sales returns, markdowns, supplier revenue, stock shrinkage, obsolescence, other income, loyalty points and gift cards);
  - [revenue_analysis.ea9a31b7] Consolidate the data into a clean Excel data cube and PowerBI Analysis file, and extract and understand any patterns and trends that might inform value creation and optimization opportunities

#### `operating_expenses`
- [operating_expenses.5d9549cd] Obtain and read an analysis of Target's expenses and inquire about:
  - [operating_expenses.3ccab9ed] Behavior Therapists (registered and unregistered) and Board Certified Behavior Analyst; compensation and benefits, including incentive compensation and historical turnover;
  - [operating_expenses.bc02127c] Non-provider salaries, wages, and benefits, including incentive compensation;
  - [operating_expenses.026371b2] Owner compensation and benefits;
  - [operating_expenses.1799cc86] Treatment supplies, including key suppliers and purchasing terms;
  - [operating_expenses.8ba63b91] Center-level costs and sub-leasing arrangements;
  - [operating_expenses.2b0d7609] Insurance expense;
  - [operating_expenses.c82f4b43] Selling, general and administrative/corporate expenses;
  - [operating_expenses.1b1dbaaf] Overhead allocations; and
  - [operating_expenses.2f84bb9e] Unusual and extraordinary items.
- [operating_expenses.7a862158] Obtain and read an analysis of the Target's selling, general and administration expenses and inquire about:
  - [operating_expenses.94e982ea] Salaries and wages (including headcount by area and function, if possible);
  - [operating_expenses.e77663f6] General and administrative expenses;
  - [operating_expenses.bb95eefb] Information systems expenses;
  - [operating_expenses.7303fc0e] Corporate costs and any allocations to store level as applicable; clarify expenses with
  - [operating_expenses.71741fa1] Extraordinary expenses;
  - [operating_expenses.21305b83] Rent and leases; and
  - [operating_expenses.19bbcd37] Miscellaneous and other expenses.

#### `working_capital`
- [working_capital.8b55e62e] Obtain and read an analysis of working capital on a monthly basis. Inquire about historical trends, including seasonality, fluctuations in key metrics such as days revenue outstanding, days payable outstanding, and working capital as a percent of trailing revenue, and other significant items.
- [working_capital.4165c9fc] Summarize historical working capital in the business including:
  - [working_capital.5d4c6dfc] The composition of individual working capital accounts (e.g. trade receivables, inventory, accounts payable and accruals, etc.);
  - [working_capital.af6475e6] Working capital trends and impact on reported metrics;
  - [working_capital.0ac41761] Large, unusual or non-operating items that may have affected normal working capital trends, (such as accruals for bonuses, understanding non-trade balances, etc.);
  - [working_capital.0503bdc8] Understanding the accounting impact of allowance for uncollectible amounts, provisions, and other accruals requiring judgment;
  - [working_capital.147570f0] Working capital seasonality; and
  - [working_capital.461288bb] Historical trends in key working capital metrics.

#### `accounts_receivable`
- [accounts_receivable.2835c711] Obtain and read an analysis of Target's accounts receivable and inquire about:
  - [accounts_receivable.d96042fd] Aging analysis by center by payor;
  - [accounts_receivable.fbb62432] Contractual allowances;
  - [accounts_receivable.ed1bfad6] Allowance for doubtful accounts and write-offs;
  - [accounts_receivable.e63565b2] Prior period accounts receivable adjustments;
  - [accounts_receivable.346357be] Self-pay and credit balances;
  - [accounts_receivable.a9505679] Collection experience; and
  - [accounts_receivable.a1663291] Other reserves and adjustments.
  - [accounts_receivable.feef51c3] Aging analysis and related credit terms (including special terms);
  - [accounts_receivable.5cb1f889] Allowance for uncollectible accounts and write-offs; and
  - [accounts_receivable.fcc39c9d] Reserve and adjustments.

#### `inventory`
- [inventory.a42c8e1b] Obtain and read an analysis of Target's inventory and inquire and comment on:
  - [inventory.56d98157] The inventory valuation methodology (e.g. standard costing);
  - [inventory.e09c72ae] Significant vendor allowances, rebates, allowances and/or purchase commitments and related programs;
  - [inventory.db8a7492] Return to vendor provisions;
  - [inventory.1556d2bb] Inventory aging and estimated provision, if any (i.e. slow-moving inventory).

#### `accounts_payable_and_accrued_liabilities`
- [accounts_payable_and_accrued_liabilities.f18f19ae] Obtain and read an analysis of Target's accounts payable and accrued liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.6ebfbf64] Accounts payable aging;
  - [accounts_payable_and_accrued_liabilities.30ed4d88] Deferred revenue; and
- [accounts_payable_and_accrued_liabilities.e1a134cd] Obtain and read an analysis of Target's accounts payable and accrued expenses and inquire about:
  - [accounts_payable_and_accrued_liabilities.3b0c591f] AP aging analysis, terms of trade with major vendors and days payables outstanding;
  - [accounts_payable_and_accrued_liabilities.2f78b26a] Accrued expenses; and

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.3a46fc68] Obtain and read an analysis of Target's fixed assets, capital expenditures, and other assets and inquire about:
  - [capital_expenditure_requirements.e27811e6] Historical, deferred and planned capital expenditures;
  - [capital_expenditure_requirements.fd1bbc63] Capitalized internal labor;
  - [capital_expenditure_requirements.271723dd] Under-utilized assets; and
  - [capital_expenditure_requirements.317ef48f] Impairment write-downs and issues.
- [capital_expenditure_requirements.91aa3e29] Obtain and read an analysis of historical and future capital cost requirements including:
  - [capital_expenditure_requirements.64ded187] Fixed asset continuity schedules (including significant additions and disposals);
  - [capital_expenditure_requirements.d4547e5f] Maintenance versus growth capital expenditures; and
  - [capital_expenditure_requirements.54a9bc56] Planned, committed, and deferred capital expenditures.

#### `waterfall_revenue_analysis`
- [waterfall_revenue_analysis.3172c0a7] If available, obtain patient/encounter-level detail from the billing and collections systems utilized by Target to perform a claims-level revenue analysis reflecting net cash received on closed claims, and estimated cash expected to be received on open claims (based on historical reimbursement trends). Discuss with management:
  - [waterfall_revenue_analysis.080597bd] Drivers of monthly/quarterly/annual net revenue trends:
    - [waterfall_revenue_analysis.55e9f226] By location (8 clinic locations and 2 de novo locations);
    - [waterfall_revenue_analysis.e88f19b0] By significant payor; and
    - [waterfall_revenue_analysis.945bdd2a] By significant service code.
    - [waterfall_revenue_analysis.30d1305e] Reimbursement trends by payor, by service, and by location;
    - [waterfall_revenue_analysis.3bbf8e95] Pricing/volume trends by location by payor by service;
    - [waterfall_revenue_analysis.d3624cb9] Payor mix in total and by location;
    - [waterfall_revenue_analysis.648baf3c] Trends and drivers of fluctuation in the cash collection cycle;
    - [waterfall_revenue_analysis.e60e106e] Reconciliation of cash collections reported in the billing system to third-party bank statements (on a sample basis);
    - [waterfall_revenue_analysis.fb04865f] Reconciliation of billing and collection information to financial statements; and
- [waterfall_revenue_analysis.7e98d567] Bridge revenue for the following changes:
  - [waterfall_revenue_analysis.728490e9] Patient volumes;
  - [waterfall_revenue_analysis.d70c9701] Same store, de novo, and acquired facilities; and
  - [waterfall_revenue_analysis.31c4f22a] Changes in direct and indirect operating expense

### hvac

- `accounting_overview`: parents 2, child bullets 7, max depth 2
- `business_overview`: parents 1, child bullets 4, max depth 2
- `quality_of_earnings`: parents 3, child bullets 12, max depth 2
- `operating_expenses`: parents 3, child bullets 34, max depth 3
- `working_capital`: parents 1, child bullets 3, max depth 2
- `accounts_receivable`: parents 1, child bullets 8, max depth 2
- `inventory`: parents 1, child bullets 3, max depth 2
- `accounts_payable_and_accrued_liabilities`: parents 2, child bullets 9, max depth 2
- `capital_expenditure_requirements`: parents 1, child bullets 2, max depth 2

#### `accounting_overview`
- [accounting_overview.4dd895e1] Understand the Target's financial statement preparation process including:
  - [accounting_overview.575d1270] Finance function, financial reporting framework, and management reporting relationships; (including process, timing, structure of financial reporting, and interaction with the information/ accounting systems);
  - [accounting_overview.e4eafed3] Reconciliation of management's internal financial reporting packages to the audited financial statements; and
- [accounting_overview.2a6d0bac] Read the audit workpapers for the Historical Period
- [accounting_overview.985c8ea5] Read Target's financial statements and discuss them with Target's management to gain an understanding of accounting policies and practices including:
  - [accounting_overview.da83d3d0] Reporting methodology;
  - [accounting_overview.7bc1af7c] Intercompany transactions and cost allocations;
  - [accounting_overview.284721db] Revenue recognition policies and billing practices;
  - [accounting_overview.4194a013] Significant accounting estimates; and
  - [accounting_overview.22225206] Recent or contemplated changes in accounting principles.

#### `business_overview`
- [business_overview.fa6ea0ae] Obtain background information of Target, including its:
  - [business_overview.3037e36a] Organizational structure, ownership and management reporting relationships;
  - [business_overview.ecc8613c] Product / service offerings;
  - [business_overview.1e9a6def] Range of customer segments and regions served; and
  - [business_overview.6d09d9ad] Financial reporting and information systems (including process, timing, structure of financial reporting, and interaction with the information/accounting systems).

#### `quality_of_earnings`
- [quality_of_earnings.60da6c64] Based on the analysis and discussion with the sell-side due diligence advisor, comment on Management's proposed adjustments to reported EBITDA (i.e. Executive compensation changes, personal expenses, one-time / non-recurring items, out-of-period adjustments, truck recovery rate increases, other etc.) and inquire about the nature and rationale of such adjustments and supporting documentation;
- [quality_of_earnings.c2c4c2db] Perform a traffic light assessment of Management and sell-side proposed adjustments;
- [quality_of_earnings.daf858d2] Propose any significant adjustments identified that are not reflected in the sell-side Quality of Earnings analysis; and
- [quality_of_earnings.1c32698d] Comment on any potential findings that could have material impacts to enterprise / equity value.
- [quality_of_earnings.67e5bbf6] Obtain details on the Company's historical financial performance and propose potential adjustments to historical earnings before interest taxes, depreciation, amortization ("EBITDA") for the periods noted earlier by considering:
- [quality_of_earnings.ec7af1bf] Understand the impact of and validate adjustments identified by management and its financial sponsor ownership, including adjustments made for bank covenant purposes
- [quality_of_earnings.2cc2d6f5] Identify other abnormal, non-recurring and extraordinary one-time adjustments
- [quality_of_earnings.f9873e40] Related party transactions – Enquire into the existence and appropriateness of related party transactions and balances and their impact on reported results going forward, including those with shareholders, management and affiliated companies
- [quality_of_earnings.e2c3f2e0] Consider movements in significant balance sheet accounts with a focus upon the nature, composition and basis of valuation of these accounts particularly around judgmental areas that would impact EBITDA (e.g. reserves and other accruals, inventory costing, accounts receivable, etc.).
- [quality_of_earnings.5e14edaa] Analyze the impact of COVID-19 on the Company's EBITDA from both revenue (e.g.: increase / decrease in demand) and cost perspectives (e.g.: personal protective equipment costs, office costs, etc.)
- [quality_of_earnings.607e2bea] Analyze the one-time impact of elevated inflation, tight labor market and elevated absenteeism
- [quality_of_earnings.8e8dda57] Understand impact of cost allocations (as listed in the Target's internal management reporting package)
- [quality_of_earnings.1ed75aa7] Impact of cash vs. GAAP costs for the following:
  - [quality_of_earnings.dc7023e2] pension expense (non-cash services costs - if applicable)
  - [quality_of_earnings.3a01a8ed] Bonuses (actually paid out vs expensed)
  - [quality_of_earnings.bdf12964] Bad debt (expense vs actual write-offs)
  - [quality_of_earnings.0cb93686] Warranty expense (actual claims)
  - [quality_of_earnings.3a6a39ad] Non-cash compensation (for Profits Interest Units)
  - [quality_of_earnings.8f273993] Normalization of vendor purchaser rebates (to the extent required)
- [quality_of_earnings.86204361] Analyze the pro forma impact of:
  - [quality_of_earnings.4be211ae] Pre-acquisition results (on an adjusted basis) on acquired businesses (AB May in the Historical Period)
  - [quality_of_earnings.64d29346] Updated Pricing Agreements with Customers
  - [quality_of_earnings.5eea84a6] Quantifiable synergies that management has identified and believe are applicable (i.e. on prior acquisitions)
  - [quality_of_earnings.4d3d0582] Retained costs sitting within Corporate
- [quality_of_earnings.e8c15918] Understand impact of Quality of Earnings adjustments on the the Historical Period budget
- [quality_of_earnings.b75d93a1] Quality of earnings – To the extent not covered by the sell-side due diligence report. Assessment of any subsequent roll-forward of the sell-side quality of earnings report (if available) and propose potential incremental adjustments identified by considering:
  - [quality_of_earnings.756f847c] Management's proposed adjustments to reported EBITDA;
  - [quality_of_earnings.27b454ec] The impact of revenue accounting and accounting / cash timing differences including:
- [quality_of_earnings.2fd43e96] Understand application of revenue recognition policies, specifically POC, including consistency of application and period end true-ups that may skew financial results; and
- [quality_of_earnings.475389ee] Understand any timing differences between revenue recognition, cash collections and accrual adjustments.
- [quality_of_earnings.b683d012] The impact of any changes to senior management or team structure;
- [quality_of_earnings.ff55679c] The impact of any changes to pricing models;
- [quality_of_earnings.15044ee4] The impact of any changes in labour costs;
- [quality_of_earnings.93bd6c4a] The impact of commodity prices, pricing lags and pass-through mechanisms;
- [quality_of_earnings.1f48064c] The impact of foreign exchange (if any);
- [quality_of_earnings.37280bf1] The pro forma impact of new by geography Branch;
- [quality_of_earnings.63349540] The impact of any key supplier cost arrangements;
- [quality_of_earnings.178a08a3] The impact of settlements related to litigation, if any; and
- [quality_of_earnings.5ee142e8] The impact of cash to accrual accounting and other potential items discovered in the due diligence process.

#### `operating_expenses`
- [operating_expenses.e1731b2d] Obtain and read an analysis of Target's cost of sales and operating expenses and inquire about:
  - [operating_expenses.e92d6ce2] Direct costs (labor, commissions, materials, equipment, warranty & other costs)
  - [operating_expenses.5d2eba3b] Advertising and marketing
  - [operating_expenses.67eb9ba4] Bank fees and collections
  - [operating_expenses.af1b2dbe] Communications
  - [operating_expenses.8be612d9] Employee benefits / insurance liabilities
  - [operating_expenses.bc458f61] Meals and entertainment
  - [operating_expenses.7fd30738] Management fees and other corporates overheads
  - [operating_expenses.7662c5dc] Professional services
  - [operating_expenses.e9b3ccba] Rent and utilities
  - [operating_expenses.9452fa22] Tools & equipment
  - [operating_expenses.1c6ca9ef] Training and education
  - [operating_expenses.80b303bb] Vehicle expenses
  - [operating_expenses.32b2f2ce] Wages
  - [operating_expenses.04a9f127] Historical operating expense trend as a % of revenue; and
  - [operating_expenses.12e900b7] Restructuring, unusual and extraordinary items.
- [operating_expenses.1f86cc00] Obtain and read an analysis of Target's operating expenses and inquire about:
  - [operating_expenses.e85469fe] Employee compensation and benefits:
    - [operating_expenses.e03bbdae] Headcount and average compensation costs;
    - [operating_expenses.7e081cc4] Turnover and average tenure of employees at key locations over time;
    - [operating_expenses.2fdcdc9b] Accrued employee obligations and other provisions;
    - [operating_expenses.9c61c175] Severance / commitments, if any; and
    - [operating_expenses.30e0b001] Incentive based compensation.
    - [operating_expenses.e5c40611] Fixed vs. variable expense analysis;
    - [operating_expenses.f225de82] Effectiveness of sales and marketing programs;
    - [operating_expenses.521461e7] Insurance; and
    - [operating_expenses.462c362d] Other operating and SG&A expenses.

#### `working_capital`
- [working_capital.290452e6] Analyze the company's historical monthly working capital patterns and consider an appropriate “target working capital” peg for purposes of a purchase price adjustment mechanism; and assess the level of working capital required to support future growth.
- [working_capital.57794119] Analyze the composition of individual working capital accounts and monthly working capital trends including working capital days metrics (i.e. DSO and DPO).
- [working_capital.c862a857] Identify potential adjustments for large non-recurring, unusual or non-operating items that may have affected normal working capital trends, (such as accruals for bonuses, non-trade balances, etc.)
- [working_capital.60258a78] Summarize and normalize historical working capital in the business including:
  - [working_capital.22d28bb2] Commenting on the working capital trends, for the respective period;
  - [working_capital.e6c48d71] Understanding key drivers (i.e., seasonality, accounts payable days, days sales outstanding, inventory days); and
  - [working_capital.4a21d610] Identifying large or unusual non-recurring items that may have impacted normal working capital trends including potential items identified within the quality of earnings analysis noted above.

#### `accounts_receivable`
- [accounts_receivable.2835c711] Obtain and read an analysis of Target's accounts receivable and inquire about:
  - [accounts_receivable.d6f205ca] Aging analysis by customer
  - [accounts_receivable.78577942] Historical write-offs
  - [accounts_receivable.aec0d3b8] Allowance for Doubtful accounts roll forward
  - [accounts_receivable.0cf82649] Credit balances and refund policies; and
  - [accounts_receivable.d12965fb] Other adjustments.
  - [accounts_receivable.feef51c3] Aging analysis and related credit terms (including special terms);
  - [accounts_receivable.5cb1f889] Allowance for uncollectible accounts and write-offs; and
  - [accounts_receivable.fcc39c9d] Reserve and adjustments.

#### `inventory`
- [inventory.4306edf1] Obtain and read an analysis of Target's inventory and inquire about:
  - [inventory.ae1d07ee] Aging analysis by component
  - [inventory.78577942] Historical write-offs
  - [inventory.82febbea] Inventory provision roll forward including methodology and calculation

#### `accounts_payable_and_accrued_liabilities`
- [accounts_payable_and_accrued_liabilities.ea951abc] Obtain and read an analysis of Target's current liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.6ebfbf64] Accounts payable aging;
  - [accounts_payable_and_accrued_liabilities.a13e19c3] Accrued liabilities including roll forward of major accounts;
  - [accounts_payable_and_accrued_liabilities.171121ad] Accrued payroll and PTO liability;
  - [accounts_payable_and_accrued_liabilities.d94ee706] Deferred revenue.
- [accounts_payable_and_accrued_liabilities.4044ce53] Obtain and read an analysis of Target's accounts payable, accrued liabilities and other current liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.bede7f07] AP aging analysis and days outstanding;
  - [accounts_payable_and_accrued_liabilities.eb756bbb] Terms of trade with major vendors;
  - [accounts_payable_and_accrued_liabilities.2219f11d] Revenue arrangements and timing of payments;
  - [accounts_payable_and_accrued_liabilities.8de5216c] Payroll related funding and timing of cash flows;
  - [accounts_payable_and_accrued_liabilities.193d19bd] Cadence and consistency of bonus/commission and other incentive compensation; and

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.5d0f6125] Obtain and read an analysis of Target's existing capital costs and inquire about:
  - [capital_expenditure_requirements.e9287efa] Other historical, deferred, and planned capital expenditures; and
  - [capital_expenditure_requirements.317ef48f] Impairment write-downs and issues.

### manufacturing

- `business_overview`: parents 3, child bullets 23, max depth 2
- `accounting_overview`: parents 1, child bullets 3, max depth 2
- `quality_of_earnings`: parents 3, child bullets 22, max depth 2
- `vdd_report_review`: parents 1, child bullets 7, max depth 2
- `revenue_analysis`: parents 3, child bullets 17, max depth 3
- `operating_expenses`: parents 4, child bullets 23, max depth 3
- `normalized_ebitda_bridges`: parents 1, child bullets 4, max depth 2
- `working_capital`: parents 1, child bullets 3, max depth 2
- `accounts_receivable`: parents 2, child bullets 6, max depth 2
- `accounts_payable_and_accrued_liabilities`: parents 2, child bullets 6, max depth 2
- `inventory`: parents 3, child bullets 18, max depth 2
- `capital_expenditure_requirements`: parents 1, child bullets 3, max depth 2
- `prepaids`: parents 1, child bullets 1, max depth 2
- `related_party_transactions`: parents 1, child bullets 2, max depth 2

#### `business_overview`
- [business_overview.5d8c69bd] Meet with the Company's officers and management in order to develop an understanding of the Company, including its:
  - [business_overview.db66455a] History, organization structure, proposed transaction perimeter and management reporting relationships;
  - [business_overview.c0a127e6] Start-up costs, capital expenditures, and status of operations in Morocco;
  - [business_overview.aa6425c7] Intercompany transactions;
  - [business_overview.36d1bb53] Production sites/ lines capacity, utilization rates;
  - [business_overview.650e5cf8] Details of pricing methodology; key contractual terms with key customers (incl. ability to pass cost increases to customers);
  - [business_overview.30220a02] Range of suppliers, significant dependencies; key contractual terms; price volatility for key materials; inventory levels and turnover;
  - [business_overview.eae0be8d] Range of customer segments, customer concentration and regions served;
  - [business_overview.8b233c26] Key performance metrics used by the Company's management;
  - [business_overview.de8fcffd] Employees compensation and benefits by major categories;
  - [business_overview.ca9068cb] Financial reporting framework and information systems; monthly/annual cut-off process; and
  - [business_overview.faeb72dc] Key accounting policies including: revenue recognition, inventory valuation methodologies, costing methodology, warranties, provisions, management estimates, etc.
- [business_overview.72dcdc61] Read available information and discuss with Target management in order to develop an understanding of Target, including its:
  - [business_overview.637b8168] Inter-group operations and allocation of corporate overheads;
  - [business_overview.a7dec941] Production lines capacity, utilization, scrap rates;
  - [business_overview.fb1f793e] Range of products and services; degree of customization; pricing methodology (including volume discounts/ rebates); key contractual terms (incl. ability to pass cost increases to customers);
  - [business_overview.1d606acf] Research activities and new product development initiatives;
  - [business_overview.fe4a8fe4] Range of suppliers, significant dependencies; key contractual terms; price volatility for key raw materials (resin, etc.);
  - [business_overview.74bd931e] Marketing and distribution channels;
  - [business_overview.be35606a] Key performance metrics used by Target's management;
  - [business_overview.c5cf8b75] Financial reporting framework and information systems;
  - [business_overview.c2c06658] Key accounting policies including: revenue recognition, inventory valuation methodologies, costing methodology, sales returns, rebates, provisions, management estimates, etc.
- [business_overview.fa6ea0ae] Obtain background information of Target, including its:
  - [business_overview.3037e36a] Organizational structure, ownership and management reporting relationships;
  - [business_overview.37e08375] Range of products, customer segments and regions served; and
  - [business_overview.6d09d9ad] Financial reporting and information systems (including process, timing, structure of financial reporting, and interaction with the information/accounting systems).

#### `accounting_overview`
- [accounting_overview.985c8ea5] Read Target's financial statements and discuss them with Target's management to gain an understanding of accounting policies and practices including:
  - [accounting_overview.da83d3d0] Reporting methodology;
  - [accounting_overview.edc04d59] Frequency of standard cost updates and procedures for analyzing variances;
  - [accounting_overview.22225206] Recent or contemplated changes in accounting principles.

#### `quality_of_earnings`
- [quality_of_earnings.a69653dc] Based on the analysis and discussion with the sell-side due diligence advisor sell-side advisor, comment on Management's proposed adjustments to reported EBITDA and inquire about the nature and rationale of such adjustments and supporting documentation;
- [quality_of_earnings.c3af8ead] Perform a traffic light assessment of Management and sell-side proposed adjustments; and
- [quality_of_earnings.637e84ec] Propose any significant adjustments identified that are not reflected in the sell-side Quality of Earnings analysis.
- [quality_of_earnings.9bd70caf] Summarize potential adjustments identified regarding the earnings of the Company in the form of a quality of earnings analysis, summarizing the risks that may impact revenue and/or earnings before interest, taxes, depreciation and amortization ("EBITDA") including:
  - [quality_of_earnings.089c3ac2] Normalization adjustments identified by Management (i.e., Morocco start-up costs, FX gains and losses, non-recurring costs, etc.);
  - [quality_of_earnings.98b8fc3d] The impact of research and development expenditures;
  - [quality_of_earnings.46f6ee80] The impact of provisions, management estimates, adjusting entries, or changes in accounting policies on reported results; and
  - [quality_of_earnings.a759c616] Related party transactions and the pricing thereof.
  - [quality_of_earnings.46d979fc] Any other large, unusual or non-recurring events or transactions that may have distorted results and not identified by management in the financial statements; and
- [quality_of_earnings.b363beff] Summarize potential adjustments identified regarding the earnings of Target in the form of a quality of earnings analysis, summarizing the risks that may impact revenue and/or earnings before interest, taxes, depreciation and amortization ("EBITDA") including:
  - [quality_of_earnings.2419a98c] Normalization adjustments presented in the VDD Report;
  - [quality_of_earnings.c2788680] The impact of any changes in accounting policies;
  - [quality_of_earnings.d5812ed8] The impact of foreign exchange including constant currency analysis;
  - [quality_of_earnings.eb9c6681] Related party transactions and the pricing thereof;
  - [quality_of_earnings.e1e4e51b] Recent changes to the business to understand the run-rate EBITDA impact (e.g. brand development and marketing expenses, business expansion into other product segments, impacts of capex investment etc.);
  - [quality_of_earnings.4101a051] Any other large, unusual or non-recurring events or transactions that may have distorted results and not identified by management in the financial statements (e.g. non-recurring purchase orders; potential business disruption due to COVID-19); and
- [quality_of_earnings.cae478aa] Identify potential adjustments to reported earnings before interest, income taxes, depreciation, and amortization ("EBITDA") by considering the impact of:
  - [quality_of_earnings.629f0059] Management's proposed adjustments to reported EBITDA (e.g. out-of period inventory adjustments, non-recurring professional fees, Dot customer normalizations etc.);
  - [quality_of_earnings.baff5927] The impact of acquisitions (e.g. acquired businesses);
  - [quality_of_earnings.d5d2fd96] The impact of supply chain disruptions, if any;
  - [quality_of_earnings.efed2d7d] The timing of true-ups and other adjustments made less frequently than monthly;
  - [quality_of_earnings.b683d012] The impact of any changes to senior management or team structure;
  - [quality_of_earnings.d708ee9d] The impacts of foreign exchange including constant currency analysis;
  - [quality_of_earnings.9f38807d] The impact of commodity / raw material cost fluctuations and any associated hedging programs;
  - [quality_of_earnings.89015a40] The impact of any key supplier cost arrangements including assessment of hedged vs. market prices and illustrative impacts to EBITDA;
  - [quality_of_earnings.df959b7e] The impact of lease renewal;
  - [quality_of_earnings.456a4714] The impact of related party transactions (i.e. non-fair market pricing, personal expenses, donations etc.); and
  - [quality_of_earnings.d8e7c7da] Other potential items discovered in the due diligence process.

#### `vdd_report_review`
- [vdd_report_review.9ccad49b] Read the VDD Report and any available updates and discuss with sell-side advisor and comment on significant areas including the following:
  - [vdd_report_review.68d4c096] Management proposed adjustments to reported EBITDA (i.e. market rent, non-recurring items, customer chargebacks, contracted services, director fees, bad debt expenses etc.);
  - [vdd_report_review.f4134c61] Completeness of the scope of work, any scope restrictions encountered, and out-of-scope areas;
  - [vdd_report_review.01aafb6d] Transaction perimeter;
  - [vdd_report_review.2460ba6a] Extent of access to management, quality of information available, and depth of analysis performed;
  - [vdd_report_review.3a9e4289] Procedures performed to form views on the appropriateness of Target's inventory valuation methodologies;
  - [vdd_report_review.80bbd42e] Views on the perceived accuracy of the monthly/annual cut-off process; and
  - [vdd_report_review.ec5394fa] Key financial risks and uncertainties with potential impact to value.

#### `revenue_analysis`
- [revenue_analysis.8f7eeb15] Revenue and margin trends by customer, program, SKU, and product category:
  - [revenue_analysis.a84a1953] Breakdown of costs of goods sold including: materials, scrap/waste, labour expense, manufacturing overhead, packing and outbound freight for product sales; and
  - [revenue_analysis.34978493] Ability to pass through changes in the cost of raw material and other inputs.
- [revenue_analysis.22d8a89d] Obtain a comprehensive view of revenue, value add and contribution margin (pending data availability) by product line and by customer. Obtain the analysis and underlying transactional data (manufacturing orders database), if available, and gain an understanding of the major trends in revenue and margins addressing areas including:
  - [revenue_analysis.3583d2f5] Historical revenues (gross, net, volume), value add, contribution, average selling price and average cost per lbs by:
    - [revenue_analysis.39af40e5] product line (e.g. by décor, technology, packaging format, resin type, category/ SKU grouping, sales channel, order size, if available); additional services (if applicable);
    - [revenue_analysis.4d84c51d] Breakdown of cost of sales including: raw materials, labels (if applicable), scrap/waste/expired ingredients, packaging materials, freight-in, labour expense, manufacturing overhead, packing and outbound freight for product sales.
    - [revenue_analysis.cce13fa4] Revenue and gross margin by plant;
    - [revenue_analysis.9410f12e] Revenue and gross margin by brand;
    - [revenue_analysis.b1de9b90] Revenue and gross margin by product category (bread, frozen dough rolls, garlic toast, cookies, muffins etc.);
    - [revenue_analysis.653f61d3] Revenue and gross margin by SKU;
    - [revenue_analysis.452fac7e] Raw material costs including hedging programs and high level evaluation of embedded inventory gains and/or losses; and

#### `operating_expenses`
- [operating_expenses.1fe7541b] Obtain and read an analysis of Company's operating expenses and SG&A and inquire about and comment on:
  - [operating_expenses.efb77196] Salaries and benefits (including headcount and average compensation costs, incentive-based compensation, severance, other), and any capitalization of costs;
  - [operating_expenses.fc6d94b0] Occupancy costs;
  - [operating_expenses.c2e65113] Repairs and maintenance;
  - [operating_expenses.466d6b0a] General and administration costs;
  - [operating_expenses.b4fec557] Key suppliers and contractual arrangements;
  - [operating_expenses.11b83cf3] Research and development activities and costs; and
  - [operating_expenses.2f84bb9e] Unusual and extraordinary items.
- [operating_expenses.3b0b98ef] Obtain and read an analysis of Target's operating expenses and SG&A and inquire about and comment on:
  - [operating_expenses.ce6013e8] Breakdown and historical trends of operating costs;
  - [operating_expenses.72877e20] Personnel costs;
  - [operating_expenses.f0244e42] Advertising, sales and marketing;
  - [operating_expenses.e695880e] Professional fees;
  - [operating_expenses.60dec6e3] Analysis of fixed and variable costs of the business; and
- [operating_expenses.1f86cc00] Obtain and read an analysis of Target's operating expenses and inquire about:
  - [operating_expenses.23473320] High-level overview of employee compensation and benefits including:
    - [operating_expenses.e03bbdae] Headcount and average compensation costs;
    - [operating_expenses.2fdcdc9b] Accrued employee obligations and other provisions;
    - [operating_expenses.2e4ededf] Severance / commitments, if any;
    - [operating_expenses.d0d2e710] Incentive based compensation;
    - [operating_expenses.30756ddc] Flag any material gaps in headcount; and
- [operating_expenses.ac448b41] Reconcile employee census to the financial statements.
- [operating_expenses.ecda5951] Rent and logistics;
- [operating_expenses.f411a18c] Food safety and quality costs;
- [operating_expenses.1c4fdc05] Research and development costs;
- [operating_expenses.415c31ba] Selling expenses;
- [operating_expenses.9109482e] Fixed vs. variable expense analysis; and
- [operating_expenses.ddad38d1] Other operating and G&A expenses.

#### `normalized_ebitda_bridges`
- [normalized_ebitda_bridges.036f2643] Summarize and prepared normalized EBITDA bridges from:
  - [normalized_ebitda_bridges.2c480b6e] the Historical Period to the Historical Period;
  - [normalized_ebitda_bridges.8fe85ba5] YTD23 to YTD24;
  - [normalized_ebitda_bridges.42808878] YTD24 to the Historical Period forecast; and
  - [normalized_ebitda_bridges.169e10ac] the Historical Period forecast to the Historical Period budget.

#### `working_capital`
- [working_capital.afc94912] Summarize and normalize historical working capital in the business, including:
- [working_capital.61f39406] Comment on the historical working capital trends;
- [working_capital.c5402cbd] Understand key drivers and trade ratio trends (i.e. seasonality, days sales outstanding, days inventory outstanding, accounts payable days, etc.);
- [working_capital.c5e71ebf] Accrued liabilities and prepaid expenses;
- [working_capital.db0e9471] Large or unusual non-recurring items that may have impacted normal working capital trends including potential items identified within the quality of earnings analysis noted above;
- [working_capital.28e3ffb5] Historical impact from acquisitions and associated normalizations; and
- [working_capital.ae7ad51c] Recommend approaches to determine a normalized net working capital target/peg.
- [working_capital.afdb044c] Payroll related funding and timing of cash flows; and
- [working_capital.5bf47dd2] Large or unusual non-recurring items that may have impacted normal working capital trends including potential items identified within the quality of earnings analysis noted above.
- [working_capital.60258a78] Summarize and normalize historical working capital in the business including:
  - [working_capital.22d28bb2] Commenting on the working capital trends, for the respective period;
  - [working_capital.2f05d8db] Understanding key drivers (i.e., seasonality, accounts payable days, days sales outstanding, days inventory outstanding); and
  - [working_capital.4a21d610] Identifying large or unusual non-recurring items that may have impacted normal working capital trends including potential items identified within the quality of earnings analysis noted above.

#### `accounts_receivable`
- [accounts_receivable.368bc2e9] Obtain and read an analysis of accounts receivable and inquire and comment on:
  - [accounts_receivable.16339118] Trade and non-trade (due from officers, stockholder, employees, affiliates, and other) balances;
  - [accounts_receivable.6448180b] Aging analysis by key customer and by customer type and turnover analysis;
  - [accounts_receivable.2261db76] Credit terms and any other special terms; and
- [accounts_receivable.2835c711] Obtain and read an analysis of Target's accounts receivable and inquire about:
  - [accounts_receivable.c78b66f0] Aging analysis and related credit terms (including special terms and changes thereto e.g. early payment discount elimination);
  - [accounts_receivable.5cb1f889] Allowance for uncollectible accounts and write-offs; and
  - [accounts_receivable.fcc39c9d] Reserve and adjustments.

#### `accounts_payable_and_accrued_liabilities`
- [accounts_payable_and_accrued_liabilities.1736f4f3] Obtain and read an analysis of accounts payable and accrued compensation and liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.8a4915dd] Accrued liabilities including (where possible) a basis for the adequacy of accruals for such items as bonuses, deferred compensation, severance, workers' compensation, commissions, vacation pay, litigation, customer returns, product liability, sales allowances and credits, and other;
  - [accounts_payable_and_accrued_liabilities.618ff42d] Vendor/supplier settlement terms; and
- [accounts_payable_and_accrued_liabilities.f18f19ae] Obtain and read an analysis of Target's accounts payable and accrued liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.bede7f07] AP aging analysis and days outstanding;
  - [accounts_payable_and_accrued_liabilities.eb756bbb] Terms of trade with major vendors;
  - [accounts_payable_and_accrued_liabilities.8de5216c] Payroll related funding and timing of cash flows;
  - [accounts_payable_and_accrued_liabilities.edb39bab] Cadence and consistency of bonus and other incentive compensation; and

#### `inventory`
- [inventory.6a5d06c2] Obtain and read an analysis of the Company's inventory and inquire and comment on:
  - [inventory.56930e09] Inventory costing methodology and its consistent and appropriate application during the historical period;
  - [inventory.4f732186] Inventory by category;
  - [inventory.88863c88] Inventory aging profile at each period-end date and historical write-offs;
  - [inventory.8906baa3] Inventory turnover trends; and
  - [inventory.978b52de] Slow-moving, excess, and obsolete inventory and provisioning methodology.
- [inventory.a42c8e1b] Obtain and read an analysis of Target's inventory and inquire and comment on:
  - [inventory.45fb1d71] Accounting policies relating to tracking and controlling of inventory;
  - [inventory.61418c3e] Inventory aging profile at each period-end date;
  - [inventory.975b1bc4] Inventory turnover trends;
  - [inventory.659aabe2] Key components of inventory and costs capitalized (i.e. product cost, labour, freight, other);
  - [inventory.ea9643ea] Slow-moving, excess, and obsolete inventory; and
  - [inventory.45799ffa] Spoilage and reserve calculations, if any.
- [inventory.4306edf1] Obtain and read an analysis of Target's inventory and inquire about:
  - [inventory.70b64e99] Composition by product category;
  - [inventory.0ad1359b] Inventory turnover by category;
  - [inventory.fafa2def] Aging, slow-moving, excess and obsolete inventory;
  - [inventory.a9f04eb8] Impairment and reserve calculations;
  - [inventory.e99296ec] Consistency of accounting practices related to inventory valuation;
  - [inventory.9a6490e4] Purchasing procedures; and
  - [inventory.9aa4e878] Vendor rebates and allowances.

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.5ccbd89d] Fixed asset continuity schedule showing additions and depreciation;
- [capital_expenditure_requirements.e521f763] Significant near-term required capex and deferred capex, if any; and
- [capital_expenditure_requirements.c609d0ab] Historical capital expenditures segregated between growth and maintenance.
- [capital_expenditure_requirements.8e325046] Significant near-term require capex and deferred capex, if any; and
- [capital_expenditure_requirements.5d0f6125] Obtain and read an analysis of Target's existing capital costs and inquire about:
  - [capital_expenditure_requirements.0f5bbfe9] Historical growth vs. maintenance capex;
  - [capital_expenditure_requirements.7cdb98c2] If any deferred and planned capital expenditures; and
  - [capital_expenditure_requirements.317ef48f] Impairment write-downs and issues.

#### `prepaids`
- [prepaids.60afa47e] Obtain and read an analysis of Target's prepaid expenses and inquire about:
  - [prepaids.16c58286] Composition of balances; and
- [prepaids.3f4ad5eb] Understand timing of cash flows vs. waterfall / timing of expense recognition.

#### `related_party_transactions`
- [related_party_transactions.d7f1f44a] Inquire about and summarize related party transactions including:
  - [related_party_transactions.dfc89b43] Nature and extent of related party transactions; and
  - [related_party_transactions.bc1a9b8e] Basis of pricing for arrangements with related parties.

### prof_services

- `business_overview`: parents 1, child bullets 6, max depth 2
- `quality_of_earnings`: parents 1, child bullets 20, max depth 2
- `revenue_analysis`: parents 1, child bullets 7, max depth 2
- `operating_expenses`: parents 1, child bullets 2, max depth 2
- `accounts_receivable`: parents 1, child bullets 4, max depth 2
- `net_debt`: parents 1, child bullets 7, max depth 2
- `capital_expenditure_requirements`: parents 1, child bullets 3, max depth 2
- `budget`: parents 1, child bullets 3, max depth 2

#### `business_overview`
- [business_overview.8f0c722f] Read available information and meet with Target's officers in order to develop an understanding of Target, including its:
  - [business_overview.06539c60] Organization structure and management reporting relationships;
  - [business_overview.981d048d] Significant accounting estimates including percentage of completion ("POC") revenue; and
  - [business_overview.5aff1e37] Finance function and financial reporting framework including the financial planning and analysis function.
  - [business_overview.e5cd62e9] Significant accounting estimates including percentage of completion ("POC") revenue;
  - [business_overview.5b176787] Basis of financial information including financial reporting, cost allocation methodologies and consistency in accounting policies; and
  - [business_overview.74d754db] Finance function.

#### `quality_of_earnings`
- [quality_of_earnings.81092f25] Subject to information availability, propose potential adjustments to historical earnings before interest taxes, depreciation, and amortization ("EBITDA") by considering:
  - [quality_of_earnings.4776fe2c] The validity of adjustments identified by the Sellers and their advisors (including wage normalizations, discretionary expenses, and other non-recurring items)
  - [quality_of_earnings.249fdcc2] Sustainability of margins (including the impact of changes in POC estimates on the Target's earnings)
  - [quality_of_earnings.acc138b7] Impact of COVID-19
  - [quality_of_earnings.4723d7ae] Changes in Owners' remuneration
  - [quality_of_earnings.ca24d420] Impact of FX rates
  - [quality_of_earnings.a4d2e50c] Impact of provisions (including bad debt provisions, claims on contracts and loss making contracts), management estimates or adjusting entries on reported results
  - [quality_of_earnings.8055d3cb] Operational cash flows not captured within EBITDA (capitalized software costs, leases capitalized etc.)
  - [quality_of_earnings.c5d7d1c3] Related party transactions (including rent of premises)
  - [quality_of_earnings.3ba22efd] Any other large, unusual or non-recurring events or transactions that may have distorted results
  - [quality_of_earnings.d10a1378] EBITDA bridge to understand key drivers of EBITDA changes
  - [quality_of_earnings.0f6ec3b2] The validity of adjustments identified by the Sellers and their advisors, if any;
  - [quality_of_earnings.73edcbb3] Sustainability of margins (including the impact of changes in POC estimates on the Target's earnings);
  - [quality_of_earnings.a92fabf3] Impacts of COVID-19;
  - [quality_of_earnings.46eb7131] Pro forma impact of changes in Members/Partners' remuneration, including validation of Sellers estimate via benchmarking exercise outlined below;
  - [quality_of_earnings.88578345] arve-out considerations (costs related to US and China operations);
  - [quality_of_earnings.47f53dcf] Impact of US royalties;
  - [quality_of_earnings.e2667bc7] Impact of provisions (including bad debt provisions, claims on contracts and loss making contracts), management estimates or adjusting entries on reported results;
  - [quality_of_earnings.25bfcae1] Operational cash flows not captured within EBITDA (capitalized software costs, leases capitalized etc.);
  - [quality_of_earnings.bfe44059] Related party transactions; and
  - [quality_of_earnings.51322118] Any other large, unusual or non-recurring events or transactions that may have distorted results.

#### `revenue_analysis`
- [revenue_analysis.00dc965a] Obtain and read an analysis of the Target's revenues, direct expenses and margins, and inquire about:
  - [revenue_analysis.034f3db4] Gross-to-net revenue bridge, incl. payments to consultants and sub-contractors
  - [revenue_analysis.7bba2577] Revenue and margins by key customers / projects
  - [revenue_analysis.7179aa0b] POC and typical pross profit recognition pattern (i.e. allocation of profits between project phases)
  - [revenue_analysis.c630be70] Key performance indicators (proposal win-rates, personnel availability/utilization rates, billing rates)
  - [revenue_analysis.6e4b794f] Backlog including timing of realization
  - [revenue_analysis.fa732b11] Pipeline / opportunities including win probabilities.
  - [revenue_analysis.8e0a402b] Revenue and margins by key project

#### `operating_expenses`
- [operating_expenses.5d76f02a] Obtain and read an analysis of the Target's operating expenses and inquire about:
  - [operating_expenses.c1dd110d] Headcount and personnel costs including salaries, benefits, commissions, incentive plans
  - [operating_expenses.2f1efc5c] Lease costs, including lease contracts which are close to expiry and related renewal / relocation plans.

#### `accounts_receivable`
- [accounts_receivable.6c46d05d] Obtain and read an analysis of the Target's receivables and inquire about:
  - [accounts_receivable.29b5d1c9] Accounts receivable aging and days outstanding
  - [accounts_receivable.d7e90a13] Credit terms (including any special terms)
  - [accounts_receivable.e5776a8d] Trade and non-trade balances
  - [accounts_receivable.19f0ca09] Historical bad debt experience, allowance for uncollectible accounts and write-offs.

#### `net_debt`
- [net_debt.0157634b] Summarize and comment on net debt items reported and other potential debt-like items within the Transaction perimeter including:
  - [net_debt.e1f953d9] Lease liabilities
  - [net_debt.dcaf485d] Corporate taxes payable
  - [net_debt.6f8626b7] Derivative financial instruments
  - [net_debt.d4dd1b91] Non-operating accruals
  - [net_debt.450a03ff] Pending or threatened litigation or investigations
  - [net_debt.f802ec2b] Commitments contingencies and any other material off-balance sheet transactions
  - [net_debt.3b83aca6] Pension liabilities

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.12194905] Obtain and read an analysis of Target's property, plant and equipment capital expenditures and enquire about historical, deferred and planned capital expenditures including:
  - [capital_expenditure_requirements.d06fd315] Maintenance versus growth capex
  - [capital_expenditure_requirements.38c1c910] Other historical, deferred and planned capex
  - [capital_expenditure_requirements.421372b0] Impairment write-downs and other potential issues.

#### `budget`
- [budget.6a2119a5] Obtain a copy of the Target's the Historical Period budget, bridge / reconcile revenue and EBITDA from prior periods and inquire about significant assumptions and estimates, including:
  - [budget.7481576c] Revenue assumptions (including backlog, pipeline and opportunities)
  - [budget.45f9c4ab] Headcount and payroll assumptions
  - [budget.f0bdf833] Other direct and indirect cost structure

### real_estate

- `accounting_overview`: parents 1, child bullets 2, max depth 2
- `quality_of_earnings`: parents 1, child bullets 3, max depth 2
- `balance_sheet`: parents 3, child bullets 8, max depth 2

#### `accounting_overview`
- [accounting_overview.a80d63c5] Understand and summarize the financial statement preparation process, including:
  - [accounting_overview.c5657bc8] Significant accounting policies and estimates and contemplated changes; and
  - [accounting_overview.4fec4251] Reporting methodology (structure and process) and consolidation process, period ending process and related party transactions.

#### `quality_of_earnings`
- [quality_of_earnings.41956694] Summarize potential adjustments to historical Net operating income (“NOI”) on a consolidated basis by considering:
  - [quality_of_earnings.b7f205fc] Management’s proposed adjustments to reported NOI and inquire about the nature and rationale of such adjustments and supporting documentation, if any;
  - [quality_of_earnings.b683d012] The impact of any changes to senior management or team structure;
  - [quality_of_earnings.9573115e] The elimination of public company costs;
- [quality_of_earnings.7c18e0ae] Consider the pro forma impact of new units, lost units, acquired, developed, sold properties and expiring leases;
- [quality_of_earnings.deabb0e4] The pro forma impact consideration is contingent on readily available information from Target that summarizes its business trends such as revenue and margins by location, by community, by type, occupancy rates, lease rates, etc. for which the information has been reconciled to the Target’s financial statements and can be used to formulate the potential pro forma consideration. To the extent the information is not readily available or not transferrable to calculate a potential impact, we will discuss with Client the applicability of the impact and potential time effort to analyze accordingly.
- [quality_of_earnings.1182d5a2] The impact of provisions, management estimates, or adjusting entries on the reported results;
- [quality_of_earnings.0f6c851a] Any other unusual or non-recurring events (revenue or expenses) or transactions that may have distorted results; and
- [quality_of_earnings.d8e7c7da] Other potential items discovered in the due diligence process.

#### `balance_sheet`
- [balance_sheet.acc23736] Summarize and understand Target’s balance sheet profile:
- [balance_sheet.749cc335] Comment on the working capital trends, for the respective periods including unusual trends, unusual balances.
- [balance_sheet.948cdc50] Accounts receivable: Obtain and read an analysis of the Company’s accounts receivable and inquire about Rent receivable profile including aging analysis and provisions; other non-trade receivable balances.
- [balance_sheet.e9fb17dd] Other assets (i.e., prepaid expenses and deposits):
  - [balance_sheet.11770439] Accounts payable and accrued liabilities:
- [balance_sheet.a78f19f0] Obtain and read an analysis of the Company’s accounts payable and accrued expenses and inquire about:
  - [balance_sheet.49597c88] AP aging analysis, terms of trade with major vendors, days payables outstanding and trade payables aging analysis;
  - [balance_sheet.2f78b26a] Accrued expenses; and
  - [balance_sheet.b84da094] Tenant rental deposits
  - [balance_sheet.82973c08] If applicable, consider normalization adjustments to working capital.
- [balance_sheet.89c0722b] Understand the nature of investment properties and joint ventures;
- [balance_sheet.4896e374] Analyze historical capital expenditure trends
- [balance_sheet.a2d1b2f3] Understand the components of indebtedness including:
  - [balance_sheet.58cb9bf0] Net debt items presented by management and other potential debt-like items;
  - [balance_sheet.afb31759] Analysis of remaining liabilities surrounding contingent considerations; and
  - [balance_sheet.79fbbe73] Significant lease and purchase obligations.

### service

- `business_overview`: parents 1, child bullets 2, max depth 2
- `quality_of_earnings`: parents 1, child bullets 6, max depth 2
- `revenue_analysis`: parents 1, child bullets 2, max depth 2
- `operating_expenses`: parents 1, child bullets 4, max depth 2
- `accounts_payable_and_accrued_liabilities`: parents 1, child bullets 3, max depth 2
- `capital_expenditure_requirements`: parents 1, child bullets 2, max depth 2

#### `business_overview`
- [business_overview.1483f5cd] Understand the Company's financial statement preparation process, including:
  - [business_overview.f611d42f] Finance function, financial reporting framework, and management reporting relationships (including processes, timing, structure of financial reporting, and interaction with the information/accounting systems); and
  - [business_overview.f3398e6f] Recent or contemplated changes in accounting principles, procedures, or estimates.

#### `quality_of_earnings`
- [quality_of_earnings.47726e1b] Propose potential adjustments to consolidated historical Earnings before Interest, Taxes, Depreciation and Amortization ("EBITDA") by considering:
  - [quality_of_earnings.03124ec1] The Company's proposed adjustments (i.e., Management, Pro forma, Due diligence and Run rate adjustments) including recent acquisitions, if any, restructuring initiatives, and other.
  - [quality_of_earnings.277251e6] The impact of significant new and lost customer relationships and service offerings;
  - [quality_of_earnings.2da9b60b] Pro forma impact of changes in headcount and vacancies, if any;
  - [quality_of_earnings.22fcf8e6] The impact from related party transactions, if any;
  - [quality_of_earnings.fa36614c] The impact of any changes in accounting policies (revenue recognition, provisions, management estimates, capitalization or adjusting entries on the reported results); and
  - [quality_of_earnings.d8ac47c8] Large, unusual, or non-recurring events or transactions that may have distorted results.

#### `revenue_analysis`
- [revenue_analysis.7c6ddf83] Obtain and read an analysis of the Company's revenue and inquire about:
  - [revenue_analysis.ccfe6c48] Revenue by product, customer, geography (i.e., by province / other); and
  - [revenue_analysis.bc6fab25] Annual recurring revenue, retention rates, customer churn, length of relationship, etc.

#### `operating_expenses`
- [operating_expenses.419e503b] Obtain and read an analysis of the Company's operating expenses, commenting on:
  - [operating_expenses.6cd68dfd] Key components and trends of cost of revenue (i.e., software, data center, merchant service fees, marketing agreements, etc.);
  - [operating_expenses.23844c87] Personnel expenses, including salaried and hourly labour, contractor costs, payroll-related costs, headcount, and average compensation costs by department (sales, marketing, general and administrative etc.);
  - [operating_expenses.14f7c7c5] Capitalization of employee expenses, software and development costs and commissions; and
  - [operating_expenses.5a04e565] Research and development and potential future costs savings.

#### `accounts_payable_and_accrued_liabilities`
- [accounts_payable_and_accrued_liabilities.2dd02093] Obtain and read an analysis of the Company's accounts payables and accrued liabilities and inquire about:
  - [accounts_payable_and_accrued_liabilities.10165935] Terms of trade with major vendors, aging analysis;
  - [accounts_payable_and_accrued_liabilities.81bf99ba] Accrued liabilities, other current and non-current liabilities; and
  - [accounts_payable_and_accrued_liabilities.26890831] Deferred revenue/unearned revenue profile and recognition.

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.135693b0] Obtain and read an analysis of the Company's existing capital costs and inquire about:
  - [capital_expenditure_requirements.2935894b] Capitalized labour trends (labour, software development and commission); and
  - [capital_expenditure_requirements.d9d2c872] Other historical, deferred, and planned capital expenditures.

### supermarket

- `business_overview`: parents 1, child bullets 3, max depth 2
- `quality_of_earnings`: parents 1, child bullets 8, max depth 2
- `supporting_analysis_for_quality_of_earnings`: parents 1, child bullets 4, max depth 2
- `operating_expenses`: parents 1, child bullets 7, max depth 2
- `working_capital`: parents 1, child bullets 5, max depth 2

#### `business_overview`
- [business_overview.81ccc671] Summarize and comment on the key Target’s accounting processes:
  - [business_overview.c56b54ad] Finance function, and financial reporting framework (including process, timing, structure of financial reporting, and interaction with the information/accounting systems);
  - [business_overview.b08073d9] Understanding of key differences between US GAAP and IFRS, including pro forma view highlighting the impact on operating income, net income, EPS, etc.
  - [business_overview.1be64273] Key indicators of financial performance;
- [business_overview.e2e171ec] Understand Target’s accounting of intercompany transactions and consolidation process; and
- [business_overview.711b71e8] Significant accounting policies and estimates and contemplated changes.

#### `quality_of_earnings`
- [quality_of_earnings.7231aba2] Summarize potential adjustments identified regarding the profit and loss performance of Target in the form of a quality of earnings analysis, summarizing the risks that may impact earnings before interest, taxes, depreciation and amortization (“EBITDA”) including:
  - [quality_of_earnings.0137434c] Leverage Target’s Sell-side quality of earnings analysis as applicable
  - [quality_of_earnings.e1c25736] Impact of COVID on sales trends and expenses, and any corresponding impact relating to inventory provision or write-offs;
  - [quality_of_earnings.419babf3] Impact of recent input cost increases on EBITDA;
  - [quality_of_earnings.6f2a2c12] Impact of new locations or closures;
  - [quality_of_earnings.a34c2827] Non-recurring professional fees;
  - [quality_of_earnings.d7a2d6be] The impact of provisions, estimates, or adjusting entries on the reported results;
  - [quality_of_earnings.60ff0d16] The impact of related party transactions (e.g. related party family adjustments to EBITDA, related party leases, etc.); and
  - [quality_of_earnings.51322118] Any other large, unusual or non-recurring events or transactions that may have distorted results.

#### `supporting_analysis_for_quality_of_earnings`
- [supporting_analysis_for_quality_of_earnings.b94a7e32] Obtain and read an analysis of sales and expenses, and enquire about, to the extent available:
  - [supporting_analysis_for_quality_of_earnings.e1cb4986] Sales and COGS adjustments (including sales returns, markdowns, stock shrinkage, obsolescence, discounts, rebates, other income);
  - [supporting_analysis_for_quality_of_earnings.0d9bf58b] For Retail, understand sales and growth by tonnage;
  - [supporting_analysis_for_quality_of_earnings.822b77a2] For Wholesale, understand sales and growth by customer account
  - [supporting_analysis_for_quality_of_earnings.a2856e42] Store costs analyzed as a percentage of sales, square footage, or other applicable metric
- [supporting_analysis_for_quality_of_earnings.20123f51] Evaluate and understand the key trends and dynamics that impact sustainability of revenue and margins;
- [supporting_analysis_for_quality_of_earnings.fc56a9eb] Evaluate product mix by revenue, costs, and margin to extract key trends that impact revenue forecasts and store performance for both the retail business and the wholesale business
- [supporting_analysis_for_quality_of_earnings.a688818c] Analyze cross-sell, upsell, retention; cohorts of product category and typical purchasing behaviors (e.g., bundling, etc.)
- [supporting_analysis_for_quality_of_earnings.68a25c1a] Understand impact of any private label brands on margin; any differences by location
- [supporting_analysis_for_quality_of_earnings.fa843d7b] Evaluate by location to understand gross margin contributions
- [supporting_analysis_for_quality_of_earnings.8a6e5e22] Analyze business performance, trends, revenue, costs, and margin by location; including typical product category offered at locations that impact the differences in performance – informs locations to rationalize / expand
- [supporting_analysis_for_quality_of_earnings.dd8f212c] Evaluate local competitive presence (e.g., number of competitors within 5 or 10km radius circles) that might impact store performance
- [supporting_analysis_for_quality_of_earnings.47b390c1] Integrate with insights from conducting product category analysis
- [supporting_analysis_for_quality_of_earnings.ca2ef806] Conduct a ramp-up analysis for recent locations to evaluate any relevant EBITDA adjustments that were identified
- [supporting_analysis_for_quality_of_earnings.96a13571] Analyze the health of the customer base, including purchasing patterns (e.g., every few days, or week, etc.) and typical purchased / bucketed categories
- [supporting_analysis_for_quality_of_earnings.bb4acc95] Leverage target’s customer data (e.g., anonymized) to analyze retention, growth, margin, average order side (AOS), impact of loyalty program, etc.
- [supporting_analysis_for_quality_of_earnings.2e698026] Analyze metrics such as order frequency, new customers as a percentage of active customers, etc. to understand the health of the customer base
- [supporting_analysis_for_quality_of_earnings.5a1ae3b9] Understand Target’s central production unit and the current sales it supports
- [supporting_analysis_for_quality_of_earnings.c2d88118] Develop analysis in both PowerPoint slides / Excel and PowerBI – create an interactive dashboard

#### `operating_expenses`
- [operating_expenses.34d753cd] Obtain and read an analysis of the Target’s selling, general and administration expenses and inquire about:
  - [operating_expenses.94e982ea] Salaries and wages (including headcount by area and function, if possible);
  - [operating_expenses.e77663f6] General and administrative expenses;
  - [operating_expenses.bb95eefb] Information systems expenses;
  - [operating_expenses.48e4fec1] Corporate costs;
  - [operating_expenses.71741fa1] Extraordinary expenses;
  - [operating_expenses.21305b83] Rent and leases; and
  - [operating_expenses.19bbcd37] Miscellaneous and other expenses.

#### `working_capital`
- [working_capital.b1a33fa0] Obtain details of the monthly net working capital and comment on the following for Retail, Wholesale, and Corporate Overhead to the extent they can be bifurcated:
  - [working_capital.c6961a8b] The composition of individual working capital accounts (e.g. trade receivables, accounts payable and accruals, inventory and inventory provisions, etc.);
  - [working_capital.e41f9df0] Monthly working capital trends and impact on reported metrics (e.g. days sales outstanding, inventory turns, days payables outstanding, net working capital as a percentage of revenues, etc.);
  - [working_capital.eeef6334] Large, unusual, or non-operating items and current or upcoming initiatives that may affect normal working capital trends, (such as accruals for bonuses, capital projects, understanding non-trade balances, etc.);
  - [working_capital.8540a908] Working capital seasonality and implications on cash flow and working capital peg; and
  - [working_capital.1d01de59] Understanding the accounting impact of allowance for uncollectible accounts and write-offs, inventory reserve, reserves for sales returns and allowances, and other accruals requiring judgment.

### tech

- `business_overview`: parents 3, child bullets 10, max depth 2
- `accounting_overview`: parents 2, child bullets 6, max depth 2
- `revenue_analysis`: parents 1, child bullets 4, max depth 2
- `quality_of_earnings`: parents 5, child bullets 26, max depth 3
- `supporting_analysis_to_quality_of_earnings`: parents 1, child bullets 5, max depth 2
- `arr_drivers`: parents 1, child bullets 2, max depth 2
- `operating_expenses`: parents 1, child bullets 2, max depth 2
- `working_capital`: parents 1, child bullets 4, max depth 2
- `locked_box`: parents 1, child bullets 4, max depth 2
- `phase_1_gaap_considerations`: parents 1, child bullets 4, max depth 2

#### `business_overview`
- [business_overview.cfbc84d6] Gain an understanding of the business, including:
  - [business_overview.a8d2b341] Legal and organizational structure;
  - [business_overview.911d134b] Revenue streams;
  - [business_overview.b4e1ba17] Cost base, employee base and infrastructure; and
  - [business_overview.1af82461] Key management team.
- [business_overview.e8fa32d9] Understand the business' accounting function, including:
  - [business_overview.82ec64a6] key accounting practices, policies, procedures, and methodologies;
  - [business_overview.82f5e80f] internal financial controls; and
  - [business_overview.4ac2812e] financial reporting.
- [business_overview.a3147690] Gain a general understanding of the services, customers, operations and entities in the business, including:
  - [business_overview.4a0d120f] Organization structure, including Target's position within the broader Parent;
  - [business_overview.d96bb53f] Key revenue streams (Professional Services, Managed Services, Perpetual License, Third Party Revenue); and
  - [business_overview.cdab8bd4] Key milestones in the Target's recent history, including key operational and financial developments of note (new service offerings / revenue streams / geographical expansion, cost investment, changes in key management).
- [business_overview.9fcbd603] Understand points of contact with the broader Parent, including intergroup transactions, shared services and resources, shared customers, and allocated costs.

#### `accounting_overview`
- [accounting_overview.be156dc4] Using analysis performed by you, and discussions with you and Target:
  - [accounting_overview.9370f0ab] Present the income statement and balance sheet of Target on a 'reported' basis.
- [accounting_overview.63847685] Gain an understanding of the business' finance function, financial reporting framework and internal control environment (e.g. finance team set-up and reporting, key financials systems used, use of external accountant, reliance on shared Parent resources).
- [accounting_overview.3bec3694] Understand significant accounting policies applied and, where applicable, understand changes in accounting policies over the Historical Period and the potential financial impact. In particular, understand:
  - [accounting_overview.5de0a43a] Revenue recognition, in particular recognition of recurring revenues and deferral of revenues;
  - [accounting_overview.8bb6be3f] Matching of revenue and costs (including deferral of staff sales commissions);
  - [accounting_overview.bc722703] Capitalization policy;
  - [accounting_overview.3fa962c4] Monthly vs year-end policies; and
  - [accounting_overview.17095356] Adjustments, entries, or areas of improvement suggested by the business' external accountant.
- [accounting_overview.c7feaead] Identify components of EBITDA which are incurred entirely within Target (i.e. stand-alone costs) and costs that are allocated to / from Parent, and compare to understanding of intra-group points of contact with broader Parent.
- [accounting_overview.3d06861a] Review a reconciliation of trial balance information to internal and external financial statements and to Parent year-end financial statements (to be performed by you).
- [accounting_overview.4945ae66] Review a reconciliation of net income and net assets period-over-period (to be performed by you).

#### `revenue_analysis`
- [revenue_analysis.e8c07226] Understand the business' revenue streams and related accounting policies and practice. To include understanding of:
  - [revenue_analysis.255e6e20] cash / billing cycle;
  - [revenue_analysis.a0e88fc3] typical contract terms;
  - [revenue_analysis.307a47df] timing of price increases; and
  - [revenue_analysis.85a10645] calculation of deferred revenue.
- [revenue_analysis.9780fc88] Understand what work has been performed to reconcile reported revenues, cash income, and ARR.
- [revenue_analysis.e77ed82d] Consider methodology used by the seller in presenting ARR and associated KPIs (upsell, downsell, churn, ARR per license / per logo, key account concentration)
- [revenue_analysis.b9688637] identify key anomalies or items of concern relating to calculation methodology and / or resulting trends.
- [revenue_analysis.29c484c1] Perform Phase 2 top up due diligence as requested by you (e.g. recalculation of ARR and KPIs using methodology).

#### `quality_of_earnings`
- [quality_of_earnings.98efd45e] Consider the quality of earnings analysis prepared by the sell side. Form a view on seller proposed adjustments, and consider whether other adjustments might be considered, including:
  - [quality_of_earnings.1ef23037] Capitalized R&D and other internal costs;
  - [quality_of_earnings.4b2baa4b] Commissions and contract assets;
  - [quality_of_earnings.4766f8a0] Accounting adjustments;
  - [quality_of_earnings.f3029250] One-time items.
  - [quality_of_earnings.d2bc299b] Treatment of FX
- [quality_of_earnings.165c608a] Perform an analysis of adjusted EBITDA compared to free cash flow and set out key considerations in relation to EBITDA to cash flow conversion.
- [quality_of_earnings.a46aac44] In support of the quality of earnings analysis, consider:
  - [quality_of_earnings.8441168a] Information made available by the seller including vendor due diligence materials, internal and external financial statements or MD&A material, board presentations, management Q&A, and other relevant information provided;
  - [quality_of_earnings.a573f138] Monthly trending of income statement captions;
  - [quality_of_earnings.749c0e45] Balance sheet support provided by the seller; and
  - [quality_of_earnings.844ad4d1] The results of the quality of revenue analysis.
- [quality_of_earnings.e4b4bdeb] Consider items with a full year EBITDA impact, and quantify where possible, including:
  - [quality_of_earnings.a09c3c08] Latest ARR (including consideration of churned and booked-not-billed customers); and
  - [quality_of_earnings.4f69386d] Investment or changes in the cost base of the business.
- [quality_of_earnings.473e8727] Perform other Phase 2 top up due diligence as requested by you (e.g. roll forward of quality of earnings analysis to a more recent date).
- [quality_of_earnings.be156dc4] Using analysis performed by you, and discussions with you and Target:
  - [quality_of_earnings.135daed0] Present a potential adjusted earnings before interest, taxes, depreciation, and amortization ("EBITDA"), including normalization items for the Historical Period by considering the items identified in our understanding of the financial reporting environment, in our consideration of your own analysis of quality of earnings, and any additional analysis performed by advisor, that have an earnings impact, including consideration of:
    - [quality_of_earnings.cab02995] Revenue recognition (cash vs accruals accounting; treatment of implementation revenues; gross vs net considerations on third party / license revenues);
    - [quality_of_earnings.f0030470] Allocated costs to / from Parent, considering the basis and methodology of allocation of costs compared to our understanding of Target's interaction with other Parent divisions and shared infrastructure*;
    - [quality_of_earnings.bfebe435] Stand alone costs prepared by Target / you*;
    - [quality_of_earnings.9970f732] Other internal accounting practices (e.g. cut-off on accruals; matching of costs and revenues; treatment of capital expenses; provision movements and/or releases) and the impact of changes in accounting practices and policies;
    - [quality_of_earnings.a3eddd9a] Year-end adjustments/true ups that should be considered in the presentation of a TTM earnings (e.g. differences between month-end and year-end practices influencing TTM reporting);
    - [quality_of_earnings.ec8e1d3d] Unadjusted year-end differences and other external accountant findings (where applicable); and
    - [quality_of_earnings.2b1c7e81] Other one-off, non-recurring, or non-business items identified through the course of our work.
- [quality_of_earnings.3e790e10] Discuss whether additional EBITDA adjustments might be considered, in addition to those already identified in your analysis.
- [quality_of_earnings.ba92387b] Present an adjusted income statement showing revenues, costs and EBITDA on an adjusted basis.
- [quality_of_earnings.7e4a41e0] Consider the quantum of recurring non-capital cash costs outside of EBITDA in the Historical Period (e.g. capitalized labour costs relating to IT / R&D projects, etc.).
- [quality_of_earnings.1991d948] Review a reconciliation of employee costs included in adjusted EBITDA to the planned go-forward employee structure proposed by the seller (to be performed by you).
- [quality_of_earnings.6835582f] * The quality of earnings analysis will consider the allocated costs included in the reported financial information for Target, and the proposed stand-alone cost structure which we understand has been prepared by the Target and reviewed by you. We will also reconcile employee costs in adjusted EBITDA to the Target workforce proposed by Management.
- [quality_of_earnings.58ae617c] We will flag in our report if, in the course of our analysis and discussion with Target, the stand alone costs or allocations are illogical or appear to be inconsistent with our understanding of existing group operations or the operations of Target. However, we will not undertake any work with the intent to assess or analyze the appropriateness of the stand alone cost base prepared by you / Target, other than to consider whether the costs included in adjusted EBITDA in our work are consistent with those costs calculated by you / Target.
- [quality_of_earnings.40a09878] In the event that you determine that additional work is required to consider the appropriateness of the stand alone costs, the future target operating model, one-off separation costs and / or stranded costs, we will discuss this with you and agree additional procedures under separate cover.

#### `supporting_analysis_to_quality_of_earnings`
- [supporting_analysis_to_quality_of_earnings.e13fe380] Consider the following analysis, to be performed by you, and consider the impact on the quality of earnings analysis:
  - [supporting_analysis_to_quality_of_earnings.49938aec] Analysis of sales and margin trends on a monthly basis by revenue stream, as applicable, to identify anomalies or one-off items;
  - [supporting_analysis_to_quality_of_earnings.f058031b] Analysis of cost of sales and operating expenses by type on a monthly basis to identify anomalies or one-off items;
  - [supporting_analysis_to_quality_of_earnings.1505d49a] Trends in employee remuneration;
  - [supporting_analysis_to_quality_of_earnings.808fcd8d] Trends in other relevant KPIs tracked by management; and
  - [supporting_analysis_to_quality_of_earnings.fe6744cc] Trends in balance sheet components and balance sheet movements at the start and end of the Historical Period, the Historical Period, the Historical Period and TTM, with a potential EBITDA impact.

#### `arr_drivers`
- [arr_drivers.b505c0cb] Using analysis performed by you:
  - [arr_drivers.a714ff83] Present an analysis of revenues split between one-time (e.g. implementation) and recurring (analysis to be performed by you).
  - [arr_drivers.25d07be4] Present an analysis and comment on the development of recurring revenues, including a reconciliation of revenues over time (new / lost / existing revenues) (analysis to be performed by you).
- [arr_drivers.c7f514eb] Review a reconciliation of annual recurring revenues (ARR) per the underlying "customer cube" of subscription revenues to reported revenue and deferred revenue per the internal financial information (analysis to be performed by you).
- [arr_drivers.c53c4487] Comment on trends in key KPIs for recurring and reoccurring revenues as monitored by management (e.g. ARR by product type, customer count, churn, volume, upsell).
- [arr_drivers.e8e8a2cc] Summarize and comment on customer retention (churn) rates for recurring and reoccurring revenue streams by customer, by cohort, and by type (professional service vs managed service) (analysis to be performed by you).

#### `operating_expenses`
- [operating_expenses.abb633f8] Based on analysis performed by you:
- [operating_expenses.a6e3a5f3] Comment on the development of the revenue and gross profit of the business addressing:
  - [operating_expenses.9e238f74] Growth in revenues, including by customer, by product, and split between subscription vs other one-time revenues (such as set-up / consulting fees); and
  - [operating_expenses.d6f0d7b0] Development of margins and relationship between direct costs and revenues.
- [operating_expenses.4b6aab1f] Consider the line item/detailed breakdown of COGS and operating expenses for the historical period addressing costs by function / division, and comment on key movements and drivers of changes (e.g. trends in headcount and cost per head by function) (analysis to be performed by you).
- [operating_expenses.8edc22ee] Present an analysis bridging EBITDA development from the Historical Period to TTM, summarizing the key drivers identified, such as price and volume metrics and/or profitability by revenue type / division (analysis to be performed by you).

#### `working_capital`
- [working_capital.3031e6f4] Consider the net working capital analysis provided by the seller, and consider a potential buy-side position. To consider:
  - [working_capital.915811e6] Historical working capital turnover KPIs (e.g. DSO, DPO, deferred revenue days);
  - [working_capital.fab9bf62] Accounting for key working capital balances including deferred revenue, accounts receivable and accounts payable;
  - [working_capital.a11f0882] Completeness of historical accruals and payables; and
  - [working_capital.2774a37b] Monthly vs annual accounting for judgmental balances such as bonuses.
- [working_capital.cffc71e1] Understand cash and working capital cycle, including the impact of government RFPs and payment terms on working capital balances.
- [working_capital.ea3e63de] Consider the components of net working capital, monthly trends (including days), key drivers and seasonality (analysis to be performed by you).
- [working_capital.462e9519] Present and comment on the average level of working capital and its development over the Historical Period for consideration when setting a working capital target. Consider one off / non-business items in reported working capital, 'allocated' balances within working capital, and the potential impact of stand-alone working capital balances when Target is no longer part of the Parent (analysis to be performed by you).
- [working_capital.ff7386d5] Discuss whether additional net working capital adjustments might be considered, in addition to those already identified in your analysis.
- [working_capital.14aca0a4] Consider the ageing of trade payables and receivables.

#### `locked_box`
- [locked_box.f22e02f8] Consider the locked box analysis provided by the seller, and consider a potential buy-side position. To consider:
  - [locked_box.bf8ae5fb] Adjustments to working capital balances based on quality of earnings and net working capital analysis performed (e.g. calculation of deferred revenue; recoverability of accounts receivable);
  - [locked_box.dfca39ed] Amounts owed to / owed from shareholders;
  - [locked_box.96cd87fc] Tax exposures identified by your tax due diligence team; and
  - [locked_box.f451a3c1] Other debt and debt-like balances that could be included in the locked box.

#### `phase_1_gaap_considerations`
- [phase_1_gaap_considerations.b53a082a] We will conduct a high-level analysis to identify and evaluate the differences between the target's financial statement results prepared in accordance with Spanish GAAP and US GAAP. This analysis will encompass the following:
  - [phase_1_gaap_considerations.40847294] Comparison of significant accounting policies and practices.
  - [phase_1_gaap_considerations.8548a36f] Identification of GAAP differences between Spanish GAAP and US GAAP
  - [phase_1_gaap_considerations.9e1f6df4] Assessment of the potential impact of these differences on the overall financial statements.
  - [phase_1_gaap_considerations.b200b11a] Based on the findings from the above Phase 1 procedures, we can determine and agree with you the scope of subsequent phases including potential quantification of the GAAP differences. Such a scope extension would be covered by an addendum to this Engagement Letter.

### transportation

- `revenue_analysis`: parents 1, child bullets 8, max depth 2
- `operating_expenses`: parents 1, child bullets 4, max depth 2
- `accounts_receivable`: parents 1, child bullets 2, max depth 2
- `inventory`: parents 1, child bullets 3, max depth 2
- `capital_expenditure_requirements`: parents 1, child bullets 4, max depth 2
- `related_party_transactions`: parents 1, child bullets 2, max depth 2

#### `revenue_analysis`
- [revenue_analysis.581ac793] Obtain and read an analysis of Target's revenue and margins and inquire about:
  - [revenue_analysis.35812fcc] Revenue and profitability by significant customer;
  - [revenue_analysis.6912037d] Revenue and profitability by customer type;
  - [revenue_analysis.456378cf] Revenue and profitability by customer profile (e.g., related party vs. third party);
  - [revenue_analysis.3ba6ccce] Revenue and profitability by trip type (e.g., tours, day trips, etc.);
  - [revenue_analysis.3d5c01a1] Impact of seasonality, if any;
  - [revenue_analysis.c4f99952] Any non-recurring components of revenue; and
  - [revenue_analysis.d7925e6b] Cut off procedures.
  - [revenue_analysis.5e85c4de] For each of the above items a) – d), inquire about key performance indicators such as volume (e.g., number of trips, etc.).

#### `operating_expenses`
- [operating_expenses.e0c5095d] Obtain and read an analysis of expenses and inquire about:
  - [operating_expenses.da6accc1] Direct costs (labour and benefits, etc.);
  - [operating_expenses.5ed5917e] Rent and utilities expense;
  - [operating_expenses.04a9f127] Historical operating expense trend as a % of revenue; and
  - [operating_expenses.2f84bb9e] Unusual and extraordinary items.

#### `accounts_receivable`
- [accounts_receivable.368bc2e9] Obtain and read an analysis of accounts receivable and inquire and comment on:
  - [accounts_receivable.280f60bb] Aging analysis and turnover analysis; and
  - [accounts_receivable.e989fc73] Allowance for uncollectible accounts, write-offs and reserves.

#### `inventory`
- [inventory.01bae9bc] Obtain and read an analysis of inventory accounts and inquire and comment on:
  - [inventory.312e5edf] Costing methodology;
  - [inventory.4e3228e1] Composition (e.g. raw materials, supplies, finished goods etc.); and
  - [inventory.5d8a605a] Turnover, aging and provisions.

#### `capital_expenditure_requirements`
- [capital_expenditure_requirements.7a8f389f] Obtain and read an analysis of historic and future capital cost requirements including:
  - [capital_expenditure_requirements.67c22ef8] Other historical, deferred, and planned capital expenditures;
  - [capital_expenditure_requirements.d6eae528] Historical replacement cycle and costs;
  - [capital_expenditure_requirements.7d74332b] Utilization per unit; and
  - [capital_expenditure_requirements.3b0e1095] Impairment write-downs and other issues.

#### `related_party_transactions`
- [related_party_transactions.d7f1f44a] Inquire about and summarize related party transactions including:
  - [related_party_transactions.dfc89b43] Nature and extent of related party transactions; and
  - [related_party_transactions.bc1a9b8e] Basis of pricing for arrangements with related parties.
