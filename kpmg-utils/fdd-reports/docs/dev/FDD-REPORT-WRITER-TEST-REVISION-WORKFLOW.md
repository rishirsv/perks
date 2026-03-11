---
status: active
last-reviewed: 2026-03-11
source-of-truth: docs/dev/FDD-REPORT-WRITER-TEST-REVISION-WORKFLOW.md
verification-state: verified
---

# DEV: FDD Report Writer Test-to-Revision Workflow

This document captures the exact workflow used in the March 2026 manual testing and rewrite round for the `fdd-report-writer` skill.

Use it when:
- a manual test round has been completed
- the testing log contains user feedback or failure notes
- one or more section references need to be refined
- the goal is to turn testing outcomes into precise contract edits without over-expanding the references

This is a development workflow. Keep it in `docs/dev/` so the skill bundle stays focused on the portable skill and section-reference artifacts.

## What This Workflow Produces

For each revision round, the expected deliverables are:

1. An updated testing log with prompts, outputs, user feedback, and revised evaluation notes
2. A prioritized revision backlog derived from the test results
3. Targeted updates to `skill/fdd-report-writer/SKILL.md` where routing, output shape, or artifact boundaries need to change
4. Targeted updates to one or more section references under `skill/fdd-report-writer/references/`
5. A short round summary saved in docs so later testing rounds can follow the same process

## Core Operating Principles

1. Start from the test evidence, not from abstract preference. If a behavior was not observed in testing, do not expand the contract just because it sounds elegant.
2. Prefer small, precise edits over sprawling rewrites unless the test log shows a structural failure.
3. Fix the right layer first:
   - main `SKILL.md` for routing, artifact shape, rewrite vs polish vs draft, and guardrails
   - section references for section-specific structure, tone, and analytical sequencing
   - testing log for revision themes and user feedback
4. Preserve strong behaviors. A section that is already substantively strong usually needs structure and formatting refinement, not a redesign.
5. Use positive behavior guidance by default. Add anti-pattern checks only when a recurring failure is too specific to correct cleanly through positive wording alone.
6. Keep references page-aware when the real outputs are slide-shaped, but do not hard-gate them to one sample layout if the source data may support different topic groupings.
7. Treat output shapes as first-class. Many misses come from confusing:
   - section vs exhibit
   - overview vs adjustment page
   - full section vs narrow note
   - included adjustment vs excluded consideration
8. Keep libraries intact unless testing shows they are causing failures. Large narrative libraries are usually assets, not liabilities.
9. When a problem is really “the model does not know when to stop,” fix stopping rules rather than rewriting the analytical logic.
10. After editing, reread the file and ask: if I followed only this reference, could I reproduce the written shape of the desired output?

## Inputs For A Revision Round

Before editing, gather:

1. The testing log:
   `testing/fdd-report-writer-initial-test-cases.md`
2. The main skill file:
   `skill/fdd-report-writer/SKILL.md`
3. The active section reference(s) being revised:
   `skill/fdd-report-writer/references/<section>.md`
4. The conversation history or session notes containing:
   - exact prompts
   - exact responses
   - user feedback on what was strong
   - user feedback on what was wrong
5. Sample end-product artifacts when available, such as:
   - report sections
   - slide screenshots
   - exhibit screenshots
   - page-level topic grouping examples

## Exact Workflow Used In This Round

### Phase 1: Expand the testing log

Update the testing file first so it becomes the working source of truth for the revision round.

Capture:
- prompt text
- whether the skill triggered
- actual output or the exact response text
- user feedback
- pass / pass with note / removed / non-trigger result

If later manual checks are run, append them as second-pass or third-pass expansions rather than scattering them into chat history only.

### Phase 2: Convert feedback into revision themes

Before editing any reference, summarize the feedback into a prioritized issue list.

For this round, the main issue families were:
- QoE section vs bridge / exhibit confusion
- adjustment-led formatting expectations
- business overview grouped-bullet structure
- net debt exhibit shape and cash-definition discipline
- reporting environment grouped topic blocks
- NWC page-family awareness and selective metric treatment

The testing log should be updated so these themes are visible before reference edits begin.

### Phase 3: Fix the main skill contract first

Review `SKILL.md` before changing the section references if the failures involve:
- trigger language
- output shape
- section vs exhibit routing
- draft vs rewrite vs polish selection
- reference-loading rules
- user-precedence rules
- universal guardrails

In this round, `SKILL.md` was updated to:
- use a trigger-focused description
- default to the narrowest requested artifact
- distinguish `section`, `exhibit`, and `full_report`
- route based on source condition for `draft`, `rewrite`, and `polish`
- load only the needed reference files
- add user-precedence guidance
- add guardrails against collapsing sections into brief commentary or widening narrow asks

