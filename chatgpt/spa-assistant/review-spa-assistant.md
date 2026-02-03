# SPA Assistant Review

Date: 2026-01-23

This document tracks issues and improvements needed for the SPA Assistant Custom GPT, based on the current `dist/*` files plus the supporting spec/plan docs. It’s organized by module, with issues prioritized within each section.

## Top Priorities (start here)

1. **Make “Bias” unambiguous everywhere** — today most templates use emoji-only, but 🔴/🟠 can mean _either_ Buyer- or Seller-favorable unless direction is included.
2. **Fix Redline traceability** — Redline needs citations for _both_ vA and vB (not just one Section Ref).
3. **Standardize placeholder complexity** — multi-part placeholders (semicolons, plus signs) increase the chance of incomplete/garbled tables.
4. **Make “Not found” behavior explicit in outputs** — avoid blank cells; always show “Not found in document…” consistently.
5. **Align spec/plan to the actual repo layout** — right now docs reference paths/layouts that don’t match what’s shipped, which makes maintenance harder.

---

## 01-definitions.md

### High Priority

| #   | Issue                                   | Description                                                                                                                                   | Recommendation                                                                          |
| --- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1.1 | **Complex template placeholders**       | Primary table has nested placeholders with semicolons (e.g., `{{incl_borrowed_money;incl_accrued_interest;...}}`) that may confuse GPT output | Simplify to single `{{key_inclusions}}` with guidance in Process Steps                  |
| 1.2 | **Double-count table assumes findings** | Secondary table template expects specific double-count items; produces empty/awkward output if none found                                     | Add conditional guidance: "If no double-counts detected, state explicitly"              |
| 1.3 | **Gap check lacks specificity**         | Step 5 says "identify common missing items" but doesn't define what qualifies as a gap                                                        | Provide concrete checklist: escrows, bonuses, leases, tax accruals, pension liabilities |

### Medium Priority

| #   | Issue                                  | Description                                                                        | Recommendation                                         |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1.4 | **Prose-to-bullets instruction vague** | Step 2 says "convert long prose into bullet points" without format guidance        | Specify max 5 bullets per inclusion/exclusion category |
| 1.5 | **Bias guidance disconnected**         | Bias Rating Guidance table gives examples but isn't linked to main output workflow | Reference bias table explicitly in Process Step 3      |

### Low Priority

| #   | Issue                                    | Description                                                                              | Recommendation                                                     |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1.6 | **Follow-on prompt #4 overly ambitious** | "Draft buyer-favorable and seller-favorable redline language" is complex for a follow-on | Simplify to "Highlight which definitions need negotiation and why" |

---

## 02-purchase-price.md

### High Priority

| #   | Issue                               | Description                                                                                                                     | Recommendation                                                                |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 2.1 | **Price Bridge table too wide**     | 6 columns with complex placeholders; GPT may truncate or misformat                                                              | Consider splitting into Economics table + Adjustments table                   |
| 2.2 | **IC Summary script inconsistency** | 30-second script placeholders don't match table columns (e.g., `{{locked_box_or_closing_accounts}}` vs table's "pricing basis") | Align script placeholders with table terminology                              |
| 2.3 | **Step 5-6 scope creep**            | "Map payment waterfall" and "funds flow" extend beyond SPA text analysis into operational guidance                              | Clarify: extract what SPA says about payments, not operational implementation |

### Medium Priority

| #   | Issue                                        | Description                                                                  | Recommendation                                                          |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 2.4 | **Contingent consideration cross-reference** | Step 7 says "link to Playbook 04" but doesn't explain how                    | Add: "If earnout present, note 'See Playbook 04 for detailed analysis'" |
| 2.5 | **Escrow purpose not captured**              | Table has `{{escrow_amount_and_purpose}}` but purpose categories not defined | Define: indemnity, PPA, earnout, special indemnity escrows              |

### Low Priority

| #   | Issue                              | Description                                                              | Recommendation                                                  |
| --- | ---------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 2.6 | **Benchmark references too broad** | Points to two benchmark sections without specifying which metrics to use | List specific metrics: PPA prevalence, escrow %, timeline norms |

