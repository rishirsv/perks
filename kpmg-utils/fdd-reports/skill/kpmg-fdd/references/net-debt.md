# Section contract: Net debt and debt-like items

## Table of contents

- Core rule
- Writing guidance
- Layout
- Available slot shapes
- Render skeleton
- Common mistakes (and fixes)
- Structural preflight rules (must pass)
- Split policy rules
- Full example

## Core rule

Produce a purchase-price-relevant net debt view as at a clearly stated date, with defensible classification of debt, cash, and debt-like items.

The section must read as client-ready diligence writing: factual, concise, and explicit about scope, cut-off mechanics, and residual uncertainty.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with the headline position (reported vs adjusted, as at date, and primary drivers).
2. Define scope before analysis (what counts as cash, debt, debt-like, and explicit exclusions).
3. Show the schedule before commentary.
4. Present `Debt-like adjustments and rationale` as a numbered list, with each item following this structure: `Item ($[x]): [what it includes as at date]. Treat this item as [debt-like / cash-like / other] because [basis]. [closing implication or uncertainty, where relevant].`
5. Use `Other considerations` for potential debt/debt-like items that are not fully quantifiable, are outside immediate scope, or depend on closing-date updates.
6. In `Other considerations`, state treatment direction, why it matters, and what is needed to finalize quantification.
7. Convert missing support into inline placeholders; avoid process notes in the final narrative.
8. Preferred lead-ins for this block include `Other considerations to net cash / (debt) include...` and `Other items for consideration include...`.
9. Keep adjustments in full, client-ready sentences and avoid clipped or telegraphic fragments.

## Layout

Scale the depth of the section based on the complexity.

Target length:

- 320-780 words (including schedule and adjustments)

Required blocks:

- `Headline position`
- `Definition and scope`
- `Net debt schedule`
- `Debt-like adjustments and rationale`
- `Other considerations`

Scaling rules:

- Keep concise for simple fact patterns (fewer adjustments, limited uncertainty).
- Expand `Debt-like adjustments and rationale` with category subheaders when treatment calls are numerous.
- Add explicit reclassification language whenever any item moves between net debt and working capital categories.
- Expand `Other considerations` when timing updates, unresolved support, definition dependencies, or unquantifiable debt-like exposures are material.

Block slot map:

- `Headline position`: 1 `textArray` (1-2 bullets)
- `Definition and scope`: 1 `textArray` (3-6 bullets)
- `Net debt schedule`: 1 `table` + 1 `text` source note
- `Debt-like adjustments and rationale`: 1 `textArray` (3-12 numbered items), grouped by category when needed; each item follows `Item ($[x]): includes... Treat this item as...`
- `Other considerations`: 1 `textArray` (2-8 bullets), focused on potential debt/debt-like items where quantification is pending or contingent

## Available slot shapes

### `text`

- Plain string.
- Use for source notes, labels, and short block headers.

### `textArray`

- Array of bullets or short statements.
- Use for all narrative blocks (`Headline position`, `Definition and scope`, `Debt-like adjustments`, `Other considerations`).

### `table`

- Object with `headers` and `rows`.
- Use for the net debt schedule.

### `bodyStyle`

- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Net debt and debt-like items

### Headline position

- [textArray: 1-2 bullets]

### Definition and scope

- [textArray: 3-6 bullets]
- Source note: [text optional]

### Net debt schedule (as at [Date], $[units])

Source note: [text required]

| Line item                          | Classification                        | Balance ($[units]) |
| ---------------------------------- | ------------------------------------- | -----------------: |
| [text]                             | [Debt/Cash/Debt-like/Cash-like/Other] |               $[x] |
| [text]                             | [Debt/Cash/Debt-like/Cash-like/Other] |               $[x] |
| [text]                             | [Debt/Cash/Debt-like/Cash-like/Other] |               $[x] |
| **Adjusted net debt / (net cash)** | **Total**                             |           **$[x]** |

### Debt-like adjustments and rationale

1. Income tax payable ($[x]): The balance includes current income taxes payable as at [Date] that relate to pre-completion profits. Treat this item as debt-like because the vendor generated the underlying tax liability before completion. Estimate unpaid pre-completion amounts at closing when final year-end computation remains pending.
2. Earn-out payable ($[x]): Management reported earn-outs payable on past acquisitions of $[x] as at [Date]. Treat this item as debt-like because the obligation arose from pre-completion transactions. Review forecast assumptions and contractual terms at closing to finalize quantum.
3. Deferred purchase price payable ($[x]): The balance includes deferred consideration owed to vendors of acquired operations. Treat this item as debt-like when settlement remains payable post-completion.
4. Transaction costs and bonuses ($[x]): The balance includes accrued professional fees and transaction-related incentives. Treat unpaid amounts at completion as indebtedness.
5. Capex payables ($[x]): The balance includes non-trade amounts payable to capital suppliers. Treat this item as debt-like when the balance relates to pre-completion capital spend.
6. [Other item] ($[x] / unquantifiable): The balance relates to [description]. Treat this item as [debt-like / cash-like / other] based on [required support], and confirm final treatment and quantum at closing.
- Source note: [text optional]

