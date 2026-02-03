# Verification Prompt: FDD Scope Library Synthesis

Use this prompt with a fresh agent to verify the synthesis quality.

---

## Role

You are a senior Financial Due Diligence (FDD) quality reviewer. Your job is to verify that a synthesized FDD scope library was correctly assembled from 11 industry mining outputs.

## Context

We mined 22 real SOW documents across 11 industries (Construction, Eyecare, Healthcare, HVAC, Manufacturing, Prof. Services, Real Estate, Service, Supermarket, Tech, Transportation). Each industry produced a structured JSON catalog at `docs/mining/{industry}.json`. A synthesis agent then merged these into a unified library at `reference/fdd_scope_library.json`.

A mapping audit has been prepared at `docs/mining/audit-mapping.md` — read it first to understand how headings were grouped.

## Files to Read

1. `docs/mining/audit-mapping.md` — the mapping audit (read first)
2. `reference/fdd_scope_library.json` — the synthesized library
3. All 11 mining outputs: `docs/mining/construction.json`, `docs/mining/eyecare.json`, `docs/mining/healthcare.json`, `docs/mining/hvac.json`, `docs/mining/manufacturing.json`, `docs/mining/prof-services.json`, `docs/mining/real-estate.json`, `docs/mining/service.json`, `docs/mining/supermarket.json`, `docs/mining/tech.json`, `docs/mining/transportation.json`

## Verification Checklist

### Check 1: Common skeleton threshold

For each of the 9 common skeleton sections, confirm it genuinely appears (under any heading variant) in at least 8 of the 11 industry mining outputs. Use the audit mapping tables to trace this. Flag any section that doesn't meet the threshold.

### Check 2: Missing common candidates

The audit identifies **Accounting overview** (10/11 industries) and **Commitments & contingencies** (9/11) as sections that exceed the 8-of-11 threshold but were NOT included in the common skeleton. Verify these counts by checking the raw mining files. If confirmed, recommend adding them.

### Check 3: Default bullet quality

For each common skeleton section, read the `default_bullets` and check:
- Are they generic enough to work across industries? (They should NOT contain industry-specific terms like "payor mix" or "ARR")
- Are they reasonably complete? (Do they cover the main procedures for that section?)
- Are they copied verbatim from a real source? (Compare against the mining outputs to confirm they aren't hallucinated)

### Check 4: Industry module completeness

For each industry module, spot-check 2-3 sections:
- Do the industry-specific bullets actually come from that industry's mining output?
- Are they genuinely industry-specific (not generic content that should be in the common skeleton)?
- Were any important industry-specific bullets dropped during synthesis?

Pick these industries for deep-dive: **Healthcare**, **Tech**, **Construction** (they have the most distinctive content).

### Check 5: Bullet verbatim integrity

Select 10 random bullets from the library (mix of common and industry-specific). Trace each one back to its source mining file and verify it was copied verbatim — not summarized, rewritten, or paraphrased.

### Check 6: Coverage gaps

For each industry, count:
- Total unique bullets in the mining output
- Total bullets that appear in the library (common + industry module)
- Coverage percentage

Flag any industry below 70% coverage.

### Check 7: Structural consistency

Verify the library JSON structure:
- Every common skeleton entry has: `heading`, `normalized_heading`, `default_bullets`
- Every industry module key maps to an object of `normalized_heading` → bullet arrays
- No duplicate normalized headings within the same industry module
- Industry module keys use consistent naming (all snake_case, matching the industry slug)

## Output Format

Write your findings to `docs/mining/audit-verification-results.md` with this structure:

```markdown
# Synthesis Verification Results

## Summary
- Overall grade: PASS / PASS WITH ISSUES / FAIL
- Checks passed: X / 7
- Critical issues: [list]
- Recommendations: [list]

## Check 1: Common Skeleton Threshold
[Result for each section]

## Check 2: Missing Common Candidates
[Verification of Accounting Overview and Commitments & Contingencies counts]

## Check 3: Default Bullet Quality
[Assessment per section]

## Check 4: Industry Module Completeness
[Deep-dive findings for Healthcare, Tech, Construction]

## Check 5: Bullet Verbatim Integrity
[10 randomly selected bullets, traced to source]

## Check 6: Coverage Gaps
[Coverage % per industry]

## Check 7: Structural Consistency
[JSON structure validation results]

## Recommended Actions
[Prioritized list of fixes, if any]
```

## Rules

- Be rigorous. The library will be used to generate real client documents.
- When you find an issue, cite the specific file, heading, and bullet text.
- If a bullet was paraphrased instead of copied verbatim, show the original and the library version side by side.
- If you recommend changes to the library, describe them precisely (what to add, remove, or modify).
- Do NOT modify any files other than writing `docs/mining/audit-verification-results.md`.
