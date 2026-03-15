import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTabsStore } from "../../store";
import { TabItem } from "./tab-item";
import styled from "styled-components";
import {
  colorBackgroundContainerContent,
  colorBorderDividerDefault,
} from "@cloudscape-design/design-tokens";
import type React from "react";

const TabsList = styled.ul`
  background-color: ${colorBackgroundContainerContent};
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: end;
  padding-top: 4px;

  li:last-child {
    border-bottom: 1px solid ${colorBorderDividerDefault};
    flex-grow: 1;
  }
`;

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

export const NewTabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = useTabsStore((state) => state.tabs);
  const activeTabId = useTabsStore((state) => state.activeTabId);
  const setActiveTabId = useTabsStore((state) => state.setActiveTabId);
  const closeTab = useTabsStore((state) => state.closeTab);

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

    // Instant switch: update store (sync) + URL (sync), bypass TanStack Router pipeline
    setActiveTabId(tabId);
    window.history.pushState(null, "", tab.activePath);
  };

  if (tabs.length === 0) return null;

  return (
    <TabsList onClickCapture={handleClick}>
      {tabs.map((tab, index) => (
        <TabItem
          key={tab.id}
          tab={tab}
          index={index}
          isActive={tab.id === visuallyActiveTabId}
        />
      ))}
      <li />
    </TabsList>
  );
};
