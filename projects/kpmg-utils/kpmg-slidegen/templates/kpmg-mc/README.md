## KPMG MC Template Workspace

This folder is the repo-local home for the MC PowerPoint source template and the
future extracted layout package.

Current intent:

- Keep the source PPTX with the template family it belongs to.
- Stage extracted assets and package files here as layouts are onboarded.
- Avoid wiring this template into runtime generation until the MC layout
  contracts are intentionally added.

Planned structure:

- `source/`: source PPTX files and other repo-only reference inputs.
- `assets/`: extracted image assets for the MC template family.
- `package/`: canonical tokens, layout contracts, and asset manifest once ready.
