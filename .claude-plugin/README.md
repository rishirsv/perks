# Claude Compatibility

This folder exists for Claude-style plugin metadata.

Codex uses `.agents/plugins/marketplace.json` as the source of truth. Keep this file in sync only when the plugin needs to remain consumable by Claude-compatible tooling.

The root marketplace file is not symlinked because the Codex marketplace schema and Claude-style marketplace schema are different. Inside the plugin package, `.claude-plugin/plugin.json` can be a symlink to `.codex-plugin/plugin.json` because the shared package metadata should not drift.
