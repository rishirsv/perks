# Section contract: Business overview

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

Write a clear, decision-useful summary of what the business is, how it earns revenue, how it operates, and what changed over the review period.

The section must read as client-ready diligence writing: factual, concise, and specific.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with what the business does, then how it monetizes, then what drives earnings quality.
2. Keep every bullet operational and decision-relevant.
3. Use concrete business mechanics before interpretation.
4. Link recent changes to likely direction of revenue, margin, or volatility impact.
5. Keep this section business-driver focused; avoid full financial performance narrative.
6. Keep bullets as complete, client-ready sentences; avoid clipped fragments and generic marketing language.

## Layout

Scale the depth of the section based on the complexity of business model, route-to-market, and operating dependencies.

Target length:
- 260-560 words

Required blocks:
- `Business model`
- `Customers and go-to-market`
- `Operating model`
- `Recent changes and context for financial trends`

Scaling rules:
- Keep concise for straightforward single-model businesses with one dominant channel and limited structural change.
- Expand `Business model` with segment or entity composition where earnings are driven by multiple lines of business.
- Expand `Customers and go-to-market` where channel mix, pricing mechanics, or contract terms are core margin drivers.
- Expand `Operating model` where shared services, management overlap, or allocation mechanics affect earnings quality.
- Expand `Recent changes and context for financial trends` when organization, channel, or product changes materially affect forward profile.

Block slot map:
- `Business model`: 1 `snapshot_bullet` + 2 `driver_bullet` + optional 1-2 `composition_bullet`
- `Customers and go-to-market`: 1 `snapshot_bullet` + 2 `driver_bullet` + optional 1-2 `composition_bullet`
- `Operating model`: 1 `snapshot_bullet` + 2 `dependency_bullet` + optional 1 `composition_bullet`
- `Recent changes and context for financial trends`: 2-4 `change_bullet`

## Available slot shapes

Use these as building blocks. Choose only what the section needs.

### `snapshot_bullet`
- Purpose: define what the company does and where it operates.
- Best use: opening bullet in each block.
- Target length: 20-45 words.
- Placeholders: allowed.

### `driver_bullet`
- Purpose: connect an operating fact to earnings or margin behavior.
- Best use: core explanatory bullets.
- Target length: 20-50 words.
- Placeholders: allowed.

### `composition_bullet`
- Purpose: describe composition across channel/customer/product/segment/geography.
- Best use: business model and GTM blocks.
- Target length: 18-45 words.
- Placeholders: allowed.

### `dependency_bullet`
- Purpose: describe operational dependencies that can affect quality of earnings.
- Best use: operating model block.
- Target length: 20-55 words.
- Placeholders: allowed.

### `change_bullet`
- Purpose: describe a change over time and likely impact direction.
- Best use: recent changes block.
- Target length: 20-55 words.
- Placeholders: allowed.

### `source_note`
- Purpose: compact support note for a block.
- Best use: once per block when needed.
- Target length: 8-25 words.
- Placeholders: allowed.

## Render skeleton

```markdown
## Business overview

### Business model
- [Company] operates [business model] across [geography], with revenue generated through [primary products/services].
- [Entity/segment] contributes approximately [x]% of revenue and is driven by [volume/pricing/utilization] mechanics.
- Gross margin performance is primarily influenced by [input cost / labor mix / channel mix], with [key factor] acting as the main variability driver.
- [Optional] Revenue is split across [segment A/B/C] at [x]% / [x]% / [x]%, which affects margin profile and seasonality.
- Source note: [source_note optional]

### Customers and go-to-market
- [Company] serves primarily [customer type] through [direct sales / channel partners / contracts] across [key markets].
- Revenue concentration is [low/moderate/high], with the top [x] customers accounting for approximately [x]% of sales in [period].
- Commercial outcomes are most sensitive to [pricing renewal / retention / acquisition cost / throughput], which drives short-term margin movement.
- [Optional] Channel mix is currently [direct/indirect/online] at [x]% / [x]% / [x]%, with [channel] carrying comparatively [higher/lower] gross margin.
- Source note: [source_note optional]

### Operating model
- The business operates through [single entity / multi-entity] structure with [centralized/decentralized] support for finance, HR, procurement, and IT.
- Shared services and management overlap across [entities/sites] affect cost allocations and standalone comparability of reported margins.
- Key operating dependencies include [supplier concentration / workforce model / platform dependency], each of which can influence earnings quality and volatility.
- [Optional] As at [Date], approximately [x] FTEs support more than one business unit, with associated payroll and overhead allocations under [current methodology].
- Source note: [source_note optional]

### Recent changes and context for financial trends
- During [period], the business [expanded/restructured/divested] [specific activity], which increased exposure to [new driver] and reduced reliance on [old driver].
- Management implemented [pricing/go-to-market/operational] changes in [period], with early impact visible in [revenue growth / gross margin / cost base].
- [Optional] The current structure does not fully align to a standalone post-transaction model, and margin comparability may change after transitional arrangements are normalized.
- Source note: [source_note optional]
```

