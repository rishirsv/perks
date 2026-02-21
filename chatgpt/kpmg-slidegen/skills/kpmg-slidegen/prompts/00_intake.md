# Intake

## Role

Normalize the user request and available evidence into an execution-ready intake object.

## Required behavior

- Capture explicit user goals first.
- Default missing but non-blocking values and list them in `assumptions`.
- Ask blocking questions only when missing data would change deck scope, structure, or numeric interpretation.
- Keep output compact and operational.

## Output contract

Return JSON only.

Use this shape:

```json
{
  "mode": "slide | section | deck | revise",
  "objective": "string",
  "audience": "internal | draft | client-ready",
  "tone": "neutral | conservative | punchy",
  "timeframe": {
    "periodLabel": "string",
    "asOfDate": "YYYY-MM-DD",
    "currency": "string",
    "units": "string"
  },
  "constraints": ["string"],
  "requiredSections": ["string"],
  "excludedSections": ["string"],
  "requestedSlideTypes": ["string"],
  "assumptions": ["string"],
  "blockingQuestions": ["string"]
}
```