---

## 03-wc-net-debt.md

### High Priority

| #   | Issue                                | Description                                                                      | Recommendation                                                                        |
| --- | ------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 3.1 | **Historical data requirement**      | Table C asks for DSO/DIO/DPO historical ranges but this data is rarely in an SPA | Reframe: "If historical data available from diligence..." or mark as optional         |
| 3.2 | **Three output tables overwhelming** | Bucket Mapping + Double-Count + NWC Reasonableness is too much for one analysis  | Make Table C (NWC Reasonableness) a follow-on prompt output                           |
| 3.3 | **"TBD" bucket creates ambiguity**   | Bucket mapping allows "TBD" which provides no actionable guidance                | Replace with "Requires negotiation - no clear precedent" with specific recommendation |

### Medium Priority

| #   | Issue                                    | Description                                                               | Recommendation                                                        |
| --- | ---------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 3.4 | **Decision tree not provided**           | Step 3 references a "decision tree" but doesn't include one               | Add inline decision tree or reference to standard framework           |
| 3.5 | **Collar/de minimis analysis sparse**    | Mentioned but no guidance on what constitutes favorable/unfavorable terms | Add benchmark: typical collar is +/- 1-2% of target                   |
| 3.6 | **Seasonality assessment outside scope** | Step 6 asks about seasonality which requires operational knowledge        | Reframe as "flag if NWC target appears to be at seasonal peak/trough" |

### Low Priority

| #   | Issue                                           | Description                                                  | Recommendation                                   |
| --- | ----------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| 3.7 | **"Highly negotiated, deal-specific" overused** | Deferred revenue, taxes, intercompany all get this treatment | Provide more specific guidance for each category |

---

## 04-earnouts.md

### High Priority

| #   | Issue                                     | Description                                                                 | Recommendation                                                                                       |
| --- | ----------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 4.1 | **Table A has 10 rows**                   | Earnout Summary table is very long; critical items may get buried           | Split into: Economics table (amount, metric, period) + Risk table (covenants, set-off, acceleration) |
| 4.2 | **Set-off analysis complex**              | Set-off rights require careful legal reading; GPT may oversimplify          | Add specific extraction guidance: look for "offset", "withhold", "reduce" language                   |
| 4.3 | **Accounting basis interpretation risky** | Determining "GAAP vs past practice vs specified policies" requires judgment | Provide specific textual markers for each category                                                   |

### Medium Priority

| #   | Issue                                  | Description                                                                                                   | Recommendation                                                                                                                             |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 4.4 | **Acceleration triggers incomplete**   | Lists "change of control, breach, termination" but misses sale of assets, IPO                                 | Expand trigger list to 6-8 common scenarios                                                                                                |
| 4.5 | **Risk Assessment duplicates Table A** | Table B covers same topics as Table A but with "Risk Level"                                                   | Consolidate: add Risk Level column to Table A instead of separate table                                                                    |
| 4.6 | **No “must-flag” checklist output**    | Earnouts often fail on a few predictable drafting gaps, but the playbook doesn’t force a quick checklist pass | Add a short “Must‑Flag Checklist” block (5–10 items) covering: policy elections, allocations, examples, info-rights, audit, set-off timing |

### Low Priority

| #   | Issue                                    | Description                                                                    | Recommendation                                           |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 4.7 | **Follow-on prompt #5 too quantitative** | "Quantify the earnout: scenarios (bear/base/bull)" requires financial modeling | Reframe as "Identify key drivers of earnout achievement" |

---

## 05-reps-warranties.md

### High Priority

| #   | Issue                                      | Description                                                                  | Recommendation                                                                                                   |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 5.1 | **FDD-relevant filtering subjective**      | "Focus first on FDD-relevant reps" without defining which are FDD-relevant   | List explicitly: Financial Statements, Undisclosed Liabilities, Taxes, Material Contracts, Employees, Compliance |
| 5.2 | **Qualifier Impact table overly abstract** | Impact descriptions like `{{raises_burden_of_proof}}` need concrete guidance | Provide specific impact language for knowledge vs materiality vs MAE qualifiers                                  |
| 5.3 | **Missing "sandbagging" analysis**         | No mention of pro-sandbagging vs anti-sandbagging provisions                 | Add as key qualifier type to analyze                                                                             |