### Other considerations
- Other considerations to net cash / (debt) include:
- [Item]: [Context and why it may be debt-like, cash-like, or excluded.]
- [Item]: [State what the deal team should review at closing and what support is required.]
- [Item]: [If outside scope or not fully quantifiable, state this explicitly and describe potential purchase price relevance.]
- Source note: [text optional]
```

## Common mistakes (and fixes)

1. Mistake: presenting only bank debt less cash with no debt-like analysis.

- Fix: include a debt-like adjustments block with treatment rationale for material items.

2. Mistake: missing or inconsistent as-at date anchors.

- Fix: anchor headline, schedule, and conclusions to one explicit reference date.

3. Mistake: unclear cash definition (for example, restricted/trust/settlement balances not addressed).

- Fix: state inclusion/exclusion rules in `Definition and scope`.

4. Mistake: classification conclusion without basis.

- Fix: add rationale plus source note for every material item.

5. Mistake: process notes in narrative (for example, `missing from source` or `support pending`).

- Fix: replace with placeholders and capture unresolved points in `Other considerations`.

6. Mistake: reclassifications between net debt and working capital without an explicit treatment note.

- Fix: include one explicit reclassification and rationale bullet.

7. Mistake: using `Other considerations` as a generic request list with no treatment view.

- Fix: include only potential debt/debt-like items and state treatment direction plus quantification status.

8. Mistake: telegraphic adjustment bullets that read like fragments.

- Fix: write full-sentence bullets after the colon, including treatment and implication.

## Structural preflight rules (must pass)

1. All five required blocks exist and are in this exact order.
2. The section includes at least one explicit `as at [Date]` anchor in headline and schedule title.
3. The schedule includes units and at least one source note.
4. Debt-like adjustments include treatment plus rationale for each material item.
5. If any item is reclassified between net debt and working capital, the reclassification and rationale are explicitly stated.
6. `Other considerations` includes potential debt/debt-like items with clear treatment direction and quantification status.
7. Missing information is handled with placeholders and `Other considerations`, not process notes.
8. Language and tone pass global conventions.

## Split policy rules

1. Split `Debt-like adjustments and rationale` into category sub-blocks when bullets exceed 8.
2. Split any adjustment bullet longer than 85 words into two bullets.
3. Split schedule into core + supplemental table when line items exceed 15.
4. Split `Other considerations` into sub-themes (timing, reclassification, non-quantifiable debt-like exposures) when bullets exceed 6.

## Full example

```markdown
## Net debt and debt-like items

### Headline position

- As at December 31, 2024, retractable redeemable shares, long-term debt facilities, and line-of-credit balances drove reported net debt of $504.7 million, partly offset by operating cash.
- After identified reclassifications and additional debt-like items totaling $16.6 million, adjusted net debt is $521.3 million for purchase price analysis.

### Definition and scope

- Net debt in this section includes third-party borrowings, retractable redeemable shares, acquisition-related payables, tax payables, and other identified debt-like obligations expected to affect closing funds flow.
- Cash includes unrestricted operating balances only; balances held in trust accounts are excluded from operating cash for net debt purposes.
- Balances reclassified from working capital are included where they relate to non-trade or pre-completion obligations and are expected to settle in cash post-completion.
- The schedule presents lease and other long-term obligations on the accounting basis in the underlying financial statements and aligns final classification to transaction definitions at closing.

### Net debt schedule (as at December 31, 2024, $m)

Source note: Management-prepared net debt schedule as at December 31, 2024, reconciled to the December 2024 trial balance and supporting balance sheet schedules.

| Line item                          | Classification       | Balance ($m) |
| ---------------------------------- | -------------------- | -------------: |
| Cash and cash equivalents          | Cash                 |            8.3 |
| Revolver and line of credit        | Debt                 |         (12.8) |
| Long-term debt facilities          | Debt                 |        (258.3) |
| Retractable redeemable shares      | Debt-like            |        (241.9) |
| Earn-out payable                   | Debt-like            |          (1.5) |
| Purchase price payable             | Debt-like            |          (0.2) |
| Income taxes payable               | Debt-like            |          (9.7) |
| Stock options liability            | Debt-like            |          (1.9) |
| Transaction costs accrual          | Debt-like            |          (1.6) |
| Capex payables (NWC reclass)       | Debt-like            |          (1.7) |
| **Adjusted net debt / (net cash)** | **Total**            |      **(521.3)** |

### Debt-like adjustments and rationale

1. Income tax payable ($9.7 million): The balance relates to profits generated before completion. Treat this item as debt-like because the vendor generated the underlying tax liability. Estimate the pre-completion portion at closing when final year-end computation remains pending.
2. Earn-out payable ($1.5 million): The balance relates to historical acquisitions. Treat this item as debt-like because the obligation arose from pre-completion M&A activity. Review forecast assumptions and contractual terms at closing to finalize the amount.
3. Purchase price payable ($0.2 million): The balance relates to deferred consideration owed to vendors of acquired operations. Treat this item as debt-like when settlement remains payable post-completion.
4. Transaction costs accrual ($1.6 million): The balance includes professional fees connected to the contemplated transaction. Treat unpaid amounts at completion as indebtedness.
5. Stock options liability ($1.9 million): The balance relates to obligations under employee equity incentive arrangements. Treat this item as debt-like when balances crystallize on change of control.
6. Capex payables ($1.7 million): The balance includes non-trade amounts payable to capital suppliers. Reclassify this item from working capital and treat it as debt-like.

### Other considerations

- In addition to adjusted net debt, this section identifies other potential debt-like items where final treatment or quantum remains subject to further support.
- Other considerations to net cash / (debt) include unpaid dividends, near-term IT investment plans, and balances where the deal team should validate recoverability or settlement position at closing.
- Note receivable balances of $1.1 million include a sales price adjustment receivable and other recoverable amounts from former shareholders; the deal team should assess collectability at closing to determine purchase price implications.
- Potential employee benefit obligations not fully estimated by Management may represent additional debt-like exposure, and the quantum is currently unquantifiable.
- Tax and regulatory exposures outside the immediate scope of this workstream may be debt-like in substance; tax and legal workstreams should assess them before finalizing purchase price treatment.
- The closing funds flow should account for the portion of consolidated indebtedness attributable to minority interests that will remain in the business.
```
