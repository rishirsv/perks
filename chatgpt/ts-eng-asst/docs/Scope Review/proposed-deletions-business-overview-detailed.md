# Proposed Deletions: Business Overview (Detailed Exact Text)

Goal: review exact text and remove only redundant boilerplate while keeping unique industry-specific scope.

Status update: `eyecare.business_overview.scope.047` and `eyecare.business_overview.scope.048` have already been removed from `dist/scope-library.json`, so this file is now a historical review artifact.

## How To Use This File

1. `ACTION_*` controls top-level bullet deletion decision.
2. `LINE_ACTION_*` controls child-line trimming if you want partial cleanup instead of deleting whole bullet.
3. `REC_*` is only a recommendation; you can override.

Marker definitions:
- `ACTION_KEEP`, `ACTION_DELETE`
- `LINE_ACTION_KEEP`, `LINE_ACTION_DELETE`
- `REC_KEEP_UNIQUE`: likely industry-specific value
- `REC_REVIEW_BOILERPLATE`: likely overlap with common/accounting boilerplate

## Baseline (Common)

### Row 1 — `scope.001`
- Action: `ACTION_KEEP`
- Path: `common.business_overview.scope.001`
- Top-level text: Meet with Target's officers and management in order to develop an understanding of operations, including its:
- Sub-bullets:
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [1] Basis of financial information;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Organization structure;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Historical growth by geography; and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [4] Finance function, financial reporting framework and internal control environment.

## `aerospace`

### Row 479 — `scope.488`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `aerospace.business_overview.scope.488`
- Top-level text: Gain an understanding of product lines, programs, customers (OEM/tier relationships), and regulatory/quality requirements.
- Sub-bullets: _(none)_

### Row 480 — `scope.489`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `aerospace.business_overview.scope.489`
- Top-level text: Understand backlog, program life cycles, and ramp/production cadence.
- Sub-bullets: _(none)_

### Row 481 — `scope.490`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `aerospace.business_overview.scope.490`
- Top-level text: Understand manufacturing footprint, capacity constraints, and supply chain dependencies.
- Sub-bullets: _(none)_

## `banking`

### Row 501 — `scope.510`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `banking.business_overview.scope.510`
- Top-level text: Gain an understanding of key products and customer segments (deposit, lending, payments, wealth, etc.).
- Sub-bullets: _(none)_

### Row 502 — `scope.511`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `banking.business_overview.scope.511`
- Top-level text: Understand balance sheet composition, funding sources, and interest rate sensitivity drivers.
- Sub-bullets: _(none)_

### Row 503 — `scope.512`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `banking.business_overview.scope.512`
- Top-level text: Understand regulatory environment and reporting requirements applicable to the business.
- Sub-bullets: _(none)_

## `building`

### Row 463 — `scope.472`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `building.business_overview.scope.472`
- Top-level text: Gain an understanding of the project/contracting model, including service lines, end markets, geographic footprint, and typical contract types.
- Sub-bullets: _(none)_

### Row 464 — `scope.473`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `building.business_overview.scope.473`
- Top-level text: Understand backlog, bidding pipeline, and key customers/projects, including customer concentration.
- Sub-bullets: _(none)_

### Row 465 — `scope.474`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `building.business_overview.scope.474`
- Top-level text: Understand subcontractor usage, sourcing/procurement practices, and key suppliers.
- Sub-bullets: _(none)_

## `eyecare`

### Row 47 — `scope.047`
- Action: `ACTION_DELETE`
- Recommendation: `REC_REVIEW_BOILERPLATE`
- Path: `eyecare.business_overview.scope.047`
- Top-level text: Read Target's financial statements and discuss them with management to gain an understanding of Target's accounting policies and practices, including:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] Finance function, financial reporting framework, and management reporting relationships;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [2] Significant accounting policies and estimates (e.g. revenue recognition, capitalized costs, deferred revenue) and contemplated changes

### Row 48 — `scope.048`
- Action: `ACTION_DELETE`
- Recommendation: `REC_REVIEW_BOILERPLATE`
- Path: `eyecare.business_overview.scope.048`
- Top-level text: Read Target's financial statements and discuss with Management to gain an understanding of the following:
- Sub-bullets:
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [1] Financial performance over the historical period;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Potential adjustments to the profit and loss performance identified by Management;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [3] Accounting policies and practices.

## `healthcare`