### Medium Priority

| #   | Issue                                   | Description                                                     | Recommendation                                                                         |
| --- | --------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 5.4 | **Fundamental Reps table may be empty** | Not all SPAs define "Fundamental Reps" explicitly               | Add fallback: "If not explicitly defined, identify reps with enhanced survival/no cap" |
| 5.5 | **Bring-down standard incomplete**      | Step 3 mentions bring-down but template doesn't capture it well | Add specific row in Table A for bring-down conditions                                  |
| 5.6 | **Schedule quality assessment vague**   | Notes `{{schedule_quality + diligence ask}}` without guidance   | Define quality criteria: completeness, specificity, exceptions breadth                 |

### Low Priority

| #   | Issue                           | Description                                                          | Recommendation                                                         |
| --- | ------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 5.7 | **No RWI integration guidance** | Mentions RWI in bias guidance but doesn't explain impact on analysis | Add note: "If RWI in place, note which reps are insurable vs excluded" |

---

## 06-commercial-terms.md

### High Priority

| #   | Issue                                     | Description                                                                        | Recommendation                                                      |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 6.1 | **20-item table too ambitious**           | Key Terms Table B lists 20 items; GPT will produce inconsistent quality across all | Prioritize to top 12 items; move others to follow-on prompts        |
| 6.2 | **"Inherit bias from relevant category"** | Bias guidance says to inherit but GPT may not cross-reference effectively          | Provide inline bias examples for the 8 most common commercial terms |
| 6.3 | **1-Page IC Summary overloaded**          | 8 bullet points with sub-items; likely to exceed one page                          | Reduce to 5 key bullets with clearer structure                      |

### Medium Priority

| #   | Issue                                     | Description                                                           | Recommendation                                                                         |
| --- | ----------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 6.4 | **Top 3 issues selection unclear**        | Template asks for "Top 3 issues (🔴 first)" but no selection criteria | Add: "Prioritize by: 1) Cash impact >$X, 2) Litigation risk, 3) Deal certainty impact" |
| 6.5 | **Non-standard clause detection generic** | Step 6 says "flag non-standard" without benchmark                     | Reference benchmarks.md for each term; flag if outside ranges                          |

### Low Priority

| #   | Issue                                    | Description                                                               | Recommendation                                                    |
| --- | ---------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 6.6 | **Employee/benefits row underspecified** | Just says `{{bonuses/severance/benefits}}` without deal economics framing | Reframe: "Cash leakage from seller-borne employee costs at close" |

---

## 07-redline.md

### High Priority

| #   | Issue                                     | Description                                                                                            | Recommendation                                                                                                       |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 7.1 | **3-level bias inconsistent**             | Uses 3-level (Buyer/Neutral/Seller) while all other playbooks use 5-level                              | Standardize to 5-level for consistency OR add explicit rationale for simpler scale                                   |
| 7.2 | **Market benchmarks inline**              | Lists specific benchmark values (escrow 9-10%, survival 12-18 mo) instead of referencing benchmarks.md | Move to reference: "See benchmarks.md#escrows for current market data"                                               |
| 7.3 | **Layer 3 Change Log scope unclear**      | "Material changes only" but materiality not defined                                                    | Define: High = >1% of deal value or survival/cap impact; Medium = process/timing; Low = clarification                |
| 7.4 | **Section Ref can’t trace both versions** | Redline outputs compare vA vs vB, but templates only provide one `Section Ref`                         | Add `Section Ref (vA)` + `Section Ref (vB)` columns (or a single `Section Refs` column that contains both citations) |

### Medium Priority

