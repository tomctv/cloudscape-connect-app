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

### 13. Amazon Connect SDK integration layer (Phase 3)

**Packages installed:**
- `@amazon-connect/app` — core SDK, lifecycle events (`onCreate`, `onDestroy`)
- `@amazon-connect/contact` — `ContactClient` (contact lifecycle) + `AgentClient` (agent info/state)
- `@amazon-connect/voice` — `VoiceClient` (calls, hold/resume, conference)
- `@amazon-connect/email` — `EmailClient` (email data, drafts, send)

**Files created:**
- `src/features/amazon-connect/provider/connect-provider.ts` — `initConnectProvider()` calls `AmazonConnectApp.init()` when inside the Agent Workspace iframe; returns `null` in local dev (detects iframe via `window.self !== window.top`). `getConnectProvider()` returns the cached provider.
- `src/features/amazon-connect/clients/create-client.ts` — generic factory `createClientGetter()` for lazy-initializing SDK clients. Returns `null` when provider is unavailable.
- `src/features/amazon-connect/clients/agent-client.ts` — `getAgentClient()` singleton getter
- `src/features/amazon-connect/clients/contact-client.ts` — `getContactClient()` singleton getter
- `src/features/amazon-connect/clients/voice-client.ts` — `getVoiceClient()` singleton getter
- `src/features/amazon-connect/clients/email-client.ts` — `getEmailClient()` singleton getter
- `src/features/amazon-connect/clients/index.ts` — clients barrel export
- `src/features/amazon-connect/provider/index.ts` — provider barrel export
- `src/features/amazon-connect/index.ts` — public API barrel export

**Architecture:**
- Provider is initialized once at app startup via `initConnectProvider()`
- Clients are lazy singletons: created on first `getXxxClient()` call using the provider
- All getters return `T | null` — `null` means not available (local dev or provider not initialized)
- Consumers check for null before using clients, enabling graceful degradation outside the workspace
- Additional clients (`FileClient`, `ActivityClient`, etc.) can be added later by installing their packages and creating a new getter file

**Why:** The Amazon Connect SDK requires initialization inside the Agent Workspace iframe. This integration layer provides a clean abstraction: the provider handles lifecycle, the factory pattern keeps client creation consistent, and the null-returning getters enable safe local development without mocks or conditional imports.

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

## [2026-03-12] Session 3 — Phase 3: Amazon Connect Integration Layer

### 13. Amazon Connect SDK integration — provider init + client singletons

**Files created:**
- `src/features/amazon-connect/provider/connect-provider.ts` — `initConnectProvider()` (async, detects iframe, applies theme) + `getConnectProvider()` singleton getter
- `src/features/amazon-connect/provider/index.ts` — barrel export
- `src/features/amazon-connect/clients/agent-client.ts` — lazy singleton `getAgentClient()` from `@amazon-connect/contact`
- `src/features/amazon-connect/clients/contact-client.ts` — lazy singleton `getContactClient()` from `@amazon-connect/contact`
- `src/features/amazon-connect/clients/voice-client.ts` — lazy singleton `getVoiceClient()` from `@amazon-connect/voice`
- `src/features/amazon-connect/clients/email-client.ts` — lazy singleton `getEmailClient()` from `@amazon-connect/email`
- `src/features/amazon-connect/clients/index.ts` — barrel export
- `src/features/amazon-connect/index.ts` — public API barrel

**Files modified:**
- `src/main.tsx` — calls `await initConnectProvider()` at startup before rendering

**What changed:**
- `initConnectProvider()` detects if running inside Agent Workspace iframe (`window.self !== window.top`). In local dev (not in iframe), returns `null` and logs a warning — no SDK timeout errors.
- After `AmazonConnectApp.init()`, applies the Agent Workspace theme via `await applyConnectTheme(provider)` from `@amazon-connect/theme`.
- Each client follows the same lazy singleton pattern: on first call, creates the client with the provider; on subsequent calls, returns the cached instance. Returns `null` if provider unavailable (local dev).

**Why:** Phase 3 establishes the integration layer without wiring events yet. All Amazon Connect SDK access goes through these getters, making it easy to mock for local dev in the future.

---

## [2026-03-15] Session 4 — Browser-Like Tab Navigation (Instant Tab Switching)

