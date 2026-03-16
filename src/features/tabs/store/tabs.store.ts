import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Tab,
  type TabIcon,
  type TabStatus,
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
    basePath: string;
    icon?: TabIcon;
    isPinned?: boolean;
    closable?: boolean;
    status?: TabStatus;
  }) => string;

  /** Close a tab by ID. If the closed tab was active, activates an adjacent tab. */
  closeTab: (id: string) => void;

  /** Close all tabs. */
  closeAllTabs: () => void;

  /** Close all tabs except the one with the given ID. */
  closeOtherTabs: (id: string) => void;

  /** Set the active tab by ID (or null to deselect all tabs). */
  setActiveTabId: (id: string | null) => void;

  /** Update a tab's mutable properties. basePath is intentionally excluded (immutable). */
  updateTab: (
    id: string,
    updates: Partial<
      Pick<
        Tab,
        "label" | "activePath" | "icon" | "status" | "isPinned" | "closable"
      >
    >,
  ) => void;

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

      openTab: ({
        id,
        type,
        resourceId,
        label,
        basePath,
        icon,
        isPinned,
        closable,
        status
      }) => {
        const { tabs } = get();
        const now = Date.now();
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
          basePath,
          activePath: basePath,
          icon,
          isPinned,
          closable,
          lastAccessedAt: now,
          createdAt: now,
          status: status ?? "idle",
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
        const { tabs, activeTabId } = get();

        // Auto-close error tabs when navigating away from them.
        // This avoids persisting tabs for non-existent resources in localStorage.
        let nextTabs = tabs;
        if (activeTabId && activeTabId !== id) {
          const prevTab = tabs.find((t) => t.id === activeTabId);
          if (prevTab?.status === "not-found-error") {
            nextTabs = tabs.filter((t) => t.id !== activeTabId);
          }
        }

        if (id === null) {
          set({ activeTabId: null, tabs: nextTabs });
          return;
        }

        const tab = nextTabs.find((t) => t.id === id);
        if (!tab) return;

        const now = Date.now();
        set({
          activeTabId: id,
          tabs: nextTabs.map((t) =>
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
        tabs: state.tabs.filter((t) => t.status !== "not-found-error"),
        activeTabId: state.activeTabId,
      }),
    },
  ),
);