### Row 73 — `scope.073`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `healthcare.business_overview.scope.073`
- Top-level text: Meet with Target's officers and management to obtain background information about Target, including its:
- Sub-bullets:
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [1] History;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [2] Organizational structure and management reporting relationships;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Services offered;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [4] Trends in payor mix;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [5] De novo expansion;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [6] Financing arrangements with patients, if applicable;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [7] Business risks and opportunities; and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [8] Information systems.

## `hvac`

### Row 122 — `scope.122`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `hvac.business_overview.scope.122`
- Top-level text: Obtain background information of Target, including its:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] Organizational structure, ownership and management reporting relationships;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Product / service offerings;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Range of customer segments and regions served; and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [4] Financial reporting and information systems (including process, timing, structure of financial reporting, and interaction with the information/accounting systems).

## `insurance`

### Row 516 — `scope.525`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `insurance.business_overview.scope.525`
- Top-level text: Gain an understanding of lines of business, distribution channels, and geographic footprint.
- Sub-bullets: _(none)_

### Row 517 — `scope.526`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `insurance.business_overview.scope.526`
- Top-level text: Understand premium growth drivers, retention, and pricing actions over the Historical Period.
- Sub-bullets: _(none)_

### Row 518 — `scope.527`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `insurance.business_overview.scope.527`
- Top-level text: Understand regulatory environment and reporting requirements applicable to the business.
- Sub-bullets: _(none)_

## `manufacturing`

### Row 219 — `scope.221`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `manufacturing.business_overview.scope.221`
- Top-level text: Meet with the Company's officers and management in order to develop an understanding of the Company, including its:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] History, organization structure, proposed transaction perimeter and management reporting relationships;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Start-up costs, capital expenditures, and status of operations in Morocco;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [3] Intercompany transactions;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [4] Production sites/ lines capacity, utilization rates;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [5] Details of pricing methodology; key contractual terms with key customers (incl. ability to pass cost increases to customers);
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [6] Range of suppliers, significant dependencies; key contractual terms; price volatility for key materials; inventory levels and turnover;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [7] Range of customer segments, customer concentration and regions served;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [8] Key performance metrics used by the Company's management;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [9] Employees compensation and benefits by major categories;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [10] Financial reporting framework and information systems; monthly/annual cut-off process; and
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [11] Key accounting policies including: revenue recognition, inventory valuation methodologies, costing methodology, warranties, provisions, management estimates, etc.

### Row 220 — `scope.222`
- Action: `ACTION_KEEP`
- Recommendation: `REC_REVIEW_BOILERPLATE`
- Path: `manufacturing.business_overview.scope.222`
- Top-level text: Read available information and discuss with Target management in order to develop an understanding of Target, including its:
- Sub-bullets:
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [1] Inter-group operations and allocation of corporate overheads;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Production lines capacity, utilization, scrap rates;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Range of products and services; degree of customization; pricing methodology (including volume discounts/ rebates); key contractual terms (incl. ability to pass cost increases to customers);
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [4] Research activities and new product development initiatives;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [5] Range of suppliers, significant dependencies; key contractual terms; price volatility for key raw materials (resin, etc.);
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [6] Marketing and distribution channels;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [7] Key performance metrics used by Target's management;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [8] Financial reporting framework and information systems;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [9] Key accounting policies including: revenue recognition, inventory valuation methodologies, costing methodology, sales returns, rebates, provisions, management estimates, etc.

### Row 221 — `scope.223`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `manufacturing.business_overview.scope.223`
- Top-level text: Obtain background information of Target, including its:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] Organizational structure, ownership and management reporting relationships;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Range of products, customer segments and regions served; and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Financial reporting and information systems (including process, timing, structure of financial reporting, and interaction with the information/accounting systems).

## `prof_services`

### Row 296 — `scope.301`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `prof_services.business_overview.scope.301`
- Top-level text: Read available information and meet with Target's officers in order to develop an understanding of Target, including its:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] Organization structure and management reporting relationships;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [2] Significant accounting estimates including percentage of completion ("POC") revenue; and
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [3] Finance function and financial reporting framework including the financial planning and analysis function.
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [4] Significant accounting estimates including percentage of completion ("POC") revenue;
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [5] Basis of financial information including financial reporting, cost allocation methodologies and consistency in accounting policies; and
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [6] Finance function.

## `retail`

