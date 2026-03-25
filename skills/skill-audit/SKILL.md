---
name: skill-audit
description: >
  Audit an agent skill for release readiness, instruction quality, scope, and
  resource design. Use when the user asks to audit, review, critique, or
  pressure-test a skill directory or `SKILL.md`, or asks whether a skill is
  ready to ship. Not for general code review, evaluator review, or prompt-only
  critique.
---

# Skill Audit

Audit a skill with evidence-first rigor. Default stance: fail unclear instructions, vague triggering, weak verification, and bloated structure until the skill earns a pass.

## Reference Files

Read these before scoring:

| File | When to use |
|---|---|
| [references/rubric.md](references/rubric.md) | Always. This is the authoritative scoring criteria for D1-D9. |
| [references/report-template.md](references/report-template.md) | When assembling `AUDIT.md`. Follow its structure exactly. |
| [references/exemplar-patterns.md](references/exemplar-patterns.md) | When calibrating close calls, writing before/after fixes, or checking what strong skills look like in practice. |

## Input

Accept a path to the skill directory. If the user gives a file path, audit `SKILL.md` only unless they ask for the full directory.

Default scope: full skill-directory audit.

Supported scopes:
- `full-skill` - `SKILL.md` plus bundled files
- `skill-md-only` - body/frontmatter review only
- `release-readiness` - same audit, but prioritize blocking issues and ship/no-ship guidance

If scope is not stated, use `full-skill`.

## Workflow

### Phase 1 - Scope and inventory

1. Confirm the skill path and scope.
2. Read `SKILL.md` in full.
3. Inventory all files and subdirectories.
4. Record:
   - `SKILL.md` body line count excluding frontmatter, code blocks, and blank lines
   - frontmatter fields present
   - file counts in `scripts/`, `references/`, and `assets/`
   - files outside those directories besides `SKILL.md`
   - whether hooks or other platform-specific fields are configured
   - whether string substitutions are used

### Phase 2 - Load scoring context

1. Read [references/rubric.md](references/rubric.md).
2. Read [references/exemplar-patterns.md](references/exemplar-patterns.md) before scoring any dimension that depends on judgment:
   - trigger quality
   - workflow shape
   - defaults and escalation
   - anti-pattern handling
   - verification depth
   - output contract quality

### Phase 3 - Run the dimension reviews

Review these dimensions:
- D1 - Frontmatter and Triggering
- D2 - Content Quality
- D3 - Structure and Context Efficiency
- D4 - Scope and Category Fit
- D5 - Resource Design
- D6 - Degrees of Freedom
- D7 - Gotchas and Anti-Patterns
- D8 - Usability and Completeness
- D9 - Platform Feature Usage

If parallel sub-agents are available, split the dimensions across them. If not, audit sequentially. Parallel review is preferred, not required.

Every dimension review must return this format:

```markdown
## [Dimension Name]

**Verdict: PASS | MARGINAL | FAIL | AUTO-PASS | N/A**

### Issues Found
- [CRITICAL] Issue description
  Evidence: "quoted text" (line X)
- [MAJOR] Issue description
  Evidence: "quoted text" (line X)
- [MINOR] Issue description
  Evidence: "quoted text" (line X)

### Suggested Fixes
1. Fix with before -> after example
2. Fix with before -> after example

### Metrics
[Dimension-specific measurements]
```

Rules:
- Quote specific evidence for every finding.
- Use file paths and line numbers for bundled resources.
- If a criterion does not apply, mark it `N/A` and say why.
- If all criteria in D9 are not applicable, use `AUTO-PASS`.
- Do not duplicate the same issue across dimensions unless the dimensions genuinely differ.
- If a skill fails structurally but contains a strong local pattern, record the failure and still cite the local pattern in `Suggested Fixes`.

### Phase 4 - Synthesize and score

Use [references/report-template.md](references/report-template.md) to assemble the report.

Verdict rules:
- Dimension `PASS`: no critical or major issues
- Dimension `MARGINAL`: at least one major issue, no critical issues
- Dimension `FAIL`: any critical issue
- Overall `PASS`: all dimensions `PASS` or `AUTO-PASS`
- Overall `MARGINAL`: no `FAIL`, at least one `MARGINAL`
- Overall `FAIL`: any dimension `FAIL`

### Phase 5 - Validate before writing

Before writing `AUDIT.md`, verify:
- every finding has evidence with file and line attribution
- every dimension has a verdict or `N/A`
- severity counts match the detailed findings
- summary counts match the scorecard
- the issues diagram contains only real findings
- the fix plan groups related work instead of repeating the same rewrite three times
- the output path is correct

### Phase 6 - Write the report

Write the completed audit to `{skill_directory}/AUDIT.md`, overwriting any prior file.

## What Good Looks Like

Use [references/exemplar-patterns.md](references/exemplar-patterns.md) as positive calibration. Reward these patterns when they are done well:
- trigger-first descriptions with clear exclusions
- short workflows with explicit phases or gates
- defaults first, branching only when needed
- output contracts that define what "done" looks like
- anti-patterns that include a recognition test and corrective action
- verification loops with retry limits, escalation points, and delivery caveats
- lean `SKILL.md` bodies that push detail into references with clear read guidance

## Anti-Patterns

- Auditing against personal taste instead of the rubric
- Calling a skill "good overall" without line-level evidence
- Treating all platform-specific fields as mandatory when the target platform is unclear
- Penalizing a skill for using references when the references are discoverable and well-routed
- Missing explicit defaults, thresholds, or escalation gates
- Rewarding a gotchas section that only says "be careful"
- Praising harsh tone over operational usefulness
- Repeating the same fix in three different dimensions