| #   | Issue                                 | Description                                                                     | Recommendation                                                                               |
| --- | ------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 7.5 | **Sleeper change detection unguided** | Great concept but no specific markers to look for                               | List common sleepers: notice periods, exclusive remedy, anti-reliance, merger clause changes |
| 7.6 | **Layer 2 themes may not all apply**  | 5 fixed themes (PP, WC, Earnout, R&W, Covenants) but deal may not have all      | Add: "Include only applicable themes; note 'N/A' for absent categories"                      |
| 7.7 | **Two-document requirement unclear**  | Step 1 says ask for second doc if only one provided, but UX could handle better | Add specific prompt: "Please upload the second version (earlier draft) for comparison"       |

---

## 08-roleplay.md

### High Priority

| #   | Issue                                     | Description                                                                  | Recommendation                                                                               |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 8.1 | **Standard Arguments Reference too long** | 16 topics with buyer/seller positions inline; makes playbook unwieldy        | Move to separate reference section or appendix; keep 6-8 most common inline                  |
| 8.2 | **Common Trade-Offs list static**         | 10 fixed trade-offs may not apply to all deals                               | Preface with: "Consider relevant trades from this list based on deal priorities"             |
| 8.3 | **Red Line Assessment requires judgment** | Distinguishing "true red line vs posturing" is nuanced; GPT may oversimplify | Add markers: "True red line indicators: legal/regulatory, board-mandated, repeated position" |

### Medium Priority

| #   | Issue                                | Description                                                                                   | Recommendation                                                                                                    |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 8.4 | **Scripts too generic**              | Opening/Pushback/Close scripts have placeholders but lack deal-specific adaptation            | Provide 2-3 example scripts showing filled-in versions                                                            |
| 8.5 | **No counterparty persona guidance** | Roleplay would benefit from characterizing counterparty (PE vs strategic, etc.)               | Add step: "Identify counterparty type and typical priorities"                                                     |
| 8.6 | **Follow-on prompt #1 complex**      | "Roleplay this clause live" requires multi-turn interaction                                   | Reframe as single-response simulation with both sides                                                             |
| 8.7 | **No “practice mode” structure**     | The roleplay can feel like a one-shot script instead of a useful back-and-forth training tool | Add an optional “Practice Mode”: pre-brief → 2–3 rounds → 1 curveball → debrief with what worked/what to try next |

### Low Priority

| #   | Issue                        | Description                               | Recommendation                                  |
| --- | ---------------------------- | ----------------------------------------- | ----------------------------------------------- |
| 8.8 | **Market benchmarks sparse** | Only 4 benchmark categories listed inline | Expand or reference full benchmarks.md sections |

---

## system-prompt.md

### High Priority

| #   | Issue                                              | Description                                                                        | Recommendation                                                                                  |
| --- | -------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 9.1 | **Routing table overlap**                          | Multiple keywords map to multiple playbooks (e.g., "Working Capital" in 01 and 03) | Add precedence rules: "If analyzing definitions, use 01; if analyzing mechanics/target, use 03" |
| 9.2 | **"Run exactly ONE playbook" may frustrate users** | Users asking broad questions may expect comprehensive analysis                     | Add: "For comprehensive review, recommend running playbooks in sequence: 01 → 02 → 06"          |
| 9.3 | **No error handling for missing content**          | What happens if SPA is incomplete or heavily redacted?                             | Add guidance: "If key sections appear missing or redacted, ask user to confirm scope"           |

### Medium Priority

| #   | Issue                                 | Description                                                             | Recommendation                                                                      |
| --- | ------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 9.4 | **Menu presentation undefined**       | "Propose a numbered menu (3-5 options)" but format not specified        | Provide example menu format with reasoning snippets                                 |
| 9.5 | **"Deal economics lens" vague**       | Good principle but not actionable                                       | Expand: "For each finding, state: cash impact, timing, dispute risk"                |
| 9.6 | **Follow-on prompt enforcement weak** | Says "End every response with 5 Follow-on Prompts" but may be forgotten | Emphasize: "ALWAYS end with exactly 5 numbered follow-on prompts from the playbook" |

### Low Priority

