# iOS-native checklist for Expo UIs

Use this as a “native-feel” finishing pass, typically in later iterations.

## Typography
- Prefer iOS-appropriate sizes and weight usage; avoid overly tight line-height.
- Ensure section titles, list labels, and metadata have clear hierarchy.

## Spacing and touch targets
- Comfortable row height; avoid cramped lists.
- Buttons and tappable rows should feel easy to hit without precision.

## Platform controls and patterns
- Prefer native controls when available (Switch, Segmented Control, Date/Time patterns).
- Use iOS-style sheets and modals; avoid “webby” dialogs.

## Feedback
- Clear pressed states on rows and buttons.
- Add subtle haptics when an action benefits from confirmation (keep it intentional).

## Visual effects
- Use blur/material carefully; it should feel like system UI, not a gimmick.
- Keep shadows subtle and consistent.

## Motion
- Subtle, purposeful transitions.
- Avoid bouncy or overly long animations unless the app’s brand calls for it.

## Accessibility
- Verify VoiceOver labels for icon-only buttons.
- Confirm dynamic type does not break layout in critical screens.
- Ensure focus/selection states are visible.
