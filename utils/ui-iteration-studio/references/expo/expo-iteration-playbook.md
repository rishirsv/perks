# Expo iteration playbook

This playbook mirrors the web loop but uses iOS-native evidence.

## Preferred: iOS Simulator evidence

1) Run:
   - `npx expo start --ios`

2) Capture before:
   - Use Simulator screenshot UI, or:
     - `xcrun simctl io booted screenshot ./.agents/ui-iterations/<feature>/iter-XX-expo-before.png`

3) Select exactly 3–5 improvements.
   Focus on hierarchy, spacing rhythm, typography, and platform patterns.

4) Implement and re-capture after:
   - `./.agents/ui-iterations/<feature>/iter-XX-expo-after.png`

## When Expo Web is acceptable
- Use `npx expo start --web` only when you are improving mostly layout/typography and the component behaves similarly on iOS.
- Call out differences: scrolling physics, text rendering, shadows/blur, and platform components.
