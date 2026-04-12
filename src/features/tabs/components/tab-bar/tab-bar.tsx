import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { DragDropProvider } from "@dnd-kit/react";
import type { DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/dom/sortable";
import { useTabsStore } from "../../store";
import { abortTab } from "../../store/tab-abort-controllers";
import { TabItem } from "./tab-item";
import { Icon } from "@cloudscape-design/components";
import {
  TabBarWrapper,
  ScrollArea,
  ScrollNavLeft,
  ScrollNavRight,
  TabsList,
  NoMatchItem,
} from "./tab-bar-styles";
import { useTabScroll } from "../../hooks/use-tab-scroll";
import { TabSearch } from "../tab-search";
import type React from "react";

/**
 * Walks up the DOM from the event target to find the closest element
 * with a `data-tab-id` attribute, stopping at the container boundary.
 */
function findTabId(
  target: EventTarget | null,
  container: HTMLElement,
): string | null {
  let el = target as HTMLElement | null;
  while (el && el !== container) {
    if (el.dataset.tabId) return el.dataset.tabId;
    el = el.parentElement;
  }
  return null;
}

export const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = useTabsStore((state) => state.tabs);
  const activeTabId = useTabsStore((state) => state.activeTabId);
  const setActiveTabId = useTabsStore((state) => state.setActiveTabId);
  const closeTab = useTabsStore((state) => state.closeTab);
  const reorderTabs = useTabsStore((state) => state.reorderTabs);
  const updateTab = useTabsStore((state) => state.updateTab);

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const visibleTabs = searchQuery
    ? tabs.filter((t) =>
        t.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tabs;

  const { scrollRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useTabScroll(visibleTabs, activeTabId);

  // Sync activePath: when the user navigates within a tab's scope,
  // update that tab's activePath so clicking the tab later restores the sub-route.
  // Only updates the ACTIVE tab to avoid overwriting persisted activePaths of
  // inactive tabs (whose state comes from localStorage, not the browser URL).
  useEffect(() => {
    if (!activeTabId) return;

    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    // Only sync if the current URL belongs to the active tab
    if (!location.pathname.startsWith(activeTab.basePath)) return;

    const maskedLocation = (location as unknown as Record<string, unknown>)
      .maskedLocation as typeof location | undefined;
    const effectiveHref = maskedLocation?.href ?? location.href;

    if (activeTab.activePath !== effectiveHref) {
      updateTab(activeTab.id, { activePath: effectiveHref });
    }
  }, [location, activeTabId, tabs, updateTab]);

  const resetTabSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
  };

  // Reset search when focus leaves the entire tab bar (e.g. user clicks in the page).
  // relatedTarget is the element receiving focus: if it's still inside TabBarWrapper,
  // the user is interacting within the bar (clicking a tab, scroll button, etc.) and
  // we leave the search open. StyledListItem has tabIndex={-1} to ensure tab clicks
  // produce a non-null relatedTarget pointing inside the bar.
  const handleTabBarBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resetTabSearch();
    }
  };

  // Persist the new tab order after a drag operation
  const handleDragEnd = useCallback(
    (event: Parameters<DragEndEvent>[0]) => {
      const { source } = event.operation;
      if (!source || !isSortable(source)) return;
      if (source.sortable.initialIndex === source.sortable.index) return;

      const ids = tabs.map((t) => t.id);
      const [moved] = ids.splice(source.sortable.initialIndex, 1);
      ids.splice(source.sortable.index, 0, moved);
      reorderTabs(ids);
    },
    [tabs, reorderTabs],
  );

  // A tab is visually active only when the current URL matches a tab route
  const visuallyActiveTabId = tabs.some((tab) =>
    location.pathname.startsWith(tab.basePath),
  )
    ? activeTabId
    : null;

  const handleClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target as HTMLElement;
    const container = event.currentTarget;

    // Check if a close button was clicked
    const closeButton = target.closest<HTMLElement>("[data-action='close']");
    if (closeButton) {
      const tabId = closeButton.dataset.tabId;
      if (!tabId) return;

      const closedTab = tabs.find((t) => t.id === tabId);

      // Abort all in-flight HTTP requests for this tab's resource.
      // Uses a per-tab AbortController (not React Query's internal signal)
      // so requests are only canceled on explicit tab close, never on React remounts.
      if (closedTab?.resourceId) {
        abortTab(closedTab.resourceId);
      }

      closeTab(tabId);

      // Redirect only if the user is currently viewing the closed tab
      if (closedTab && location.pathname.startsWith(closedTab.basePath)) {
        const remainingTabs = tabs.filter((t) => t.id !== tabId);
        if (remainingTabs.length > 0) {
          const nextTab = remainingTabs[remainingTabs.length - 1];
          void navigate({ to: nextTab.activePath });
        } else {
          void navigate({ to: "/" });
        }
      }
      return;
    }

    // Otherwise, a tab item was clicked — activate it
    const tabId = findTabId(target, container);
    if (!tabId) return;

    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;

    // Update store + navigate to the tab's active path.
    setActiveTabId(tabId);
    void navigate({ to: tab.activePath });

    // Reset tab search state to hide search input
    resetTabSearch();
  };

  if (tabs.length === 0) return null;

  return (
    <TabBarWrapper onBlur={handleTabBarBlur}>
      <TabSearch
        active={searchActive}
        onToggle={(value) => setSearchActive(value)}
        query={searchQuery}
        onChange={setSearchQuery}
      />
      {visibleTabs.length === 0 ? (
        <NoMatchItem>No matches</NoMatchItem>
      ) : (
        <>
          {(canScrollLeft || canScrollRight) && (
            <ScrollNavLeft
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Scroll tabs left"
            >
              <Icon name="angle-left" />
            </ScrollNavLeft>
          )}
          <ScrollArea ref={scrollRef}>
            <DragDropProvider onDragEnd={handleDragEnd}>
              <TabsList onClickCapture={handleClick}>
                <li />
                {visibleTabs.map((tab, index) => (
                  <TabItem
                    key={tab.id}
                    tab={tab}
                    index={index}
                    isActive={tab.id === visuallyActiveTabId}
                  />
                ))}
                <li />
              </TabsList>
            </DragDropProvider>
          </ScrollArea>
          {(canScrollLeft || canScrollRight) && (
            <ScrollNavRight
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Scroll tabs right"
            >
              <Icon name="angle-right" />
            </ScrollNavRight>
          )}
        </>
      )}
    </TabBarWrapper>
  );
};