### Row 450 — `scope.459`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `retail.business_overview.scope.459`
- Top-level text: Gain an understanding of the retail model and channels (stores, eCommerce, wholesale, etc.), including store footprint and geographic mix.
- Sub-bullets: _(none)_

### Row 451 — `scope.460`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `retail.business_overview.scope.460`
- Top-level text: Understand merchandising strategy, product/category mix, seasonality, and promotional cadence.
- Sub-bullets: _(none)_

### Row 452 — `scope.461`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `retail.business_overview.scope.461`
- Top-level text: Understand key vendors, sourcing model, and supply chain / distribution network.
- Sub-bullets: _(none)_

## `service`

### Row 339 — `scope.345`
- Action: `ACTION_KEEP`
- Recommendation: `REC_REVIEW_BOILERPLATE`
- Path: `service.business_overview.scope.345`
- Top-level text: Understand the Company's financial statement preparation process, including:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] Finance function, financial reporting framework, and management reporting relationships (including processes, timing, structure of financial reporting, and interaction with the information/accounting systems); and
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [2] Recent or contemplated changes in accounting principles, procedures, or estimates.

## `supermarket`

### Row 351 — `scope.357`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `supermarket.business_overview.scope.357`
- Top-level text: Summarize and comment on the key Target’s accounting processes:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] Finance function, and financial reporting framework (including process, timing, structure of financial reporting, and interaction with the information/accounting systems);
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Understanding of key differences between US GAAP and IFRS, including pro forma view highlighting the impact on operating income, net income, EPS, etc.
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Key indicators of financial performance;

### Row 352 — `scope.358`
- Action: `ACTION_KEEP`
- Recommendation: `REC_REVIEW_BOILERPLATE`
- Path: `supermarket.business_overview.scope.358`
- Top-level text: Understand Target’s accounting of intercompany transactions and consolidation process; and
- Sub-bullets: _(none)_

### Row 353 — `scope.359`
- Action: `ACTION_KEEP`
- Recommendation: `REC_REVIEW_BOILERPLATE`
- Path: `supermarket.business_overview.scope.359`
- Top-level text: Significant accounting policies and estimates and contemplated changes.
- Sub-bullets: _(none)_

## `tech`

### Row 383 — `scope.390`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `tech.business_overview.scope.390`
- Top-level text: Gain an understanding of the business, including:
- Sub-bullets:
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [1] Legal and organizational structure;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Revenue streams;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Cost base, employee base and infrastructure; and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [4] Key management team.

### Row 384 — `scope.391`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `tech.business_overview.scope.391`
- Top-level text: Understand the business' accounting function, including:
- Sub-bullets:
  - LINE_ACTION_DELETE | REC_REVIEW_BOILERPLATE | [1] key accounting practices, policies, procedures, and methodologies;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] internal financial controls; and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] financial reporting.

### Row 385 — `scope.392`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `tech.business_overview.scope.392`
- Top-level text: Gain a general understanding of the services, customers, operations and entities in the business, including:
- Sub-bullets:
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [1] Organization structure, including Target's position within the broader Parent;
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [2] Key revenue streams (Professional Services, Managed Services, Perpetual License, Third Party Revenue); and
  - LINE_ACTION_KEEP | REC_KEEP_UNIQUE | [3] Key milestones in the Target's recent history, including key operational and financial developments of note (new service offerings / revenue streams / geographical expansion, cost investment, changes in key management).

### Row 386 — `scope.393`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `tech.business_overview.scope.393`
- Top-level text: Understand points of contact with the broader Parent, including intergroup transactions, shared services and resources, shared customers, and allocated costs.
- Sub-bullets: _(none)_

## `telecomm`

### Row 489 — `scope.498`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `telecomm.business_overview.scope.498`
- Top-level text: Gain an understanding of the product and service portfolio, customer segments, and go-to-market channels.
- Sub-bullets: _(none)_

### Row 490 — `scope.499`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `telecomm.business_overview.scope.499`
- Top-level text: Understand network/infrastructure model (owned vs leased) and key third-party dependencies.
- Sub-bullets: _(none)_

### Row 491 — `scope.500`
- Action: `ACTION_KEEP`
- Recommendation: `REC_KEEP_UNIQUE`
- Path: `telecomm.business_overview.scope.500`
- Top-level text: Understand key commercial arrangements (carriers/partners, wholesale, roaming, etc.) where applicable.
- Sub-bullets: _(none)_