### Phase 4: Rewrite section references one by one in priority order

Use the testing log to decide the next section to tackle.

Priority order used in this round:

1. `quality-of-earnings.md`
2. `net-debt.md`
3. `business-overview.md`
4. `reporting-environment.md`
5. `net-working-capital.md`

For each section:

1. Review the current reference against the test failures and the sample desired output.
2. Write a top-to-bottom critique with prioritized findings.
3. Decide whether the file needs:
   - structural rewrite
   - precision pass
   - formatting pass
   - verification-only cleanup
4. Make the smallest edit set that reliably fixes the observed failure mode.
5. Reread and ask whether the revised reference could now generate the desired written output shape.

### Phase 5: Tighten recurring failure patterns precisely

When a bad output is caused by redundant or generic phrasing rather than by wrong logic, fix it with a stopping rule.

Example from this round:
- NWC generated: `Excluding this balance avoids distorting the average net working capital analysis.`
- The issue was not analytical accuracy.
- The issue was redundant explanatory language that is unnecessary in house style.

The fix was:
- strengthen the positive rule explaining the balance and perimeter logic
- explicitly stop once treatment is clear unless further implication is decision-useful
- add one verification question to catch generic restatement

### Phase 6: Preserve strong areas and avoid unnecessary redesign

Not every section needs a rewrite.

In this round:
- `quality-of-earnings.md` needed a real structural rewrite
- `net-debt.md` needed a precision pass
- `business-overview.md` needed grouped-bullet and perimeter-shape refinement
- `reporting-environment.md` needed a page-aware grouping pass
- `net-working-capital.md` needed page-family awareness and a stopping-rule refinement

### Phase 7: Do a polish verification pass after each edit

After editing each file:
- reread the full file
- check whether old framing still survives in lower sections or examples
- confirm examples teach the new contract rather than the old failure mode
- confirm the file can produce the desired written output shape without relying on unstated chat context

## Round Summary: What Changed

### 1. Main Skill Contract

`skill/fdd-report-writer/SKILL.md`

Changed:
- frontmatter description rewritten to be trigger-focused
- overview rewritten around narrowest-artifact behavior
- core instructions restructured around real decision flow
- output shape rules clarified for `section`, `exhibit`, and `full_report`
- `draft`, `rewrite`, and `polish` anchored to source condition
- reference loading narrowed to only the required files
- user-precedence rules added
- guardrails added for section collapse, scope widening, and fragmented formatting

### 2. Quality Of Earnings

`skill/fdd-report-writer/references/quality-of-earnings.md`

Changed:
- re-anchored around the real QoE package
- `Overview` treated as the main section-level starting point
- `Basis of presentation` and `Adjustments` treated as overview subsections
- `Due diligence adjustments` treated as a distinct primary section
- bridge-slide commentary treated as a separate exhibit pattern
- `Other considerations` added as a primary QoE section
- comprehensive adjustment narrative library preserved
- deal-specific adjustments preserved
- examples and verification updated to match the new QoE package

Primary failure corrected:
- full QoE sections reading like bridge commentary rather than section-level QoE content

### 3. Net Debt

`skill/fdd-report-writer/references/net-debt.md`

Changed:
- exhibit-sized net debt notes made more explicit
- cash-definition guidance tightened around total cash, excluded cash, and available cash
- formatting clarified to favor a short lead-in plus bold line-item commentary in schedule order
- math-reconciliation and contested-item checks added
- example openings tightened to better match schedule-note shape

Primary failure corrected:
- strong substance but inconsistent exhibit note formatting and cash-definition articulation

### 4. Business Overview

`skill/fdd-report-writer/references/business-overview.md`

Changed:
- reframed toward a concise `company overview` block
- grouped bullets made explicit as the default rather than flat fact bullets
- legal structure / transaction perimeter context added as an optional component
- workflow and verification updated to preserve grouped overview structure
- examples tightened toward denser, more intentional bullets

Primary failure corrected:
- outputs that were substantively right but too flat or too loosely grouped for the intended overview format

### 5. Reporting Environment

`skill/fdd-report-writer/references/reporting-environment.md`

Changed:
- broad reporting-environment asks made more page-aware
- grouped topic blocks made the default shape for broad asks
- topic selection made source-driven rather than tied to one fixed sample-page checklist
- short scope or disclaimer framing lines supported more explicitly
- `Accounting policy summary` renamed to `Accounting policy topics`
- verification updated to check grouped topic-block commentary

Primary failure corrected:
- strong content that needed a more explicit grouped page structure

