---
name: fdd-report-writer
description: Draft, rewrite, and polish client-ready financial due diligence report sections and exhibit-sized narratives in Markdown. Use when the user asks for FDD or diligence writing such as an executive summary, business overview, historical financial performance, QoE/QofE section, earnings adjustment wording, NWC or working capital section, bridge note, net debt section, debt-like items commentary, balance sheet section, reporting environment section, or other client-ready diligence wording. Do not use for PowerPoint decks, report-checker automation, or reference-maintenance tasks.
---

# FDD Report Writer

Draft client-ready FDD sections, adjustment writeups, and exhibit-sized diligence narratives in Markdown, defaulting to the narrowest requested artifact.

## Overview

- Default to section-by-section drafting.
- Default to the narrowest requested artifact and draft only that artifact.
- Treat full report sections, exhibit-sized writeups, and narrow adjustment wording as different output shapes.
- Use the live section contracts in `references/` as the drafting system.
- Use [references/global-writing-conventions.md](references/global-writing-conventions.md) in every drafting path.
- Load only the relevant section contract from `references/` for the requested artifact.

## Core Instructions

### Governing rules

- Write only the requested artifact.
- Default to the narrowest reasonable artifact.
- Do not widen a narrow request into a full section.
- Do not widen a section request into a full report.
- Follow explicit user instructions on scope, format, and requested output shape over the skill's default presentation rules.
- Use the main skill file to determine routing and output shape, then use the relevant references to determine section-specific structure and content.
- If the user asks for an actual PowerPoint slide or `.pptx`, use `kpmg-slides` instead.

### Match the requested output shape

Use the output shape that best matches the request:

- `section`: One or more full report sections.
- `exhibit`: A narrower analytical block such as adjustments, a bridge note, a schedule narrative, table commentary, or another exhibit-sized writeup.
- `full_report`: A full report outline or a coordinated multi-section build only when the user explicitly asks for it.

Apply these shape rules:

- If the user asks for a full section, draft the full section rather than collapsing it into bridge commentary, adjustment-only wording, or a brief memo block.
- If the user asks for one or more adjustments, a bridge note, a schedule note, debt-like items commentary, or other narrow analytical text, keep the output narrow rather than forcing the full section shape.
- If the user asks for multiple sections, draft only those sections.

Use these practical distinctions:

- `section`: Use when the user asks for a named report section such as `Quality of earnings`, `Net working capital`, `Business overview`, or `Reporting environment`. The output should read like the requested report section, even if it includes a bridge, bullets, or grouped commentary inside the section.
- `exhibit`: Use when the user asks for a narrower block such as adjustment wording, an earnings bridge note, a net debt schedule narrative, a working capital bridge note, a table commentary, or another schedule-led writeup. The output should stay tied to that analytical block rather than expanding into the broader report section.
- `full_report`: Use only when the user explicitly asks for a full report outline or coordinated multi-section build.

Do not rely on section names alone. If the user asks for a narrow component inside a section, write that component rather than the full section.

### Select the writing operation

Choose one operation for the requested artifact:

- `draft`: Write fresh content from notes, source materials, schedules, or rough instructions.
- `rewrite`: Improve wording and structure when the existing text is weak, incomplete, or not yet client-ready.
- `polish`: Preserve the existing structure and treatment; tighten clarity, precision, rhythm, and tone.

Use these defaults:

- If the user provides rough notes, mixed materials, or asks to write from scratch, use `draft`.
- If the existing text is structurally weak or not yet client-ready, use `rewrite`.
- If the existing text is already substantially correct and mainly needs language tightening, use `polish`.

### Normalize section scope

Map informal section names to the canonical section contracts and proceed without asking the user to confirm terminology.

Canonical sections:

- Executive summary
- Business overview
- Historical financial performance
- Quality of earnings
- Net working capital
- Net debt
- Balance sheet
- Reporting environment

Map common aliases internally, such as `QoE` or `QofE` to Quality of earnings, `NWC` or working capital to Net working capital, and debt-like items or net indebtedness commentary to Net debt.

If the request is narrower than the canonical section, keep the output narrow rather than forcing the full section shape.

### Load only the references you need

Always read:

- [references/global-writing-conventions.md](references/global-writing-conventions.md)

Then read only the relevant section contract from `references/`:

- [references/executive-summary.md](references/executive-summary.md)
- [references/business-overview.md](references/business-overview.md)
- [references/historical-financial-performance.md](references/historical-financial-performance.md)
- [references/quality-of-earnings.md](references/quality-of-earnings.md)
- [references/net-working-capital.md](references/net-working-capital.md)
- [references/net-debt.md](references/net-debt.md)
- [references/balance-sheet.md](references/balance-sheet.md)
- [references/reporting-environment.md](references/reporting-environment.md)

For exhibit requests, use the closest section contract as the governing reference.

### Handle missing information

Proceed with placeholders unless the missing information changes the section logic.

Ask a brief clarifying question only when the missing detail changes:

- which section or artifact should be written
- the analytical basis of the section
- the treatment of a material adjustment or conclusion

When proceeding with incomplete inputs:

- Use placeholders such as `$[x]`, `[Date]`, `[Customer A]`, or `[basis not provided]`.
- Keep the prose client-ready.
- Keep unsupported or subjective items outside the main bridge or conclusion when support is incomplete.
- Do not invent numbers, support, or management positions.

### Draft in the correct shape

1. Identify the artifact and operation.
2. Normalize the request to the canonical section or exhibit type.
3. Extract the key evidence, periods, and numerical anchors from the provided materials.
4. Draft in the output shape the user asked for.
5. Stop when the requested artifact is complete.

Apply the shape as follows:

- `section`: Draft the full section using the relevant section contract as the backbone. Use a bridge, schedule, table, bullets, or grouped commentary only when the section logic or the user's request calls for them.
- `exhibit`: Draft commentary aligned to the schedule, bridge, or analytical block in the same order the reader sees it. Keep the output compact and exhibit-sized.
- `full_report`: Start with a concise outline using canonical section names. Continue into drafted sections only if the user explicitly asks to continue.

Apply the operation as follows:

- `draft`: Build from the available materials and follow the relevant section contract as the default structure.
- `rewrite`: Improve weak structure when it blocks clarity, but preserve the existing structure when it is already workable.
- `polish`: Keep the existing structure and meaning; focus on language, rhythm, precision, and defensibility.

### Apply universal writing constraints

- Anchor every material quantitative claim to a clear basis or source.
- Use the relevant section contract as the default structure, but adapt it to the user’s request and the available evidence.
- Prefer evidence first, then implication.
- Use balanced diligence language and label uncertainty when support is incomplete.
- Keep Markdown output easy to review and iterate.
- Return only the requested artifact.

### Guardrails

- Do not collapse a full section request into brief bridge commentary, adjustment-only wording, or a short memo block.
- Do not expand a narrow bridge note, schedule note, or adjustment-writing request into a full report section.
- Do not widen a section request into a full report unless the user explicitly asks for that.
- Do not default to fragmented bullets when grouped prose or denser commentary would better match the requested artifact.
- Do not let generic formatting habits override the requested output shape.

## Output Contract

For `section` and `exhibit` requests, return:

1. The requested prose
2. A short `What changed / assumptions` note

For `full_report` requests, return:

1. The outline only, unless the user explicitly asks to continue
2. If drafting continues, return only the requested drafted sections plus a short `What changed / assumptions` note
