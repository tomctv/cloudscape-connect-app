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

## [2026-03-10] Session 2 — Phase 1: Zustand Foundation + Tab System

### 3. Installed Zustand

**What changed:** Added `zustand` as a production dependency.

**Why:** Primary client-side state management library. Chosen for its simplicity, small bundle size, and built-in `persist` middleware for localStorage persistence.

### 4. Created `features/tabs/` feature module

**Files created:**
- `src/features/tabs/schemas/tab.schema.ts` — Zod schemas + TypeScript types
- `src/features/tabs/store/tabs.store.ts` — Zustand store with persist middleware
- `src/features/tabs/store/index.ts` — barrel export for store
- `src/features/tabs/index.ts` — public API barrel for the feature

**What changed:**

**Tab schema** (`tab.schema.ts`):
- `TabTypeSchema` — enum of tab types (currently only `"customer"`)
- `TabSchema` — full tab data: `id`, `type`, `resourceId`, `label`, `route`, `lastAccessedAt`, `createdAt`
- `TabsPersistedStateSchema` — versioned wrapper (v1) for validation on restore

**Tab store** (`tabs.store.ts`):
- **State:** `tabs: Tab[]`, `activeTabId: string | null`
- **Actions:** `openTab`, `closeTab`, `closeAllTabs`, `closeOtherTabs`, `setActiveTabId`, `updateTab`, `reorderTabs`
- **Persistence:** Zustand `persist` middleware with localStorage key `amazonConnect:app:v1:tabs`
- **Validation:** Zod `safeParse` on rehydration via custom `merge` function; falls back to fresh state if corrupted
- **Versioning:** `version: 1` in persisted state + `partialize` to exclude actions from storage
- **Tab uniqueness:** `openTab` activates existing tab if same ID already open (prevents duplicate customer tabs)
- **Smart close:** `closeTab` activates adjacent tab when closing the active one

**Why:** This is the core of the tab system. The store is purely serializable (no React elements, no functions) so it persists cleanly. The Zod validation on merge ensures corrupt localStorage never crashes the app.

### 5. Integrated TabNavigation with Zustand store

**Files modified:** `src/features/navigation/components/tab-navigation/tab-navigation.tsx`

**What changed:**
- Removed all commented-out mock tab data
- Connected to `useTabsStore` for tabs, activeTabId, setActiveTabId, closeTab
- Tab bar now reads from store and maps `Tab` data to Cloudscape `TabsProps.Tab` objects
- `onChange` handler: sets active tab in store + navigates via TanStack Router
- `onDismiss` handler (per-tab): closes tab in store + navigates to adjacent tab or home (`/`)
- Tab bar hidden when no tabs are open (`tabs.length === 0 → return null`)
- Visual active tab determined by matching `location.pathname` against tab routes
- When on a non-tab route (e.g., `/customers/search`), no tab is visually highlighted

**Why:** Connect the existing UI to the new store. The tab bar is now fully functional.

### 6. Tab creation via route `onEnter` + masked search params (user-driven refactor)

**Files modified:**
- `src/routes/customers/$customerId.tsx` — added `onEnter` hook + `validateSearch` for masked `customerName` param + `useEffect` fallback
- `src/features/customer-search/components/customer-details-link.tsx` — reverted to TanStack Router `Link` with `createLink`, added `search` + `mask` props
- `src/features/customer-search/components/customers-table.tsx` — passes `customerName` to `CustomerDetailsLink`

**What changed:**
- **Tab creation moved to route-level `onEnter`**: instead of creating tabs in link components, the `$customerId` route's `onEnter` hook calls `useTabsStore.getState().openTab()`. This ensures a tab is created regardless of how the user navigates (link click, URL paste, programmatic navigation).
- **Masked search params**: `CustomerDetailsLink` passes `customerName` as a search param via TanStack Router's `search` prop, but masks it with `mask` so the URL stays clean (`/customers/12345678` instead of `/customers/12345678?customerName=John+Doe`). The `customerName` is available in `onEnter` via `match.search.customerName`.
- **useEffect fallback**: in the route component, a `useEffect` watches `useSuspenseQuery` data and calls `updateTab()` to set the correct label from `firstName + lastName` — handles the edge case where `customerName` isn't available (e.g., direct URL navigation).
- **CustomerDetailsLink reverted to Link**: restored the original `createLink`-based component with `preload="intent"`, removing the `onClick`/`useNavigate` approach. The link is now purely presentational.

**Why:** Separation of concerns. Tab lifecycle belongs to the route, not to the components that trigger navigation. This avoids duplicating tab logic across every link/button that navigates to a customer route. The masked search param pattern allows passing data to `onEnter` without polluting the URL.