### 6. Net Working Capital

`skill/fdd-report-writer/references/net-working-capital.md`

Changed:
- clarified support for `Overview`, `Due diligence adjustments`, `Pro forma adjustments`, and narrow notes
- made DSO / DPO / DIO / seasonality commentary selective rather than default
- made page-family shape explicit across workflow, formatting, and verification
- kept the adjustment library intact
- added a precise stopping rule for adjustment commentary

Primary failures corrected:
- implicit single-shape NWC contract
- over-explanation in otherwise correct adjustment wording

## Repeatable Future Process

Use this exact sequence in later testing rounds.

### Step 1: Expand the testing doc first

Always update the testing file before changing references.

For each new prompt:
- add the prompt
- add the exact or summarized output
- add the user’s review comments
- mark pass / pass with note / fail / non-trigger

### Step 2: Convert test outcomes into issue families

Create a short prioritized issue list before editing.

Useful categories:
- output shape confusion
- formatting contract misses
- unnecessary generic explanation
- unsupported inference or overstatement
- missed optionality rules
- strong behavior to preserve

### Step 3: Decide the right layer to edit

Use this rule:

- Edit `SKILL.md` if the issue is about routing, trigger language, artifact shape, scope control, or rewrite-vs-draft behavior.
- Edit a section reference if the issue is about local structure, local wording pattern, local sequencing, or local verification.
- Edit both only if the issue spans global routing and local section behavior.

### Step 4: Review one section at a time

For the next section in queue:

1. review the current reference against the test prompts and outputs
2. review sample target outputs if available
3. write top-to-bottom findings
4. rank them by priority
5. propose the smallest edit set that fixes the observed misses

### Step 5: Prefer positive contract changes

Default approach:
- refine the desired behavior
- clarify output shape
- tighten stopping rules
- improve verification questions

Use anti-pattern checks only when:
- the failure is recurring
- the failure is highly specific
- the positive rule alone is not enough

### Step 6: Preserve strong sections

If the section is already strong:
- do not redesign it
- make only the structural or formatting edits needed to support the desired final output shape

### Step 7: Verify after patching

After editing:
- reread the file in full
- check the top half and lower half for conflicting guidance
- check examples and verification questions
- ask whether the written output could now be recreated from the reference alone

## Artifact-Shape Heuristics From This Round

These were the most important contract lessons.

### Main skill

- `section` and `exhibit` must be treated as distinct output shapes
- narrow asks should stay narrow
- section asks should not collapse into mini exhibit commentary

### Quality of earnings

- `Overview` is the main section-level entry point
- `Due diligence adjustments`, `Bridge slide commentary`, and `Other considerations` are distinct shapes
- bridge commentary should not become the default full-section structure

### Net debt

- the preferred exhibit note shape is:
  - short lead-in
  - bold line-item commentary
  - schedule order
- total cash, excluded cash, and available cash should reconcile explicitly when provided

### Business overview

- bullets are valid, but they should be grouped overview bullets rather than disconnected facts
- legal structure or perimeter context should appear when it helps define the acquired business

### Reporting environment

- broad asks should become grouped topic blocks
- topics should come from the source material, not from a hard-coded topic list

### Net working capital

- `Overview`, `Due diligence adjustments`, and `Pro forma adjustments` are distinct output shapes
- metrics like DSO/DPO/seasonality should expand only when they materially improve interpretation
- standard adjustment wording should stop once balance and perimeter logic are clear

## Suggested Checklist For Future Testing Rounds

- [ ] Update the testing log with exact prompts and outputs
- [ ] Capture user feedback before editing references
- [ ] Summarize revision themes in prioritized order
- [ ] Review whether the issue belongs in `SKILL.md`, a section reference, or both
- [ ] Tackle one section at a time in priority order
- [ ] Preserve existing strong narrative libraries unless testing shows they are harmful
- [ ] Add or revise verification checks only where they help catch the actual failure
- [ ] Reread each edited file as a standalone authoring contract
- [ ] Save a round summary in docs after the edit pass

## Recommended Format For The Next Round Summary

When the next testing round is completed, use this structure:

1. `Round purpose`
2. `New prompts added`
3. `New user feedback captured`
4. `Updated priority issue list`
5. `Files changed`
6. `Per-file summary of changes`
7. `New verification rules added`
8. `Open follow-ups for the next round`

## Open Follow-Up For Later

The next likely step after additional manual rounds is to turn the testing doc into a more repeatable regression harness that can track:
- output shape
- route selection
- section-specific formatting checks
- support-discipline checks
- post-change regression review

Do not do that prematurely. Keep the manual round as the source of truth until the section contracts stabilize.
