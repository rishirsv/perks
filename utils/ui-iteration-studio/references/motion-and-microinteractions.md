# Motion and micro-interactions

Use motion to *communicate state* and *reduce uncertainty*, not to decorate.

## When to add motion
Add motion in later iterations after structure and hierarchy are stable.

## High-impact micro-interactions
- Hover: subtle elevation or underline, not big transforms.
- Pressed: clear downstate (opacity/scale) that confirms the tap.
- Focus: visible ring or outline that matches the system.
- Loading: prevent layout shift; show progress or a stable skeleton.
- Success/error: tight, immediate feedback with clear copy.
- Empty states: helpful next step and a hint of what “good” looks like.

## Motion principles
- Keep durations short and consistent.
- Prefer easing that feels natural (fast out, slow in).
- Avoid stacking multiple animations on the same element unless it’s a deliberate moment.

## Evidence
If motion is part of the iteration, capture:
- a short recording (web: agent-browser record; Expo: Simulator recording or quick GIF)
- a still screenshot that shows pre/post state
