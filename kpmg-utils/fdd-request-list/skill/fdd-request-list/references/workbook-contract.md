# Workbook Contract

The workbook generator must treat the bundled Excel file as the authoritative template.

## Template Asset

- Template path: `assets/example-information-request-list-template.xlsx`
- Sheet name: `Financial Requests`

## Fixed Template Areas

Preserve these elements exactly by copying the template workbook:
- merged cells in the title and instruction rows
- column widths
- workbook framing text
- sheet name
- top header row and column labels

Update only the intended content cells:
- `B11`: historical period text
- `B15`: manager name
- `B16`: firm name
- `B17`: email
- `B18`: phone
- `B19`: cell
- `B21`: project title in the form `Project [NAME] - Financial Information Request List`

## Body Layout

The request-list body starts at row `23`.

Use these row types:
- Priority section row: visible titles such as `Highest priority`, `High priority`, `Medium priority`, `Low priority`
- Conditional section row: visible titles such as `If carve out` or `If software or subscription business`
- Item row: populated requests under each section

## Column Mapping For Item Rows

- `B`: request ID
- `C`: request text
- `D`: priority
- `E`: dataroom reference
- `F`: date of request
- `G`: status
- `H`: KPMG comment
- `I`: target response

## Style Source Rows

Clone formatting from representative template rows:
- priority section style from row `23`
- conditional section style from row `48`
- item row style from row `24`

Apply those styles across columns `A:J` so the outer framing remains intact.

## Numbering And Dates

- Preserve visible sequential request IDs.
- Accept integer `request_id` values directly from the spec.
- Write `request_date` values into column `F` as Excel dates when possible.
- Default item status to `Open` if omitted.

## Fidelity Requirements

Verification should confirm:
- workbook opens successfully
- sheet name remains `Financial Requests`
- merged ranges in the header remain intact
- unchanged header rows preserve their formatting
- inserted section and item rows inherit the expected template styles
