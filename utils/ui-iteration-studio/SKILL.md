---
name: ui-iteration-studio
description: Iteratively improve web and Expo UIs with screenshot-driven 3–5-change cycles using agent-browser and iOS Simulator evidence. Includes optional competitor research mode when explicitly requested.
---

# UI Iteration Studio

This skill improves UI quality **iteratively** without breaking functionality.
It produces small, high-impact upgrades per cycle with clear evidence (screenshots) and verification.

## Non-negotiable rules

1) **Exactly 3–5 improvements per iteration.**
If you find 12 issues, pick the best 3–5 and defer the rest to later cycles.

2) **Keep scope tight.**
Allowed improvement types: layout, hierarchy, typography, spacing, color, motion/micro-interactions, accessibility, visual polish.

3) **Never undo good changes.**
Early iterations focus on structure and hierarchy; later iterations focus on polish, micro-interactions, and finishing details.

4) **Preserve functionality.**
No feature work, no refactors “because it’s nicer,” no new design system unless absolutely necessary.

5) **Respect design truth.**
If the repo has brand tokens, style guides, or design docs, follow them. If not, define a simple aesthetic direction and stick to it.

## Choose a mode

Use this decision logic:

- **Web mode** if the UI is a website or web app you can load in a browser.
- **Expo mode** if the UI is React Native + Expo and you can capture iOS Simulator screenshots.
- **Competitor mode** only if explicitly requested.

## Quick start

Do one iteration end-to-end:

1) Capture **before** screenshots with deliberate viewport sizing.
2) Write a short diagnosis, then select **exactly 3–5 changes**.
3) Implement those changes only.
4) Capture **after** screenshots using the same viewport and element framing.
5) Produce an iteration report (see `references/templates/iteration-report-template.md`).

---

# Web mode

## Screenshot discipline with agent-browser

Always do this before taking evidence:

- Desktop baseline: `agent-browser set viewport 1440 900`
- Mobile baseline (when needed): `agent-browser set device "iPhone 14"`

Prefer element-focused evidence:

- Set viewport to fit the component/section being improved.
- Scroll the target element into view.
- Take a standard screenshot of the viewport.

Use full-page screenshots sparingly (`--full`) only when diagnosing page-level rhythm, section transitions, or navigation/system issues.

If improvements depend on hover/focus/active states, capture evidence by triggering state (hover/focus) and re-screenshot.

## Web iteration loop

**Create a feature evidence folder** under the relevant project root (example):
`.agents/ui-iterations/<feature>/`
Create it if it doesn’t exist.

Keep it flat (no `iter-XX/`, no `/web`, no `/expo`). Encode iteration + mode in filenames:
- `iter-01-web-before.png`, `iter-01-web-after.png`
- `iter-01-expo-before.png`, `iter-01-expo-after.png`
- `iter-01-web-report.md`, `iter-01-expo-report.md`

### Step 1: Capture before evidence

1. `agent-browser open <url>`
2. Set viewport (desktop or mobile).
3. `agent-browser snapshot -i` to get interactive element refs.
4. `agent-browser scrollintoview @eX` for the target section/component.
5. `agent-browser screenshot ./.agents/ui-iterations/<feature>/iter-01-web-before.png`

If you need hover/focus evidence:
- `agent-browser hover @eX` then screenshot.
- `agent-browser focus @eX` then screenshot.

### Step 2: Diagnose and select exactly 3–5 changes

Write a short diagnosis grounded in the screenshots.
Then choose 3–5 improvements that are scoped and high leverage:
- clearer hierarchy and grouping
- better typography scale and emphasis
- spacing rhythm and alignment cleanup
- contrast/focus/tap-target accessibility
- remove visual noise and inconsistency

### Step 3: Implement the changes

Implement only the chosen 3–5 items.
Avoid introducing new components or abstractions unless you are repeating the same fix multiple times.

### Step 4: Verify and capture after evidence

Re-run the same capture steps:
- same viewport
- same element framing
- same state capture (hover/focus) if relevant

Save:
- `iter-01-web-after.png` (and optional state variants like `iter-01-web-after-hover.png`)
- optional: a short recording if motion is part of the iteration (example: `iter-01-web-after.mov`)

### Step 5: Produce the iteration report

Use `references/templates/iteration-report-template.md`.
Save it next to the evidence (example: `./.agents/ui-iterations/<feature>/iter-01-web-report.md`).
End with a short “next iteration candidates” list, but do not implement them yet.

---

# Expo mode

Expo mode optimizes for “native-feeling” iOS UX: typography, spacing, platform controls, navigation, sheets/modals, and subtle motion.

## How to see it and capture evidence

Preferred:
- Run iOS: `npx expo start --ios`
- Capture screenshots from the iOS Simulator UI, or use:
  - `xcrun simctl io booted screenshot ./.agents/ui-iterations/<feature>/iter-01-expo-before.png`
- Re-capture after (same framing):
  - `xcrun simctl io booted screenshot ./.agents/ui-iterations/<feature>/iter-01-expo-after.png`

Acceptable proxy:
- Run web: `npx expo start --web`
Use this only when layout and interaction are close enough to iOS for the specific UI you’re improving.

## Expo iteration loop

Use the same 3–5 change loop as Web mode, but:
- capture evidence on iOS Simulator first
- prefer native controls and platform conventions
- keep motion subtle and purposeful

When choosing improvements, bias toward:
- spacing rhythm and density
- typography hierarchy
- native component choice (Switch, SegmentedControl, etc.)
- correct sheet/modal patterns
- better feedback for taps and state changes (including haptics when relevant)

For the repo’s Expo-native guidance and references, see:
- `references/expo/source/skills/building-native-ui/SKILL.md`
- `references/expo/ios-native-checklist.md`
- `references/expo/expo-iteration-playbook.md`

---

# Competitor mode

Only run this mode if explicitly requested.

Deliverables:
1) A set of screenshots (key pages/flows + key components)
2) A pattern analysis (layout system, typography scale, color/tokens, motion, content strategy)
3) A recommended “template/system” to adapt (extract principles, do not copy)
4) A short implementation plan that fits the current codebase and goals

Use:
- `references/competitor-teardown-template.md`
- `references/templates/competitor-research-report-template.md`

---

# References

Use these as needed:
- `references/screenshot-playbook-agent-browser.md`
- `references/ui-principles-and-heuristics.md`
- `references/motion-and-microinteractions.md`
- `references/rhythm-and-visual-storytelling.md`
- `references/competitor-teardown-template.md`
- `references/expo/expo-iteration-playbook.md`
- `references/expo/ios-native-checklist.md`
- `references/templates/iteration-report-template.md`
- `references/templates/competitor-research-report-template.md`

Vendor starting points:
- `references/vendor/anthropic-frontend-design.SKILL.md`
- `references/vendor/agent-browser.SKILL.md`
- `references/vendor/skill-creator.SKILL.md`
- `references/vendor/openai_yaml.md`
