# UI principles and heuristics

This is a non-designer rubric for turning “feels off” into concrete, fixable changes.

## Hierarchy
- A user should understand the page’s purpose in 2–5 seconds: one primary message and one primary action.
- Primary vs secondary must be obvious via size, weight, placement, and spacing.

Quick checks:
- Is there exactly one “hero” element per screen region?
- Are headings and labels doing distinct jobs (no duplicated emphasis)?
- Are related elements grouped with whitespace and alignment, not borders everywhere?

## Typography
- Use a small, repeatable type scale (3–5 sizes) rather than one-offs.
- Keep line length comfortable (especially for body text), and use consistent line-height.

Quick checks:
- Does the type scale encode structure (H1/H2/body/meta) cleanly?
- Is emphasis disciplined (bold/ALL CAPS/colored text only when it signals meaning)?

## Spacing and layout rhythm
- Consistency beats novelty: use a small set of spacing steps.
- Align edges and baselines; avoid “almost aligned.”

Quick checks:
- Are gutters consistent across sections/components?
- Are cards/rows the same internal padding unless there’s a reason?

## Color and contrast
- Use color to signal meaning (action, status), not decoration.
- Ensure contrast is sufficient for text and focus rings.

Quick checks:
- Is accent color reserved for actionable items and key emphasis?
- Do disabled and secondary states read clearly but not disappear?

## Accessibility that users feel
- Focus should be visible, consistent, and not clipped.
- Hit targets should feel comfortable (especially on mobile).
- Error states should be specific and helpful.

Quick checks:
- Can you tab through and always see where you are?
- Are buttons and list rows comfortably tappable?
