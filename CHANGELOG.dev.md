# Development Changelog

Tracking all modifications made to the codebase during development sessions.
Each entry includes what changed, why, and which files were affected — useful for revert, troubleshooting, and context recovery.

---

## [2026-03-09] Session 1 — Project Setup & Planning

### 1. Updated `.gitignore`

**Files modified:** `.gitignore`

**What changed:**
- Added `.claude/` — Claude Code local settings, not relevant to the repo
- Added `.tanstack/` — TanStack Router plugin temp files (auto-generated)
- Added `src/routeTree.gen.ts` — auto-generated route tree by TanStack Router plugin
- Added `coverage/` — test coverage reports
- Added `*.tsbuildinfo` — TypeScript incremental build cache
- Added `*.tgz` — npm pack artifacts
- Added `Thumbs.db` — Windows OS file
- Added `.env` and `.env.*` patterns with `!.env.example` exception
- Preserved `!.vscode/extensions.json` and added `!.vscode/settings.json` exception
- Reorganized sections with clearer comments

**Why:** Prevent auto-generated files, tool-specific configs, and OS artifacts from being committed. The route tree and TanStack temp files are regenerated on every build/dev start, so they don't belong in version control.

### 2. Created `CHANGELOG.dev.md`

**Files created:** `CHANGELOG.dev.md`

**What changed:** Created this file to track all development modifications.

**Why:** Provides a clear audit trail for reverting changes, troubleshooting issues, and recovering context across sessions.

---

## Architecture Decisions Log

### ADR-001: State Management Strategy
- **Decision:** Zustand with persist middleware as primary state management
- **Status:** Planned (not yet implemented)
- **Context:** App runs in Amazon Connect iframe, needs state persistence across mount/unmount cycles

### ADR-002: Tab System Routing
- **Decision:** URL reflects only active tab; inactive tab metadata stored in Zustand
- **Status:** Planned
- **Context:** TanStack Router manages navigation, tabs unmount when inactive (default Router behavior)

### ADR-003: Tab Rendering
- **Decision:** Unmount inactive tabs (no `display: none` approach)
- **Status:** Planned
- **Context:** Performance > instant restore. Previous `display: none` implementation was buggy and heavy with many tabs open.

---

## Next Steps
- **Phase 1:** Install Zustand, create `useTabsStore` with Zod schemas and persist middleware