| #   | Issue                                 | Description                                | Recommendation                                                                        |
| --- | ------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| 9.7 | **Scope boundaries could be clearer** | "Politely decline" but no example language | Add template: "That's outside my SPA analysis scope. I can help with [alternatives]." |

---

## benchmarks.md

### High Priority

| #    | Issue                            | Description                                                                                  | Recommendation                                 |
| ---- | -------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 10.1 | **Missing benchmark categories** | No benchmarks for: MAC/MAE carve-outs, materiality scrape prevalence, termination fee ranges | Add 2-3 rows for missing high-value categories |

### Medium Priority

| #    | Issue                                      | Description                                       | Recommendation                                                                              |
| ---- | ------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 10.2 | **Definition Standards section thin**      | Only 4 entries vs 6+ in other sections            | Expand with: accounting hierarchy preferences, common exclusions, past practice definitions |
| 10.3 | **Quick Reference Card duplicates tables** | Same data in two places risks drift               | Remove duplication; make QRC reference-only with table row citations                        |
| 10.4 | **Source Index lacks version info**        | URLs listed but no indication of publication date | Add publication year next to each source                                                    |

### Low Priority

| #    | Issue                             | Description                                    | Recommendation                                                        |
| ---- | --------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| 10.5 | **Geography limitation unstated** | Most benchmarks are US-focused but not labeled | Add note: "Benchmarks primarily reflect US middle-market private M&A" |

---

## Documentation (spec + plan)

### High Priority

| #    | Issue                                    | Description                                                                                               | Recommendation                                                                                                                      |
| ---- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 12.1 | **Docs don’t match shipped file layout** | Spec/plan reference paths and a `gpt/` deliverable layout, but the current distribution lives in `dist/*` | Pick one source of truth (rename/move files to match docs, or update docs to match `dist/*`) and update all references consistently |

### Medium Priority

| #    | Issue                                          | Description                                                                                                                        | Recommendation                                                                                                  |
| ---- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 12.2 | **Scope mismatch vs system prompt**            | Spec includes “General Q&A on SPAs and M&A legal topics,” but system prompt scope is narrower (“ONLY” SPA + deal-term analysis)    | Decide the intended scope (strict SPA-only vs broader M&A Q&A) and align spec + system prompt wording           |
| 12.3 | **Bias-scale consistency needs a decision**    | Spec says the bias scale is consistent “across all analyses,” but `07-redline.md` uses a simplified 3-level scheme today           | Either standardize Redline to 5-level, or explicitly document the Redline exception (and why)                   |
| 12.4 | **Validation checklist missing key UX checks** | Plan validation focuses on citations/benchmarks/line-count, but doesn’t check bias direction clarity or Redline vA/vB traceability | Add explicit validation checks: (a) bias is always Buyer/Seller/Neutral + severity, (b) Redline cites vA and vB |

---

## Cross-Cutting Issues

### High Priority

| #    | Issue                                      | Description                                                                                                                                                              | Recommendation                                                                                                                                     |
| ---- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11.1 | **Table sorting instruction unreliable**   | "Sort 🔴 then 🟠 then 🟢" assumes GPT can reliably sort; often fails                                                                                                     | Pre-sort template rows or use numbered severity (1-5) alongside emoji                                                                              |
| 11.2 | **Placeholder syntax inconsistent**        | Some use `{{value}}`, some use `{{value;value2}}`, some use `{{value + note}}`                                                                                           | Standardize: single placeholders only; move multi-part to separate columns                                                                         |
| 11.3 | **Confidence criteria undefined globally** | Each playbook mentions confidence but no consistent framework                                                                                                            | Add to system prompt: "High = explicit, unambiguous; Medium = requires interpretation; Low = discretion/missing"                                   |
| 11.4 | **Bias indicators lose directionality**    | Most playbook tables use `Bias = {{bias_emoji}}`, but the system prompt says to use direction + emoji; emoji alone can’t distinguish Buyer-Favorable vs Seller-Favorable | Change templates to output `Bias = {{Buyer-Favorable 🟠 / Seller-Favorable 🟠 / Neutral 🟢 / ...}}` OR split into `Direction` + `Severity` columns |

