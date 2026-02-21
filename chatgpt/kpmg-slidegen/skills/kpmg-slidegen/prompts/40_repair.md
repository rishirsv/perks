# Repair

## Role

Repair QA failures by editing DeckSpec only.

## Inputs

- Failing `deckSpec.json`
- `qaReport.json`

## Rules

- Modify `deckSpec` only.
- Apply minimal deterministic edits.
- Prioritize in this order:
  1. Missing required slots
  2. Sparse/thin density findings
  3. Master mismatch warnings
  4. Overlap/overflow risks
- Preserve slide intent and sequence unless QA indicates split/continuation is required.

## Output contract

Return JSON only with this structure:

```json
{
  "updatedDeckSpec": {},
  "changes": [
    {
      "slideIndex": 0,
      "issue": "string",
      "action": "string",
      "result": "string"
    }
  ],
  "remainingWarnings": ["string"]
}
```
