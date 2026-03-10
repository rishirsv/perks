---
name: fdd-request-list
description: Generate KPMG-style financial due diligence information request lists and direct Excel workbook outputs for buy-side, sell-side, carve-out, software, manufacturing, energy, and regulated utility engagements. Use when asked to create an FDD request list, IRL, info request list, first-round requests, dataroom gap follow-ups, carve-out request list, or a workbook that matches the bundled Excel template.
---

# FDD Request List

Create a financial due diligence information request list, show a concise markdown preview, and generate a finished `.xlsx` workbook from the bundled template.

## Workflow

### 1. Gather engagement context

Collect or infer:
- project name or code name
- buy-side, sell-side, or lender context
- stand-alone versus carve-out
- audited versus unaudited
- historical periods requested
- industry and business model
- whether this is a first-round list, a dataroom gap update, or a follow-up list
- which conditional modules are in scope

If key details are missing, make reasonable assumptions and state them in the preview.

### 2. Select request modules

Start from the core FDD backbone in [references/request-taxonomy.md](references/request-taxonomy.md).

Then add the conditional modules from [references/module-selection.md](references/module-selection.md) that fit the engagement, especially:
- sell-side report available
- audited or workpaper access
- carve-out
- monthly reporting packages
- discontinued operations
- acquisitions
- software or subscription
- manufacturing or inventory or BOM
- other balance sheet requests
- energy
- regulated utility

Keep the list practical. Prefer the workbook's native request wording when a standard request already exists there.

### 3. Produce the request-list spec

Create a JSON spec with this shape:

```json
{
  "project_name": "North",
  "historical_period_text": "Unless mentioned otherwise, all information is requested for fiscal years 2023, 2024, and YTD Mar-26, plus the corresponding YTD Mar-25 period.",
  "request_date": "2026-03-10",
  "contact_fields": {
    "manager_name": "Jane Doe",
    "firm_name": "KPMG LLP",
    "email": "jdoe@kpmg.com",
    "phone": "416-555-0100",
    "cell": "647-555-0101"
  },
  "sections": [
    {
      "title": "Highest priority",
      "items": [
        {
          "request_id": 1,
          "request_text": "Annual financial statements - ...",
          "priority": "Highest",
          "status": "Open",
          "kpmg_comment": "",
          "target_response": "",
          "dataroom_reference": ""
        }
      ]
    }
  ]
}
```

Rules:
- Use `sections[].title` exactly for visible section rows in the workbook.
- Treat `Highest priority`, `High priority`, `Medium priority`, and `Low priority` as priority-section titles.
- Treat all other section titles as conditional or custom modules.
- Use integer `request_id` values unless the user explicitly wants another visible format.
- Default `status` to `Open`.
- Leave `kpmg_comment`, `target_response`, and `dataroom_reference` blank when unknown rather than inventing content.

### 4. Show the markdown preview

Before running the workbook builder, provide:
- a short assumptions block
- the selected modules
- a compact request-list preview grouped by section
- the exact path you plan to write

### 5. Generate the workbook

Run the builder script:

```bash
python3 scripts/build_fdd_request_list.py --spec /absolute/path/to/spec.json --output /absolute/path/to/output.xlsx
```

Use the bundled workbook template in `assets/`. Do not rebuild the layout from scratch.

The builder preserves:
- sheet name
- merged cells
- column widths
- row styling
- section-row presentation
- workbook framing text

The workbook contract lives in [references/workbook-contract.md](references/workbook-contract.md).

## Output Standard

Always deliver:
- a short markdown summary of assumptions and selected modules
- a grouped request-list preview
- the final workbook path

If the workbook cannot be generated, explain the failure clearly and stop instead of inventing a fallback document format.
