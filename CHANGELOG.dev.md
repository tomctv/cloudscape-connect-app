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

### 9. Enriched tab schema with icon, status, isPinned, closable + unified TabContent component

**Files modified:**
- `src/features/tabs/schemas/tab.schema.ts` — added `TabIconSchema` (`"customer-default"`, `"customer-client"`, `"customer-prospect"`, `"unknown-customer"`), `TabStatusSchema` (`"active-contact"`, `"error"`, `"unsaved-changes"`), and four new optional fields on `TabSchema`: `icon`, `isPinned`, `closable`, `status`
- `src/features/tabs/store/tabs.store.ts` — expanded `openTab` params to accept `icon`, `isPinned`, `closable`; expanded `updateTab` pick type to include all new fields
- `src/features/tabs/components/tab-content.tsx` — **new** unified component replacing `customer-tab-link.tsx` + `tab-link-content.tsx`. Takes full `Tab` object as prop, uses `linkOptions` switch on `tab.type` for type-safe routing, maps semantic `TabIcon` to Lucide icons (`UserIcon`, `UserCheckIcon`, `UserPlusIcon`, `CircleQuestionMarkIcon`), overrides icon with Cloudscape `status-warning` on `tab.status === "error"`
- `src/features/tabs/components/tab-bar.tsx` — simplified to use `<TabContent tab={tab} />` for all tab types; uses `tab.closable !== false` for `dismissible`; removed per-type rendering logic
- `src/routes/customers/$customerId.tsx` — passes `icon: "customer-default"` in `openTab`; `useEffect` now also updates `icon` based on `customer.status` (client/prospect/default)
- `src/features/tabs/index.ts` — exports `TabIconSchema`, `TabStatusSchema`, `TabIcon`, `TabStatus`

**Files deleted:**
- `src/features/tabs/components/customer-tab-link.tsx` — consolidated into `tab-content.tsx`
- `src/features/tabs/components/tab-link-content.tsx` — consolidated into `tab-content.tsx`

**What changed:**
- **`icon`** (optional `TabIconSchema`): semantic identifier mapped to Lucide icons in the component layer. Supports `"customer-default"`, `"customer-client"`, `"customer-prospect"`, `"unknown-customer"`. Set to `"customer-default"` on tab creation, updated via `updateTab` when API data provides customer status.
- **`isPinned`** (optional boolean): pinned tabs stick to the left and can't be dismissed. Defaults to `false` when undefined.
- **`closable`** (optional boolean): controls whether the dismiss button appears on the tab. Defaults to `true` when undefined.
- **`status`** (optional `TabStatusSchema`): visual status indicator. `"active-contact"` for customer currently in a call/chat, `"error"` for failed data loads (overrides icon with warning), `"unsaved-changes"` for pending form modifications. Not set on creation — applied later via `updateTab`.
- **`TabContent` component**: single unified component that receives the full `Tab` object and derives everything (link target via `linkOptions` switch, icon via `TAB_ICON_MAP`, error override). Replaces the previous three-component chain (`tab-bar → customer-tab-link → tab-link-content`).

**Why:** Richer tab metadata enables better UX: visual differentiation by customer status, pinning for frequently used tabs, protecting important tabs from accidental closure, and status indicators for at-a-glance awareness. Consolidating rendering into `TabContent` simplifies the component tree and makes adding new tab types straightforward (one `case` in the switch). All new fields are optional and backward-compatible with existing persisted data (schema version stays at 1).

### 10. Added `"loading"` tab status + spinner, fixed tab dismiss/navigation logic

**Files modified:**
- `src/features/tabs/schemas/tab.schema.ts` — added `"loading"` to `TabStatusSchema`
- `src/features/tabs/components/tab-content.tsx` — imported Cloudscape `Spinner`, renders `<Spinner size="normal" />` when `tab.status === "loading"` (checked before error and icon)
- `src/features/tabs/components/tab-bar.tsx` — two fixes:
  1. **`handleDismissTab`**: redirect now only happens when `location.pathname.startsWith(closedTab.route)` (i.e., the user is currently viewing the closed tab). If the user is on a non-tab route like `/customers/search`, closing a tab no longer causes unwanted navigation.
  2. **`handleTabChange`**: removed `navigate()` call — only updates `activeTabId` via store. Navigation is already handled by `<TabLink>` (TanStack Router link) inside `<TabContent>`.

**Why:** The `"loading"` status provides visual feedback while tab data is being fetched. The dismiss/navigation fix corrects two issues: (1) closing a tab while on a different route caused an unwanted redirect to `/` or the next tab; (2) `onChange` was calling `navigate()` redundantly since the tab label is already a `<TabLink>` that triggers navigation on click — doubling up caused unnecessary navigation calls. See ADR-008.

### 11. Tab route memory — `basePath` + `activePath` split (Phase 2)

