import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Tab,
  type TabType,
  TabsPersistedStateSchema,
} from "../schemas/tab.schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TabsState {
  /** Ordered list of open tabs. */
  tabs: Tab[];

  /** ID of the currently active (visible) tab, or null if no tab is active. */
  activeTabId: string | null;
}

interface TabsActions {
  /**
   * Open a new tab or activate it if a tab with the same ID already exists.
   * Returns the tab ID.
   */
  openTab: (params: {
    id: string;
    type: TabType;
    resourceId?: string;
    label: string;
    route: string;
  }) => string;

  /** Close a tab by ID. If the closed tab was active, activates an adjacent tab. */
  closeTab: (id: string) => void;

  /** Close all tabs. */
  closeAllTabs: () => void;

  /** Close all tabs except the one with the given ID. */
  closeOtherTabs: (id: string) => void;

  /** Set the active tab by ID (or null to deselect all tabs). */
  setActiveTabId: (id: string | null) => void;

  /** Update a tab's mutable properties (label, route). */
  updateTab: (id: string, updates: Partial<Pick<Tab, "label" | "route">>) => void;

  /** Reorder tabs by providing the full ordered array of tab IDs. */
  reorderTabs: (orderedIds: string[]) => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: TabsState = {
  tabs: [],
  activeTabId: null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      openTab: ({ id, type, resourceId, label, route }) => {
        const { tabs } = get();
        const now = new Date().toISOString();
        const existing = tabs.find((tab) => tab.id === id);

        if (existing) {
          // Tab already open — activate and update lastAccessedAt
          set({
            activeTabId: id,
            tabs: tabs.map((tab) =>
              tab.id === id ? { ...tab, lastAccessedAt: now } : tab,
            ),
          });
          return id;
        }

        const newTab: Tab = {
          id,
          type,
          resourceId,
          label,
          route,
          lastAccessedAt: now,
          createdAt: now,
        };

        set({
          tabs: [...tabs, newTab],
          activeTabId: id,
        });

        return id;
      },

      closeTab: (id) => {
        const { tabs, activeTabId } = get();
        const index = tabs.findIndex((tab) => tab.id === id);
        if (index === -1) return;

        const nextTabs = tabs.filter((tab) => tab.id !== id);

        // Determine next active tab when closing the active one
        let nextActiveTabId = activeTabId;
        if (activeTabId === id) {
          if (nextTabs.length === 0) {
            nextActiveTabId = null;
          } else {
            // Activate the tab to the right, or the last tab if we closed the rightmost
            const nextIndex = Math.min(index, nextTabs.length - 1);
            nextActiveTabId = nextTabs[nextIndex].id;
          }
        }

        set({ tabs: nextTabs, activeTabId: nextActiveTabId });
      },

      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      },

      closeOtherTabs: (id) => {
        const { tabs } = get();
        const kept = tabs.find((tab) => tab.id === id);
        if (!kept) return;

        set({ tabs: [kept], activeTabId: id });
      },

      setActiveTabId: (id) => {
        if (id === null) {
          set({ activeTabId: null });
          return;
        }

        const { tabs } = get();
        const tab = tabs.find((t) => t.id === id);
        if (!tab) return;

        const now = new Date().toISOString();
        set({
          activeTabId: id,
          tabs: tabs.map((t) =>
            t.id === id ? { ...t, lastAccessedAt: now } : t,
          ),
        });
      },

      updateTab: (id, updates) => {
        set({
          tabs: get().tabs.map((tab) =>
            tab.id === id ? { ...tab, ...updates } : tab,
          ),
        });
      },

      reorderTabs: (orderedIds) => {
        const { tabs } = get();
        const tabMap = new Map(tabs.map((tab) => [tab.id, tab]));
        const reordered = orderedIds
          .map((id) => tabMap.get(id))
          .filter((tab): tab is Tab => tab !== undefined);

        set({ tabs: reordered });
      },
    }),
    {
      name: "amazonConnect:app:v1:tabs",

      // Version for migration support
      version: 1,

      // Validate persisted data on rehydration
      merge: (persistedState, currentState) => {
        const result = TabsPersistedStateSchema.safeParse(persistedState);

        if (!result.success) {
          console.warn(
            "[TabsStore] Persisted state validation failed, using fresh state:",
            result.error.issues,
          );
          return currentState;
        }

        return {
          ...currentState,
          tabs: result.data.tabs,
          activeTabId: result.data.activeTabId,
        };
      },

      // Only persist data, not actions
      partialize: (state) => ({
        version: 1 as const,
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    },
  ),
);
