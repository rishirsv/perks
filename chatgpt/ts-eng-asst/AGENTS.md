# TS SoW — Agent Instructions

## Purpose

This project contains artifacts intended to be uploaded into a ChatGPT GPT / project workspace (system prompt + supporting files).

## Decision principles

- Prefer **defaults + derivations** over asking/gating users (smooth UX, fewer loops).
- Only keep schema fields that are **meaningfully user-provided**; if a value is a reasonable default, bake it into the template (or derive it) and **remove the schema + intake questions**.
- Never rewrite legal language; only change templates to (a) set defaults, (b) add deterministic markers, or (c) remove/replace placeholders.
- Keep the system prompt under `8000` characters.

## `dist/` (final uploads only)

The `chatgpt/ts-sow/dist/` directory is **only** for the exact files a user should upload into ChatGPT.

Keep `dist/` limited to:

- System prompt markdown(s)
- Generator scripts needed by the prompt
- Template `.docx` files
- The current schema(s) / library files referenced by the prompt (e.g. `fdd_scope_library.v2.json`)
- Any icon assets explicitly used for the GPT configuration

Do **not** add to `dist/`:

- Demo artifacts (example outputs, example variable dumps)
- Test outputs or golden files
- Local caches (`__pycache__/`, `*.pyc`)
- OS/editor metadata (`.DS_Store`, etc.)

If you need demo or test materials, put them under `chatgpt/ts-sow/reference/` (or another non-`dist/` folder) instead.

## Hygiene

- Prefer writing generated outputs to a temporary or dedicated non-`dist/` location.
- Before finishing a change, verify `dist/` contains only final-upload artifacts.
- Validate outputs are “clean”: no remaining `{{...}}` tokens in generated `.docx`.
- For scope text changes, keep all copies in sync:
  - `dist/fdd_scope_library.v2.json`
  - `reference/fdd_scope_library.v2.json`
  - `docs/scope-library/industries/*` (re-export with `python3 scripts/export-scope-library.py`)
- For scope text QA, run:
  - `python3 scripts/check-scope-spelling.py`
  - `python3 scripts/validate-scope-exports.py`

## Constraint

- System prompt is limited to 8000 characters

## Template/generator conventions

- **Guidance text:** bracketed guidance like `[GUIDANCE: ...]` is intended to **remain in the output** for humans to edit; only curly-brace guidance placeholders (e.g. `{{GUIDANCE_01}}`, `{{GUIDANCE: ...}}`) are internal and should be removed during generation.
- **Section removal:** prefer explicit marker paragraphs (e.g. `{{BLOCK_*_START}}` / `{{BLOCK_*_END}}`) so the generator can delete entire sections deterministically.
- **Independence behavior (intended):**
  - If `CHOICE_INDEPENDENCE_APPLIES=no`, remove the full Independence Considerations block.
  - `CHOICE_SEC_STATUS` is conditionally required only when `CHOICE_INDEPENDENCE_APPLIES=yes` and the section remains in-template.
- When updating templates, apply changes consistently to **both** buyside and sellside unless explicitly scoped to one.

## Repo note

- `chatgpt/ts-sow` and `chatgpt/TS-SoW` may refer to the same files; use the git-tracked paths when staging/committing.