**Files modified:**
- `src/features/tabs/schemas/tab.schema.ts` — replaced `route` field with two fields: `basePath` (required, immutable) and `activePath` (required, mutable)
- `src/features/tabs/store/tabs.store.ts` — `openTab` accepts `basePath`, sets `activePath = basePath` at creation; `updateTab` allows `activePath` but excludes `basePath` (immutable)
- `src/features/tabs/components/tab-bar.tsx` — visual matching uses `tab.basePath` (`location.pathname.startsWith`); dismiss redirect uses `tab.activePath`; added `useEffect` to sync `activePath` when `location.pathname` changes within a tab's scope
- `src/features/tabs/components/tab-content.tsx` — `getLinkOptions` simplified to always use `tab.activePath` (removed per-type switch with hardcoded route patterns)
- `src/routes/customers/$customerId.tsx` — `onEnter` passes `basePath: match.pathname` instead of `route`

**What changed:**
- **`basePath`**: immutable path set at tab creation (e.g., `/customers/12345678`). Used for visual active matching and to determine if the current route "belongs" to a tab. Never changes after creation — intentionally excluded from `updateTab`.
- **`activePath`**: tracks the current/last visited path within the tab's scope (e.g., `/customers/12345678/contacts`). Updated automatically via a `useEffect` in `TabBar` that watches `location.pathname`. Clicking a tab navigates to its `activePath`, so the user returns exactly where they left off.
- **Simplified `TabContent`**: the `getLinkOptions` switch on `tab.type` was removed. Since `activePath` always contains the correct full path, all tab types use `linkOptions({ to: tab.activePath })`. This removes the coupling between `TabContent` and route patterns.

**Why:** Tabs need to remember sub-routes (ADR-007). Two approaches were considered: (A) deriving the base route at runtime via a function that maps `tab.type` → URL pattern, or (B) persisting `basePath` as a field. Option B wins because it's self-contained (no external function that must know every tab type's URL structure), doesn't break when route patterns change, and works automatically for any future tab type. See ADR-009.

### 12. Search params persistence in `activePath` via `location.href` + `maskedLocation` handling

**Files modified:**
- `src/features/tabs/components/tab-bar.tsx` — `activePath` sync `useEffect` now uses `location.href` (includes search params and hash) instead of `location.pathname`. When `location.maskedLocation` is present (masked navigation via TanStack Router's `mask` feature), uses `maskedLocation.href` instead to avoid persisting transit search params (e.g., `customerName`). Dependency changed from `location.pathname` to `location` (full object).

**What changed:**
- `activePath` now stores the full href including search params (e.g., `/customers/10000036/contacts?channel=VOICE_INBOUND`)
- Clicking a tab restores both the sub-route and any active filters/search params
- Masked search params (like `customerName` passed via `CustomerDetailsLink`) are correctly excluded: when TanStack Router navigates with `mask`, the `location` object contains a `maskedLocation` property with the "clean" URL. The sync logic uses `maskedLocation.href` when present, falling back to `location.href` otherwise.
- `maskedLocation` is not exposed in TanStack Router's public `ParsedLocation` type, so it's accessed via `as unknown as Record<string, unknown>` cast.

**Why:** Sub-route memory (Phase 2) was incomplete without search params — navigating to `/customers/123/contacts?channel=VOICE_INBOUND`, switching to another tab, and coming back would lose the `?channel=VOICE_INBOUND` filter. Using `location.href` captures everything. The `maskedLocation` check prevents transit params (passed via `mask` for `onEnter` data) from leaking into `activePath` and being exposed in the URL on subsequent tab clicks.

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
- **Status:** Implemented (Phase 2)
- **Context:** When reopening a tab, the user should find it exactly where they left off, including any sub-route they were viewing. Implemented via `basePath` + `activePath` split (see ADR-009).

### ADR-008: No `navigate()` in Tab `onChange` — Navigation Belongs to the Link
- **Decision:** The Cloudscape Tabs `onChange` handler must only update `activeTabId` in the store. It must NOT call `navigate()`.
- **Status:** Implemented (Phase 1)
- **Context:** Each tab's `label` is a `<TabLink>` (TanStack Router `createLink` wrapper). Clicking a tab already triggers navigation via the link. Adding `navigate()` in `onChange` creates a redundant navigation call. TanStack Router deduplicates same-route navigations, masking the bug, but it's conceptually wrong and fragile. Rule: when the clickable element is already a Router `<Link>`, the event handler must only manage state — never navigation.

### ADR-009: `basePath` + `activePath` Split (Persisted, Not Derived)
- **Decision:** Each tab stores two path fields: `basePath` (immutable, set at creation) and `activePath` (mutable, updated on sub-navigation). The base route is NOT derived at runtime from `tab.type`.
- **Status:** Implemented (Phase 2)
- **Context:** Two approaches were considered for visual matching and sub-route memory: (A) derive the base route via `getTabBaseRoute(tab)` function with a switch on `tab.type`, or (B) persist `basePath` as a field. Option A creates coupling between the function and every tab type's URL pattern — fragile, requires updates when route structures change, and the `default` case is incorrect for tabs whose `activePath` has drifted from the base. Option B is self-contained: each tab carries its own anchor path, no external knowledge needed, works for any tab type without code changes.

---

## Next Steps
- **Phase 2 (remaining):** Tab state restore on app mount (navigate to last active tab on remount)
- **Phase 3:** Amazon Connect integration layer (@amazon-connect/app SDK)
