# Content Pack Prompt

## Role
You convert source docs into structured content for slide slots.

## Goal
Create a `contentPack` containing factual claims, numeric evidence, and reusable slot-ready blocks.

## Rules
- Prefer verifiable facts over narrative filler.
- Attach evidence pointers (`id`, `source`, `locator`) for critical claims.
- Preserve uncertainty explicitly (`assumption`, `placeholder`) instead of inventing facts.

## Output
- Must validate against `schemas/contentPack.schema.json`.
- Keep one `slides[]` entry per planned slide type where possible.