### Medium Priority

| #    | Issue                                              | Description                                                                                                                                        | Recommendation                                                                                                                                                              |
| ---- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 11.5 | **Playbook length varies significantly**           | 07-redline is 65 lines; 08-roleplay is 92 lines; some approach 100                                                                                 | Review and trim verbose playbooks; target 70-85 lines each                                                                                                                  |
| 11.6 | **No versioning or refresh metadata**              | Files have no version/“last updated” tracking, so it’s hard to know what’s current                                                                 | Add a simple header to each file: `Version: 2.0                                                                                                                             | Last updated: YYYY-MM-DD` (for benchmarks also add “Refresh cadence: annually”) |
| 11.7 | **“Not found” behavior not embedded in templates** | System prompt says to output “Not found in document…”, but most tables don’t specify how to represent missing clauses (blank cells vs “Not found”) | Add a consistent rule per playbook: if not found, set `Section Ref` to `Not found in document — typically in {{expected_location}}` and set extracted fields to `Not found` |

### Low Priority

| #    | Issue                                | Description                                             | Recommendation                                                                                    |
| ---- | ------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 11.8 | **Follow-on prompts quality varies** | Some are actionable, some are vague or overly complex   | Review each playbook's follow-ons for consistency and actionability                               |
| 11.9 | **No glossary or term mapping**      | SPA terminology may vary; no mapping to common variants | Add appendix mapping common term variants (e.g., "Net Debt" = "Indebtedness" = "Debt-Like Items") |

---

## Summary Statistics

| Module                      | High   | Medium | Low    | Total  |
| --------------------------- | ------ | ------ | ------ | ------ |
| 01-definitions              | 3      | 2      | 1      | 6      |
| 02-purchase-price           | 3      | 2      | 1      | 6      |
| 03-wc-net-debt              | 3      | 3      | 1      | 7      |
| 04-earnouts                 | 3      | 3      | 1      | 7      |
| 05-reps-warranties          | 3      | 3      | 1      | 7      |
| 06-commercial-terms         | 3      | 2      | 1      | 6      |
| 07-redline                  | 4      | 3      | 0      | 7      |
| 08-roleplay                 | 3      | 4      | 1      | 8      |
| system-prompt               | 3      | 3      | 1      | 7      |
| benchmarks                  | 1      | 3      | 1      | 5      |
| Documentation (spec + plan) | 1      | 3      | 0      | 4      |
| Cross-Cutting               | 4      | 3      | 2      | 9      |
| **TOTAL**                   | **34** | **34** | **11** | **79** |

---

## Remediation Roadmap

### Phase 1: Foundation Fixes (High Priority)

Focus on cross-cutting issues and system prompt first, as these affect all playbooks.

1. Standardize placeholder syntax across all files
2. Define confidence criteria in system prompt
3. Add routing precedence rules
4. Fix table sorting approach (add severity numbers)
5. Fix bias direction + severity (direction + emoji) across templates
6. Align docs spec + plan to actual file layout

### Phase 2: Module-by-Module Overhaul

Address each playbook's high-priority issues in order:

1. **01-definitions**: Simplify templates, add gap checklist
2. **02-purchase-price**: Split tables, align IC script
3. **03-wc-net-debt**: Make Table C optional, add decision tree
4. **04-earnouts**: Consolidate tables, expand triggers
5. **05-reps-warranties**: Define FDD-relevant list, add sandbagging
6. **06-commercial-terms**: Reduce to 12 items, inline bias examples
7. **07-redline**: Standardize to 5-level bias, add vA/vB Section Refs, reference benchmarks
8. **08-roleplay**: Trim Standard Arguments, add counterparty guidance

### Phase 3: Polish & Testing

1. Update benchmarks with missing categories
2. Review and standardize follow-on prompts
3. Test each playbook with sample SPA documents
4. Document edge cases and update guidance

---

## Next Actions

- [ ] Review and approve this issue list
- [ ] Prioritize which modules to overhaul first
- [ ] Begin Phase 1 foundation fixes
- [ ] Schedule detailed review sessions for each module
