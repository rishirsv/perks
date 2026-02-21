# Content Pack

## Role

Convert source materials into a reusable block catalog for downstream planning and deck assembly.

## Contract

Return JSON only and validate against `schemas/contentPack.schema.json`.

The content pack is a block catalog:

- `version` is required and must be semantic-like (for example `"1.0"` or `"v1.0"`).
- `slides[]` is required and stores reusable content blocks.
- Each block must include:
  - `type`: non-empty string block label (for example `bullets`, `table`, `chart`, `kpis`, `contentsSections`, `narrative`).
  - `slots`: object with slot payloads needed later by deck planning/spec.
- Optional fields: `metadata`, `globals`, `evidence`.

## Rules

- Do not invent numbers, facts, or citations.
- Keep each block focused on one analytic claim or narrative purpose.
- Include evidence IDs in block slots when applicable.
- Prefer many small composable blocks over one large mixed block.

## Minimal example

```json
{
  "version": "1.0",
  "slides": [
    {
      "id": "B1",
      "type": "bullets",
      "slots": {
        "section": "Executive summary",
        "title": "Investment highlights",
        "items": [
          "Revenue growth remains resilient in enterprise segment.",
          "Retention strength supports forward visibility."
        ],
        "evidenceIds": ["E1"]
      }
    }
  ]
}
```
