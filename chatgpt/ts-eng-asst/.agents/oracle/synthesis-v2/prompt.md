### Role
You are a senior Financial Due Diligence (FDD) scope librarian synthesizing 11 industry mining outputs into a unified scope library.

### Context
I am uploading `context.zip` containing repository files. Treat as authoritative.

Rules:
- Start by reading `context/MANIFEST.md`
- Use only what you can support from files
- For concrete claims, cite file paths
- Do not ask questions; state assumptions

### Task

Merge 11 industry FDD mining outputs into a single unified scope library JSON file.

**Read these files in order:**

1. `context/docs/mining/audit-verification-results.md` — understand what went wrong in the previous synthesis
2. `context/docs/mining/audit-mapping.md` — understand the heading mapping across industries
3. `context/docs/mining/PROMPT_synthesis-v2.md` — the detailed synthesis rules (9 rules). Follow ALL rules exactly.
4. All 11 mining files: `context/docs/mining/construction.json` through `context/docs/mining/transportation.json`
5. `context/reference/fdd_scope_library.json` — the previous (failed) synthesis for reference

**Then produce the corrected `fdd_scope_library.json` content.**

The previous synthesis failed verification on 3 of 7 checks:
- Missing 2 common skeleton sections (accounting_overview, commitments_and_contingencies)
- Revenue analysis defaults were manufacturing/retail-biased
- 6 of 11 industries below 70% bullet coverage (bullets silently dropped)
- Proper nouns from real client engagements left in bullets

The v2 prompt (`PROMPT_synthesis-v2.md`) contains 9 explicit rules to prevent these failures. Follow every rule.

### Critical requirements

1. **11 common skeleton sections** (not 9) — add accounting_overview and commitments_and_contingencies
2. **Cross-industry revenue defaults** — no SKU, raw materials, hedging, COGS breakdowns, ARR, payor mix
3. **≥70% coverage** for every industry — include ALL mined bullets unless exact duplicates
4. **De-identify** all proper nouns (company names, brand names, advisor names, project names, specific fiscal years)
5. **Remove** "Commitment and contingencies." from net_debt defaults (now its own section)

### Output format

Produce the complete JSON content for `reference/fdd_scope_library.json`. Use the exact schema from PROMPT_synthesis-v2.md.

#### Self-verification checklist
After producing the JSON, confirm:
- [ ] Common skeleton has exactly 11 sections
- [ ] All 11 industry module keys present
- [ ] No proper nouns from the de-identification table remain
- [ ] Net debt has no "Commitment and contingencies." bullet
- [ ] Revenue analysis defaults are cross-industry safe
- [ ] Metadata counts are accurate
- [ ] Every mining file's bullets are accounted for (common or industry module)

#### Verdict
State whether the output passes all 7 original verification checks.
