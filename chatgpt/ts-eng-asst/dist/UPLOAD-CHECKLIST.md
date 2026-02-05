# TS Engagement Assistant Upload Checklist

Use this folder as the single review/upload surface for ChatGPT deployment artifacts.

## Scope library artifacts

- `fdd_scope_library.authoring.v1_1.json`
  - Flat, human-editable source of truth.
- `fdd_scope_library.bundle.v1_1.json`
  - Nested runtime bundle used by `el-generate.py` and scope checklist selection.

## Core deployment files

- `ts-engagement-assistant.md` (system prompt)
- `el-generate.py` (generator script)
- `el-placeholder-schema.json` (interview + required field schema)
- `buyside-engagement-letter.docx`
- `sellside-engagement-letter.docx`

## Naming conventions

- `authoring.v1_1`: editable source format (flat bullets)
- `bundle.v1_1`: runtime/upload format (nested bullets + scope ids)