### 14. Browser-like tab switching with `display: none` / `display: contents`

**Files created:**
- `src/features/tabs/components/tab-panels.tsx` — `TabPanels` component: renders ALL open tab panels simultaneously, hides inactive ones with `display: none`, shows active one with `display: contents`. Determines visibility from Zustand `activeTabId` + `isTabRoute` check.
- `src/features/customer/components/customer-tab-panel.tsx` — `CustomerTabPanel` wrapping customer-specific content with its own `<Suspense>` boundary and loading fallback. Contains `CustomerTabContentInner` (memoized with `React.memo`) for data fetching and tab label/icon sync.

**Files modified:**
- `src/routes/__root.tsx` — added `<TabPanels />` alongside `<Outlet />` in the root layout
- `src/routes/customers/$customerId.tsx` — route component changed to `() => null`. Route still provides `onEnter` (tab creation), `beforeLoad` (validation), `loader` (data prefetch), `validateSearch`. Content rendering delegated to `TabPanels`.
- `src/features/customer/components/customer-page.tsx` — accepts `customerId` as prop (no longer reads from route). Removed `<Outlet />` (no sub-routes).
- `src/features/customer/components/customer-header/customer-header.tsx` — accepts `customerId` as prop, removed `getRouteApi`, removed contacts link
- `src/features/customer/components/customer-navbar/customer-navbar.tsx` — accepts `customerId` as prop, passes to `CustomerBreadcrumbs`
- `src/features/customer/components/customer-navbar/customer-breadcrumbs.tsx` — accepts `customerId` as prop, removed `getRouteApi`
- `src/features/customer/components/customer-information-card/customer-information-card.tsx` — accepts `customerId` as prop, removed `getRouteApi`

**Files deleted:**
- `src/routes/customers/$customerId.contacts.tsx` — contacts sub-route removed (will be reimplemented as hash-based sub-navigation)

**Architecture:**

Two separate rendering mechanisms now coexist:
1. **`<TabPanels />`** — renders tab content. Panels are always mounted, hidden with CSS. Switching is instant (no mount/unmount, no re-render, just CSS change).
2. **`<Outlet />`** — renders non-tab routes (`/customers/search`, `/settings`, etc.) normally via TanStack Router.

Tab route components return `null` — their purpose is URL matching, `onEnter` for tab creation, and `loader` for data prefetch. The actual content is rendered by `TabPanels`.

**Why:** Switching between tabs caused visible lag because TanStack Router unmounts the old route component and mounts the new one. With complex Cloudscape components (AppLayoutToolbar, ContentLayout, Tabs with 5 sub-tabs), this mount/unmount cycle was slow. The `display: none` approach keeps all tab DOM trees alive in memory — switching is a pure CSS change, identical to how browsers handle tabs.

### 15. Instant tab switch: bypass TanStack Router navigation on tab click

**Files modified:**
- `src/features/tabs/components/new-tab-bar/new-tab-bar.tsx` — tab click handler replaced `navigate({ to: tab.activePath })` with `window.history.pushState(null, "", tab.activePath)`. `setActiveTabId()` (Zustand, sync) handles the visual switch; `pushState` updates the browser URL without triggering TanStack Router's async pipeline.

