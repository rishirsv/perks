# Exemplar Patterns

Use this file to calibrate close calls and to write concrete fixes. These examples come from strong skills under `/Users/rishi/Code/ai-tools/reference/financial-services-plugins/`.

## Contents

- [How To Use This File](#how-to-use-this-file)
- [Primary Exemplars](#primary-exemplars)
- [Patterns Worth Rewarding](#patterns-worth-rewarding)
- [Example Fix Moves](#example-fix-moves)

## How To Use This File

- Read this file when a skill is close to `PASS` but you need calibration.
- Use these examples to decide whether a pattern is genuinely strong, not just present.
- Cite the pattern in `Suggested Fixes` when you want to show the author what "better" looks like.
- Do not copy finance-domain content into the audit. Reuse the instruction patterns.

## Primary Exemplars

### Best overall execution flow

- [`investment-banking/skills/pitch-deck/SKILL.md`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md)
  Why it is strong:
  - trigger-first description with exclusion clause
  - explicit reference-loading guidance
  - phased workflow plus validation loop
  - rich anti-pattern handling with recognition tests

### Best compact audit-adjacent skill

- [`financial-analysis/skills/audit-xls/SKILL.md`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/audit-xls/SKILL.md)
  Why it is strong:
  - scopes depth up front
  - uses tables instead of long prose
  - report-first, fix-on-request boundary
  - concise output contract

### Best compact workflow and guardrails

- [`private-equity/skills/deal-screening/SKILL.md`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/private-equity/skills/deal-screening/SKILL.md)
  Why it is strong:
  - short, trigger-rich description
  - asks for missing criteria explicitly
  - defines verdict shape and tempo
  - closes with memorable guardrails

### Best phased execution with approval gate

- [`financial-analysis/skills/deck-refresh/SKILL.md`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/deck-refresh/SKILL.md)
  Why it is strong:
  - environment check first
  - approval gate before editing
  - smallest-possible-change default
  - clear report of changed vs flagged items

### Best meta-skill design reference

- [`financial-analysis/skills/skill-creator/SKILL.md`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/skill-creator/SKILL.md)
  Why it is strong:
  - strong frontmatter guidance
  - progressive disclosure discipline
  - clear rules for references, scripts, and assets
  - explicit degrees-of-freedom guidance

## Patterns Worth Rewarding

### 1. Trigger logic, not summary text

Reward descriptions that say what the skill does, when it should fire, and when it should not.

Good examples:
- [`pitch-deck/SKILL.md#L1`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L1)
- [`deck-refresh/SKILL.md#L1`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/deck-refresh/SKILL.md#L1)
- [`deal-screening/SKILL.md#L3`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/private-equity/skills/deal-screening/SKILL.md#L3)

### 2. Explicit reference-loading guidance

Reward skills that say which references to read and when.

Good examples:
- [`pitch-deck/SKILL.md#L8`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L8)
- [`competitive-analysis/SKILL.md#L181`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/competitive-analysis/SKILL.md#L181)

### 3. Phase structure with gates

Reward workflows that route the task before execution and add approval or escalation gates where mistakes are expensive.

Good examples:
- [`deck-refresh/SKILL.md#L21`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/deck-refresh/SKILL.md#L21)
- [`pitch-deck/SKILL.md#L49`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L49)
- [`audit-xls/SKILL.md#L10`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/audit-xls/SKILL.md#L10)

### 4. Defaults, thresholds, and bounded branching

Reward skills that pick a default, define thresholds, and branch only where the task materially changes.

Good examples:
- [`portfolio-monitoring/SKILL.md#L34`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/private-equity/skills/portfolio-monitoring/SKILL.md#L34)
- [`dd-checklist/SKILL.md#L83`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/private-equity/skills/dd-checklist/SKILL.md#L83)
- [`competitive-analysis/SKILL.md#L94`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/competitive-analysis/SKILL.md#L94)

### 5. Output contracts that define done

Reward skills that specify the artifact type, section list, or exact output format.

Good examples:
- [`deal-screening/SKILL.md#L47`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/private-equity/skills/deal-screening/SKILL.md#L47)
- [`ib-check-deck/SKILL.md#L70`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/ib-check-deck/SKILL.md#L70)
- [`value-creation-plan/SKILL.md#L102`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/private-equity/skills/value-creation-plan/SKILL.md#L102)

### 6. Anti-patterns with recognition and correction

Reward anti-pattern handling that says how to spot the failure and what to do instead.

Good examples:
- [`pitch-deck/SKILL.md#L220`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L220)
- [`clean-data-xls/SKILL.md#L44`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/clean-data-xls/SKILL.md#L44)

### 7. Verification loops, not token checklists

Reward verification that includes observable checks, a retry limit, escalation, and delivery caveats when needed.

Good examples:
- [`pitch-deck/SKILL.md#L85`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L85)
- [`deck-refresh/SKILL.md#L77`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/deck-refresh/SKILL.md#L77)

## Example Fix Moves

Use these patterns when writing `Suggested Fixes`.

### Weak trigger -> strong trigger

Before:
- "This skill helps with deck updates."

After:
- "Update an existing deck with new numbers. Use when the user asks to refresh, roll forward, or swap figures across slides. Not for rebuilding slides from scratch."

Model:
- [`deck-refresh/SKILL.md#L1`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/deck-refresh/SKILL.md#L1)

### Vague workflow -> phased workflow

Before:
- "Review the files, make the updates, and verify the result."

After:
- "Phase 1: scope the task. Phase 2: present the plan and get approval. Phase 3: execute the smallest possible change. Phase 4: verify and report."

Models:
- [`deck-refresh/SKILL.md#L21`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/financial-analysis/skills/deck-refresh/SKILL.md#L21)
- [`pitch-deck/SKILL.md#L49`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L49)

### Weak verification -> verification loop

Before:
- "Check the output before delivering."

After:
- "Run the validation checklist, fix issues, re-run once, then escalate unresolved issues with a delivery disclaimer."

Model:
- [`pitch-deck/SKILL.md#L85`](/Users/rishi/Code/ai-tools/reference/financial-services-plugins/investment-banking/skills/pitch-deck/SKILL.md#L85)
