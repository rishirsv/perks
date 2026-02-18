---
name: product-spec
description: Comprehensive and concise feature spec template for docs/product-specs/<feature-slug>-spec.md.
---

# Feature: <feature-name>

## TL;DR
- **Problem:** <one sentence>
- **Outcome:** <2-3 bullets describing user-visible change>
- **Success signal:** <how we will know this worked>

## Scope
- **In:**
  - <included behavior>
  - <included behavior>
- **Out:**
  - <explicit non-goal>
  - <explicit non-goal>

## What We're Building
<2-4 concise paragraphs or bullets describing the experience and behavior contracts.>

## User Stories (Optional)
### User Story 1: <title>
- As a <user>, I want <capability> so that <value>.

## Requirements
- [ ] <requirement>
- [ ] <requirement>
- [ ] <requirement>

## UX / Interaction Notes (Optional)
- Entry points/routes:
  - `<route-or-path>`
- Primary flow:
  1. <step>
  2. <step>
- Key states:
  - Loading:
  - Empty:
  - Error:
- Accessibility notes:
  - <keyboard/screen-reader/dynamic-type/contrast note>

## Implementation Notes (Optional)
- Owner files/modules:
  - `path/to/file`
  - `path/to/file`
- Data/contracts:
  - <data model, API, or query rule>
- Dependencies and constraints:
  - <constraint>
- Rollout/migration notes:
  - <rollout rule>

## Acceptance Criteria
- Given <state>, when <action>, then <outcome>.
- Given <state>, when <action>, then <outcome>.
- Given <state>, when <action>, then <outcome>.

## Success Metrics (Optional)
- <product or behavior metric>
- <quality metric>

## Resolved Decisions (Optional)
- <locked decision>
- <locked decision>

## Validation (Optional)
- Manual checks:
  - <check + expected result>
- Automated checks:
  - `<command/test suite>`

## Context (Optional)
- Related docs:
  - `docs/path.md`
- Related code:
  - `path/to/file`
- References:
  - <issue/link>

## Open Questions (Optional)
- <question and why it matters>

## Post-Implementation Update Notes (Optional)
- Shipped behavior summary:
  - <what is now live>
- Differences from prior spec:
  - <changed/descoped behavior>
- Follow-ups:
  - `docs/exec-plans/active/<feature-slug>-plan.md`
  - `docs/exec-plans/tech-debt-tracker.md`