## Common mistakes (and fixes)

1. Mistake: generic positioning language with no business mechanics.
- Fix: replace adjectives with operating facts and revenue mechanics.

2. Mistake: detailed financial analysis inside business overview.
- Fix: keep this section business-and-driver focused; move deep performance commentary to P&L sections.

3. Mistake: adding open-item lists.
- Fix: keep missing facts inline using placeholders such as `$[x]` and `[Date]`.

4. Mistake: citing every sentence.
- Fix: use one compact source note per block only when needed.

5. Mistake: long merged bullets from extracted text.
- Fix: split into one idea per bullet and keep sequence logical.

## Structural preflight rules (must pass)

1. All four required blocks exist and are in this exact order.
2. No `Open items` or `Data requests` headings appear.
3. Missing data uses inline placeholders.
4. Bullet density is within contract range.
5. Render skeleton and full example are materially different (template vs worked output).
6. Language and tone pass global conventions.

## Split policy rules

1. Split a block when it exceeds 6 bullets.
2. Split a bullet when it exceeds 55 words.
3. Split into two short blocks when one block mixes unrelated ideas.
4. Prefer subhead bullets over dense paragraphs for complex structures.

## Full example

```markdown
## Business overview

### Business model
- Aurora Coffee Group operates an integrated food and beverage platform in Thailand, with revenue generated through branded retail coffee stores, packaged coffee manufacturing, and bakery production.
- Retail operations represent approximately 58% of group revenue and are primarily driven by same-store traffic, average ticket, and store-level labor efficiency.
- Manufacturing and bakery segments account for the remaining 42% of revenue and are driven by utilization of production lines, product mix, and commodity input costs.
- In FY2024, retail generated 58% of revenue, coffee manufacturing generated 24%, and bakery generated 18%; manufacturing carried the highest gross margin profile.

### Customers and go-to-market
- Urban consumers purchase through a 146-store network, while franchise support, café supply contracts, and catering generate B2B revenue.
- The top ten B2B customers represented 19% of non-retail revenue in FY2024, indicating moderate concentration in contract-based channels.
- Commercial performance is most sensitive to product mix and pricing cadence in retail, as well as contract renewal terms in manufacturing supply agreements.
- In FY2024, direct retail sales represented 63% of channel mix, franchise and supply contracts represented 22%, and catering and events represented 15%; direct retail carried lower margin volatility.

### Operating model
- The group operates through three legal entities with centralized finance, procurement, and HR functions managed at holdco level.
- Shared management responsibilities across entities affect allocation of payroll and overhead, reducing comparability of historical standalone margins by legal entity.
- A small number of coffee bean and dairy suppliers concentrates procurement dependency and can move gross margin when commodity prices change.
- As at December 31, 2024, 34 FTEs supported multiple entities, with allocated payroll costs recorded across retail, manufacturing, and bakery entities using management allocation keys.

### Recent changes and context for financial trends
- Between FY2022 and FY2024, the group expanded into bakery and contract catering, increasing revenue diversification but also adding operational coordination complexity.
- In Q3 FY2024, management repriced selected beverage SKUs and renegotiated two key supply contracts, which supported gross margin expansion in H2 FY2024.
- Management indicated that current intercompany support and service-charge arrangements would require redesign for a standalone post-transaction model, which could shift entity-level margins despite stable group economics.
```
