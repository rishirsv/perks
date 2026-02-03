---
name: design
description: Design system and UI guidelines for docs/DESIGN.md.
---

# Design: [Project Name]

Last updated: YYYY-MM-DD

## Description

<A short paragraph describing the intended look/feel and what “good” looks like in this product.>

## Design style

- Direction: <e.g., Minimal, Neo-brutal, Modern, …>
- Keywords: <3–6 adjectives that should be true of the UI>

## Design principles

- <Principle 1: what to do, in one sentence>
- <Principle 2>
- <Principle 3>

## Tokens

### Color tokens

| Token | Value | Usage | Notes |
|---|---|---|---|
| `--color-bg` | `#...` | App background | <…> |
| `--color-surface` | `#...` | Cards, panels | <…> |
| `--color-text` | `#...` | Primary text | <…> |
| `--color-primary` | `#...` | Primary actions | <…> |
| `--color-danger` | `#...` | Destructive actions | <…> |

### Typography tokens

| Role | Font | Size/weight | Usage |
|---|---|---|---|
| H1 | <…> | <…> | Page titles |
| H2 | <…> | <…> | Section titles |
| Body | <…> | <…> | Main content |
| Mono | <…> | <…> | Code, IDs |

### Spacing scale

| Token | Value | Usage |
|---|---:|---|
| `--space-1` | <px> | Tight spacing |
| `--space-2` | <px> | Default spacing |
| `--space-3` | <px> | Comfortable spacing |

### Breakpoints

| Name | Min width | Notes |
|---|---:|---|
| Mobile | <px> | <…> |
| Tablet | <px> | <…> |
| Desktop | <px> | <…> |

## Layout

- Grid: <columns/gutters/max-width>
- Content rhythm: <how sections should be spaced>

## Components

### Buttons

| Do | Don’t |
|---|---|
| <Describe correct primary button usage> | <Anti-pattern> |
| <Describe disabled/loading behavior> | <Anti-pattern> |

States:
- Default / Hover / Active / Disabled / Loading: <notes>

### Forms

| Do | Don’t |
|---|---|
| <Clear labels and helpful errors> | <Errors only on submit with no guidance> |
| <Visible focus states> | <Removing focus outlines without replacement> |

### Cards / surfaces

| Do | Don’t |
|---|---|
| <Use surface + border to separate content> | <Overuse heavy shadows everywhere> |

### Navigation

- Pattern: <tabs / sidebar / top-nav>
- Active state: <what it looks like>

## Motion

| Use case | Duration | Easing | Notes |
|---|---:|---|---|
| Small UI feedback | 150ms | ease-out | <…> |
| Page transitions | 250ms | ease-out | <…> |

## Accessibility

- Contrast: meet WCAG AA for text and controls.
- Keyboard: focus is visible and logical.
- Touch targets: minimum 44×44px.
- Forms: labels and errors are clear.

## Implementation notes (optional)

- Technologies: <UI library / design tokens / CSS approach>
- Performance: <rules of thumb>

## Resources

- Figma: <link>
- Assets: <link>
- Related docs: <links>
