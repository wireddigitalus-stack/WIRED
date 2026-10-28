# AI Agent Instructions for Wired Digital (`WDC`)

1. **Always read [`BRAIN.md`](./BRAIN.md) first** before searching the codebase. It contains the complete Site Knowledge Tree, file map, sync rules, and non-negotiable guardrails.
2. For machine-readable route, component, asset, and guardrail status, read [`public/site-brain.json`](./public/site-brain.json) or run `npm run brain`.
3. Before making multi-file content/data edits, run `npm run snapshot` so a 1-click rollback point exists (`npm run rollback`).
4. Always run `npm run build` after changes so `scripts/build-brain.mjs`, `vite build`, and `scripts/prerender.mjs` stay in sync.
