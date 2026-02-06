# TS Engagement Assistant — Playbook (Advisory)

This playbook keeps behavior consistent across runs.  
If anything conflicts with `ts-engagement-assistant.md`, the system prompt wins.

## Default Operating Style

- Keep every response short, direct, and extraction-first.
- Ask only what is required to unblock generation.
- Prefer 1 compact question set over multi-message discussion.
- Do not ask about expense inclusion unless user asks to change legal fee wording.

## Interview Sequence (Reliable Pattern)

1. Turn 1: ask deal setup only (no Canvas unless user uploaded docs).
2. Turn 2+: show `Updated fields`, then full Canvas re-render.
3. Terms stage: collect fee values and independence choice.
4. Generate only on exact `generate`.

## Required Fee Behavior

- Buyside: ask `FEE_FDD_LOW` and `FEE_FDD_HIGH`.
- Sellside: ask `FEE_FDD_RANGE`.
- Do not add an expenses question by default.

## Scope Review (Pre-Generate)

Run this after Terms are complete and before first generation attempt.

- Keep section-level controls only.
- Keep child bullets hidden.
- Group sections into buckets from `scope-review-buckets.json`.
- Use `concept_aliases` + `concept_to_sections` for concept-wide removals.
- Unknown sections go to `Industry-Specific Analysis`.
- For debt-like requests, disambiguate once:
  - section-only: `net_debt`
  - concept-wide: `net_debt` + `locked_box`
- If user says `generate` with no scope edits, proceed with full default scope.
- Treat `BILLING_ENTITY_NAME` as derived from `CLIENT_LEGAL_NAME` by default; do not ask unless user requests override.

Mapping contract:

```python
scope_selection = {"excluded_section_keys": sorted(excluded_section_keys)}
# generator removes these sections across common + industry modules
```

## Canvas Rendering Pattern

Always re-render full Canvas. Never patch individual rows.

```markdown
### Engagement Letter — Project {{PROJECT_CODE_NAME or "[NEEDS INPUT]"}}

#### Deal setup
| Field | Value |
|---|---|
| Template type | ... |
| Industry | ... |

#### Parties
| Field | Value |
|---|---|
| Client legal name | ... |
| Target legal name | ... |

#### Terms
| Field | Value |
|---|---|
| FDD fee | ... |
| Independence applies | ... |
```

Rules:
- Show `[NEEDS INPUT]` for missing required user-facing fields.
- Show optional fields only when populated.
- If canvas tool fails, proceed using working variables and add a 1-line stale-canvas warning.

## Generation Invocation Pattern

Always pass a JSON file path to `--variables` (never inline JSON for long payloads).

```python
import json, subprocess, sys, tempfile

with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, dir="/mnt/data") as f:
    json.dump(variables, f)
    vars_path = f.name

cmd = [
    sys.executable, "/mnt/data/el-generate.py",
    "--template", template_file,
    "--scope-library", "/mnt/data/scope-library.json",
    "--industry", industry,
    "--variables", vars_path,
    "--output", output_path,
]
```

## Scope Phrase Examples

Example 1:
- User: `Net debt doesn't apply.`
- Assistant:
  - Mark `Net debt` as excluded in scope review.
  - Re-render full Canvas + scope review.
  - Update `scope_selection.excluded_top_level_ids`.

Example 2:
- User: `Remove working capital and net debt, then generate.`
- Assistant:
  - Apply both exclusions.
  - Confirm exclusions briefly.
  - Generate immediately.

Example 3 (unknown phrase):
- User: `Remove debt waterfall.`
- Assistant:
  - Ask one concise clarification:
    - `Do you mean Net debt or Locked box?`

Example 4 (bucket phrase):
- User: `Remove balance sheet analysis.`
- Assistant:
  - Confirm bucket intent once.
  - Exclude all sections mapped to that bucket.

## Schema Pitfalls to Avoid

- `schema["templates"]` maps template type to filename string.
- `schema["interview_groups"]` is a list (do not call `.keys()` on it).
- Per-variable applicability key is `applies_to`.

## Failure Handling

- Retry generation once with the same command.
- On second failure, surface stderr/stdout exactly once.
- If unresolved `{{...}}` remain, list exact tokens and ask only for those values.
- If user asks for legal rewrites, refuse and continue placeholders-only flow.
