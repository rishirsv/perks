# Screenshot playbook with agent-browser

The goal is comparable evidence: the same component framed the same way before/after.

## Default viewports

- Desktop baseline: `agent-browser set viewport 1440 900`
- Mobile baseline: `agent-browser set device "iPhone 14"`

## Element-focused capture loop

1) Open and set viewport:
   - `agent-browser open <url>`
   - `agent-browser set viewport 1440 900` (or iPhone device)

2) Identify interactive elements:
   - `agent-browser snapshot -i`

3) Frame the target:
   - `agent-browser scrollintoview @eX`

4) Screenshot:
   - `agent-browser screenshot ./.agents/ui-iterations/<feature>/iter-XX-web-before.png`

## Capturing interaction states

Use when the improvement depends on state:

- Hover: `agent-browser hover @eX` then screenshot.
- Focus: `agent-browser focus @eX` then screenshot.

Keep state screenshots next to the base screenshot:
- `iter-XX-web-before.png`, `iter-XX-web-before-hover.png`, `iter-XX-web-before-focus.png`

## When to use full-page

Use `agent-browser screenshot --full` only when you are diagnosing:
- page-level rhythm and section transitions
- nav/system consistency across multiple sections
- sticky headers/footers or scroll-linked issues

Default to viewport screenshots for iteration work.