**What changed:**
- Clicking an already-open tab no longer goes through TanStack Router's `navigate()` (which runs route matching → `beforeLoad` → `loader` → render).
- Instead: `setActiveTabId()` updates Zustand immediately (sync) → `TabPanels` re-renders → CSS switches the visible panel. URL updated via `pushState` (instant, no router involvement).
- TanStack Router is unaware of the URL change (`pushState` doesn't trigger `popstate`), but this doesn't matter: tab content is driven by Zustand, not by the router. The next "real" TanStack Router navigation (opening a new customer, navigating to a non-tab route) re-syncs the router with the actual URL.

**Why:** Even with the `display: none` approach, `navigate()` introduced lag because TanStack Router's navigation pipeline is async. Bypassing it makes the switch truly instantaneous.

### 16. Performance: memoized tab panel content to prevent cascading re-renders

**Files modified:**
- `src/features/customer/components/customer-tab-panel.tsx` — `CustomerTabContentInner` wrapped with `React.memo`, receives only stable primitive props (`customerId: string`, `tabId: string`) instead of the full `Tab` object.

**What changed:**
- Previously, `setActiveTabId()` in the store updates `lastAccessedAt` via `tabs.map()`, creating new object references for all tabs. This caused ALL `CustomerTabContent` instances to re-render (each running `useSuspenseQuery`, re-rendering `CustomerPage` with all Cloudscape children).
- Now, `CustomerTabContentInner` is memoized and receives only `customerId` and `tabId` (strings that never change for a given tab). When `activeTabId` changes, `TabPanels` re-renders but `React.memo` skips the content components — only the `style` prop on the wrapper div changes.

**Why:** Without memoization, switching between tabs with 5 open tabs caused ~30 component re-renders (all tabs × all sub-components). With memoization, switching causes 0 content re-renders — only CSS changes.

### 17. Horizontal-only drag constraint for tab reordering

**Files modified:**
- `src/features/tabs/components/new-tab-bar/tab-item.tsx` — added `RestrictToHorizontalAxis` modifier from `@dnd-kit/abstract/modifiers` to `useSortable` options.

**What changed:**
- Tab drag-and-drop now restricted to horizontal movement only (like browser tabs). Previously, dragging a tab allowed vertical movement across the entire viewport.

**Why:** Matches browser tab behavior — tabs can only be reordered horizontally within the tab bar.

---

## Architecture Decisions Log (continued)

### ADR-010: Tab Content Rendering via `TabPanels` with `display: none`
- **Decision:** Tab content is NOT rendered by TanStack Router's `<Outlet>`. Instead, a `<TabPanels>` component renders all open tabs simultaneously, hiding inactive ones with `display: none` / `display: contents`.
- **Status:** Implemented (Session 4)
- **Context:** TanStack Router's `<Outlet>` unmounts the old route component and mounts the new one on navigation. For complex pages with heavy Cloudscape components, this causes visible lag. The `display: none` approach keeps all DOM trees alive — switching is a pure CSS change with zero React re-renders (thanks to `React.memo`). This is how browsers handle tabs. Trade-off: tab route components return `null` and serve only as URL matchers + `onEnter` handlers + data prefetchers.

### ADR-011: Bypass TanStack Router for Tab Switching
- **Decision:** Clicking an already-open tab uses `setActiveTabId()` (Zustand) + `window.history.pushState()` to switch instantly, bypassing TanStack Router's `navigate()`.
- **Status:** Implemented (Session 4)
- **Context:** TanStack Router's `navigate()` triggers an async pipeline (route matching → `beforeLoad` → `loader` → render) that introduced lag even with cached data. Since tab content is rendered by `TabPanels` (driven by Zustand, not by the router), the router's pipeline is unnecessary for tab switches. `pushState` updates the URL bar without router involvement. TanStack Router re-syncs on the next "real" navigation (opening a new customer, navigating to a non-tab route).

### ADR-012: Tab Panel Ownership — Each Tab Type Owns Its Rendering
- **Decision:** `TabPanels` is agnostic to how tab content is rendered. Each tab type provides its own panel component (e.g., `CustomerTabPanel`) which owns its `<Suspense>` boundary, loading fallback, data fetching, and rendering logic.
- **Status:** Implemented (Session 4)
- **Context:** Different tab types may or may not need Suspense, may have different loading states, and may fetch data differently. Centralizing this in `TabPanels` would create coupling. Instead, `TabPanels` only handles visibility (`display: none` / `display: contents`) and delegates content to type-specific panel components.

---

## [2026-03-20] Session 5 — Bug Fixes: Double Fetch, Flash, Error Handling, Tab Status

### 18. Fixed visual flash on tab switch: `visibility: hidden` + Zustand-only visibility

**Files modified:**
- `src/features/tabs/components/tab-panels.tsx` — replaced `display: none` with `visibility: hidden; position: absolute; overflow: hidden; height: 0; pointer-events: none` for inactive panels. Removed dependency on `useLocation()` — visibility now driven purely by Zustand `activeTabId`.

**Why:** `display: none` caused a flash when switching tabs because it fully unmounts/remounts the DOM subtree in some cases, and the re-paint was visible. `visibility: hidden` keeps the element in the render tree and layout, so the browser retains all rendering state — switching is a single CSS property change. Removing `useLocation()` eliminated re-renders triggered by router state changes unrelated to tab visibility.

### 19. Per-tab AbortController system for request cancellation

**Files created:**
- `src/features/tabs/store/tab-abort-controllers.ts` — module-level `Map<string, AbortController>` keyed by `resourceId`. Exports `getTabSignal(resourceId)` (creates or reuses a controller) and `abortTab(resourceId)` (aborts and deletes the controller).

**Files modified:**
- `src/features/tabs/components/tab-bar/new-tab-bar.tsx` (later renamed) — replaced `queryClient.cancelQueries()` with `abortTab(closedTab.resourceId)` on tab close.
- `src/features/customer/api/query-options.ts` — replaced React Query's `querySignal` with `getTabSignal(customerId)` in `queryFn`.
- `src/features/customer-contact-history/api/query-options.ts` — same pattern.

**Why:** React Query's `querySignal` gets aborted on component unmount/remount cycles, causing spurious request cancellations during React's own lifecycle (double-fetch on initial navigation). Decoupling with a custom `AbortController` per tab ensures requests are only cancelled on explicit tab close — never by React lifecycle events. `cancelQueries` without a signal in the `queryFn` had no HTTP-level effect.

### 20. Fixed double fetch on refresh (multiple tabs open)

**What changed:**
- Root cause: TanStack Router remounts the root component once during initial navigation transition (`pending → idle`). All tab panels unmount and remount, and React Query's `querySignal` — which was previously in the `queryFn` — gets aborted and re-issued during the remount, causing a second fetch.
- Fix: removing `querySignal` from `queryFn` (replaced by `getTabSignal`) eliminated the spurious second fetch. The custom signal is only aborted on tab close, not on React remount.

### 21. Error handling for customer data fetch: `ApiError`, retry logic, `not-found-error` tab status

**Files modified:**
- `src/features/tabs/schemas/tab.schema.ts` — added `"idle"` and `"not-found-error"` to `TabStatusSchema`.
- `src/features/tabs/store/tabs.store.ts` — default status is `"idle"` when not provided in `openTab`; `setActiveTabId` auto-closes tabs with `"not-found-error"` status when navigating away; `partialize` filters out `"not-found-error"` tabs so they are never persisted to localStorage.
- `src/features/customer/api/query-options.ts` — added `retry` option: no retry on `ApiError` with `statusCode === 404`; up to 3 retries for other errors.
- `src/features/customer/components/customer-tab-panel.tsx` — changed from `useSuspenseQuery` to `useQuery` with `enabled: !isNotFound` (checks both Zustand tab status and React Query cache for 404). Two `useEffect`s: one sets status to `"idle"` on success, one sets `"not-found-error"` or `"error"` on failure. Renders `<CustomerNotFoundPage />` for 404, `<CustomerErrorPage onRetry={refetch} />` for other errors.
- `src/api/clients/api-client.ts` — propagates cancel errors silently (no console noise on tab close).
- `src/routes/customers/$customerId.tsx` — loader skips prefetch if 404 already in React Query cache; `onEnter` sets initial status to `"loading"`.

**Why:** 404 errors must be handled distinctly — the tab should show a "not found" page and auto-close when the user navigates away, rather than staying open and re-fetching on every revisit. Generic errors show a retry option. Not-found tabs are excluded from localStorage persistence since they'd just re-trigger a useless fetch on next load.

### 22. `prefetchQuery` (non-blocking loader) instead of `ensureQueryData`

**Files modified:**
- `src/routes/customers/$customerId.tsx` — changed `loader` from `ensureQueryData` (await, blocks navigation) to `prefetchQuery` (fire-and-forget). Tab creation moved entirely to `onEnter`.

**Why:** `ensureQueryData` caused a visible delay before the tab opened because navigation was blocked until the data loaded. With `prefetchQuery`, the tab opens immediately and the loading state is shown while data arrives. `onEnter` is the correct hook for tab creation (fires on actual navigation, not on hover pre-loading like `beforeLoad`).

---

## [2026-04-11] Session 6 — Tab Bar Rewrite: Custom Tab Bar, Scroll, Search, Refactoring

### 23. Custom tab bar with dnd-kit drag & drop (replaced Cloudscape Tabs)

**Files created:**
- `src/features/tabs/components/new-tab-bar/new-tab-bar.tsx` — custom tab bar using `@dnd-kit/react` for drag & drop reordering. Click handling via event delegation (`onClickCapture` on `<ul>`). Tab activation + navigation on click; close + abort + redirect on close button.
- `src/features/tabs/components/new-tab-bar/tab-item.tsx` — individual tab `<li>` with `useSortable` + `RestrictToHorizontalAxis` modifier. Semantic icon map (`TabIcon → Lucide`). Close button with `data-action="close"` + `data-tab-id` for event delegation.
- `src/features/tabs/components/new-tab-bar/index.tsx` — barrel export.

**Files modified:**
- `src/features/navigation/components/app-navigation.tsx` — switched from Cloudscape `TabBar` to `NewTabBar`.
- `src/features/tabs/store/tabs.store.ts` — added `reorderTabs(ids: string[])` action.

**Why:** Cloudscape's `Tabs` component doesn't support drag & drop reordering. The custom implementation gives full control over styling, behavior, and extensibility.

### 24. Tab drag order persisted in Zustand + localStorage

**What changed:**
- `handleDragEnd` in `NewTabBar` calls `reorderTabs(newOrder)` after a drag completes, persisting the new order to Zustand (and via `persist` middleware to localStorage).
- Fixed TypeScript error: `DragEndEvent` is the callback type, not the event argument type. Uses `Parameters<DragEndEvent>[0]` for the argument type.
- `isSortable` from `@dnd-kit/dom/sortable` used as type guard instead of `source as any`.

**Why:** Without persisting to Zustand, tab order was reset on page refresh.

### 25. Fixed `activePath` sync: moved effect from old `TabBar` to `NewTabBar`

**What changed:**
- The `activePath` sync `useEffect` (which updates the active tab's `activePath` when location changes) existed only in the old Cloudscape `TabBar`, which was commented out. Moved to `NewTabBar` (and later to `TabBar` after rename).
- Only syncs the ACTIVE tab to avoid overwriting persisted `activePath` of inactive tabs.
- Uses `maskedLocation.href` fallback for masked navigation.

**Why:** Without this effect, `activePath` was never updated after the initial tab creation — sub-route navigation within a tab was not persisted.

### 26. Horizontal scroll with arrow buttons (`useTabScroll` hook)

**Files created:**
- `src/features/tabs/hooks/use-tab-scroll.ts` — `useTabScroll(tabs, activeTabId)` hook. Manages: `canScrollLeft`/`canScrollRight` state; scroll listener + `ResizeObserver` on the scroll container (Effect 1, stable); scroll state update + active tab scroll-into-view on tabs/activeTab change (Effect 2). Debounced scroll-on-resize via `useDebouncedCallback` from `@tanstack/react-pacer` (150ms). Active tab scroll uses `getBoundingClientRect()` (not `offsetLeft`) for accurate positioning relative to the scroll container. 60px margin ensures active tab is never flush against the edge.
- `src/features/tabs/components/tab-bar/tab-bar-styles.ts` — all styled components: `TabBarWrapper`, `ScrollArea`, `ScrollNavLeft`, `ScrollNavRight` (with directional `box-shadow` and border), `TabsList`, `NoMatchItem`.

**Files modified:**
- Tab bar component — wraps tabs in `ScrollArea` with `overflow-x: auto` + hidden scrollbar; `ScrollNavLeft`/`ScrollNavRight` buttons shown when overflow exists, disabled at scroll boundaries.

**Key decisions:**
- Both scroll buttons always rendered when any overflow exists (not just the relevant one) — avoids layout shift; each button individually disabled when at its boundary.
- `box-shadow` applied only via `:not(:disabled)` — shadow visible only when tabs are hidden under that button.
- `&:disabled > * { opacity: 0.3 }` fades only the icon child, not the button's `border-bottom` — keeps the bottom border line visually continuous.
- Scroll threshold: `el.scrollLeft + el.clientWidth < el.scrollWidth` (no `-1` offset) — avoids false-negative disabled state due to sub-pixel rounding.
- `getBoundingClientRect()` instead of `offsetLeft` for accurate scroll-into-view calculation regardless of intermediate CSS positioning context.
- Debounced resize scroll (150ms) via `useDebouncedCallback` — scrolls active tab into view after viewport resize settles, without firing on every pixel.

### 27. Tab bar component and folder refactored and renamed

**Renames:**
- Folder `src/features/tabs/components/new-tab-bar/` → `src/features/tabs/components/tab-bar/`
- File `new-tab-bar.tsx` → `tab-bar.tsx`, export `NewTabBar` → `TabBar`
- Hook moved to `src/features/tabs/hooks/use-tab-scroll.ts`

**Deleted:**
- Old Cloudscape `TabBar` (`src/features/tabs/components/tab-bar.tsx`) — replaced by custom implementation.
- `src/features/tabs/components/no-match-indicator.tsx` — replaced by `NoMatchItem` (styled `<li>`) in `tab-bar-styles.ts`.

**Files modified:**
- `src/features/tabs/components/tab-bar/index.tsx` — updated re-export.
- `src/features/tabs/index.ts` — updated barrel to point to new folder.
- `src/features/navigation/components/app-navigation.tsx` — imports from barrel (`@/features/tabs`), removed commented code.

### 28. Tab search with filtering, lifted state, and reset on outside click

**Files modified:**
- `src/features/tabs/components/tab-search.tsx` — now a fully controlled component: `active`, `onToggle`, `query`, `onChange` as props. State no longer owned internally. Removed Cloudscape `Input` focus ring via `box-shadow: none !important` targeting `[class*="awsui_input"]`.
- `src/features/tabs/components/tab-bar/tab-bar.tsx` — owns `searchActive` and `searchQuery` state; computes `visibleTabs` by filtering `tabs` on `searchQuery`; passes all four props to `TabSearch`; resets search in `handleClick` after tab activation; adds `handleTabBarBlur` (resets search when focus leaves `TabBarWrapper` via `event.currentTarget.contains(event.relatedTarget)`).
- `src/features/tabs/components/tab-bar/tab-item.tsx` — added `tabIndex={-1}` to `StyledListItem` and `title={`Close ${tab.label}`}` to `CloseButton`.

**Why (state lifting):** `active` and `query` are related state that must be reset together. Previously `active` lived in `TabSearch` (uncontrolled) while `query` was controlled from `TabBar` — a mixed pattern. Lifting `active` to `TabBar` makes the component fully controlled, enables resetting both states atomically from the parent, and avoids the blur-before-click race condition that caused tab navigation to fail when search was open.

**Why (`tabIndex={-1}`):** `onBlur`'s `relatedTarget` is `null` for non-focusable elements. Without `tabIndex`, clicking a tab while search is active would set `relatedTarget = null` → `contains(null) = false` → premature search reset → tabs re-render → click misses. `tabIndex={-1}` makes `<li>` focusable on click (not in keyboard tab order) so `relatedTarget` = the `<li>` → `contains()` = true → no reset. Reset happens cleanly in `handleClick` instead.

---

## Architecture Decisions Log (continued)

### ADR-013: Fully Controlled TabSearch — State Lifted to TabBar
- **Decision:** `TabSearch` is a fully controlled component. Both `active` (input visible/hidden) and `query` (search string) are owned by `TabBar`, not by `TabSearch` itself.
- **Status:** Implemented (Session 6)
- **Context:** Originally `active` was internal to `TabSearch` (uncontrolled) while `query` was controlled from `TabBar`. This mixed pattern prevented atomic reset of both states from the parent. The user discovered that resetting `active` in `handleClick` (after tab navigation) was the cleanest fix for the blur-before-click race condition — but this required `active` to be owned by the parent. Lifting state eliminated the bug without any event ordering hacks, timeouts, or effects.

### ADR-014: Per-Tab AbortControllers Decoupled from React Query
- **Decision:** HTTP request cancellation uses a custom per-tab `AbortController` map, not React Query's internal `querySignal`.
- **Status:** Implemented (Session 5)
- **Context:** React Query aborts its `querySignal` on component unmount. Since tab panels unmount during React's initial render cycle (root component remount during router `pending → idle` transition), using `querySignal` caused spurious double-fetches. The custom controller is only aborted on explicit tab close (`abortTab(resourceId)`), making cancellation intentional and predictable.

## Next Steps
- **Phase 4:** Wire Amazon Connect contact events to tab system
- **Phase 5:** Additional Connect clients (File, Activity, QuickResponses, MessageTemplate, User)
- **Hash-based sub-navigation:** Already partially implemented via `activePath` with hash; may need dedicated sub-navigation components