### 7. Moved tab components to `features/tabs/components/` + renamed to TabBar

**Files moved:**
- `src/features/navigation/components/tab-navigation/tab-navigation.tsx` → `src/features/tabs/components/tab-bar.tsx` (renamed export: `TabNavigation` → `TabBar`)
- `src/features/navigation/components/tab-navigation/customer-tab-link.tsx` → `src/features/tabs/components/customer-tab-link.tsx`
- `src/features/navigation/components/tab-navigation/tab-link.tsx` → `src/features/tabs/components/tab-link.tsx`
- `src/features/navigation/components/tab-navigation/tab-link-content.tsx` → `src/features/tabs/components/tab-link-content.tsx`
- `src/features/navigation/components/tab-navigation/tab-search.tsx` → `src/features/tabs/components/tab-search.tsx`
- `src/features/navigation/components/tab-navigation/no-match-indicator.tsx` → `src/features/tabs/components/no-match-indicator.tsx`

**Files modified:**
- `src/features/tabs/index.ts` — added `TabBar` to barrel export
- `src/features/navigation/components/app-navigation.tsx` — updated import to `import { TabBar } from "@/features/tabs"`

**Files deleted:** `src/features/navigation/components/tab-navigation/` (entire folder)

**Why:** Tab UI components belong in the `tabs` feature, not in `navigation`. This keeps the vertical slice complete: store + schemas + components all co-located. `features/navigation/` retains only `AppNavigation` (the main app navbar) which will be expanded with future features.

### 8. Changed timestamps from ISO strings to numeric epoch milliseconds

**Files modified:**
- `src/features/tabs/schemas/tab.schema.ts` — `lastAccessedAt` and `createdAt` changed from `z.string().datetime()` to `z.number().int().nonnegative()`
- `src/features/tabs/store/tabs.store.ts` — `new Date().toISOString()` → `Date.now()`

**Why:** `z.string().datetime()` is deprecated in Zod v4. Numeric timestamps (`Date.now()`) are faster to compare, lighter in localStorage, require no parsing, and are consistent with how TanStack Router and TanStack Query handle timestamps internally.

---

## Architecture Decisions Log

### ADR-001: State Management Strategy
- **Decision:** Zustand with persist middleware as primary state management
- **Status:** Implemented (Phase 1)
- **Context:** App runs in Amazon Connect iframe, needs state persistence across mount/unmount cycles

### ADR-002: Tab System Routing
- **Decision:** URL reflects only active tab; inactive tab metadata stored in Zustand
- **Status:** Implemented (Phase 1)
- **Context:** TanStack Router manages navigation, tabs unmount when inactive (default Router behavior)

### ADR-003: Tab Rendering
- **Decision:** Unmount inactive tabs (no `display: none` approach)
- **Status:** Implemented (Phase 1)
- **Context:** Performance > instant restore. Previous `display: none` implementation was buggy and heavy with many tabs open.

### ADR-004: Feature-Based Store Organization
- **Decision:** Stores co-located within features (`features/tabs/store/`), not centralized
- **Status:** Implemented (Phase 1)
- **Context:** Consistent with existing feature-based folder structure. Each feature exposes a public API via barrel `index.ts`.

### ADR-005: Cloudscape Tabs onDismiss Pattern
- **Decision:** Use per-tab `onDismiss` callback (not a top-level Tabs event)
- **Status:** Implemented (Phase 1)
- **Context:** Cloudscape v3 defines `onDismiss` as `ButtonProps['onClick']` on each tab object, not on the Tabs component.

### ADR-006: Tab Creation Belongs to Routes, Not Components
- **Decision:** Tab open/close logic lives in route hooks (`onEnter`), not in link/button components that trigger navigation
- **Status:** Implemented (Phase 1)
- **Context:** A link component should not be responsible for tab management. By placing `openTab()` in the route's `onEnter`, tabs are created regardless of how navigation occurs (link click, URL paste, programmatic redirect). Data needed by `onEnter` that isn't in route params (e.g., `customerName`) is passed via masked search params using TanStack Router's `mask` feature, keeping the URL clean.

### ADR-007: Tab Route Memory
- **Decision:** Tabs remember the last visited sub-route (e.g., `/customers/123/contacts`)
- **Status:** Planned
- **Context:** When reopening a tab, the user should find it exactly where they left off, including any sub-route they were viewing.

---

## Next Steps
- **Phase 2:** Tab state restore on app mount (navigate to last active tab)
- **Phase 3:** localStorage persistence hardening (Zod validation, error recovery)
- **Phase 4:** Search params persistence (hybrid URL + localStorage)
- **Phase 5:** Amazon Connect integration layer
