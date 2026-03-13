import { Tabs, type TabsProps } from "@cloudscape-design/components";
import {
  colorBackgroundLayoutMain,
  fontSizeBodyM,
  spaceStaticXxxs,
} from "@cloudscape-design/design-tokens";
import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { TabSearch } from "./tab-search";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { NoMatchIndicator } from "./no-match-indicator";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTabsStore } from "../store";
import { TabContent } from "./tab-content";

type CustomTab = TabsProps.Tab & {
  title: string;
};

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colorBackgroundLayoutMain};
`;

/**
 * Styled Cloudscape Tabs component to hide default tab content slot and control padding/margin.
 */
const StyledTabs = styled(Tabs)`
  [class*="awsui_tabs-header-list"] {
    min-height: 34px;
  }

  [class*="awsui_tabs-content"] {
    display: none;
  }

  [class*="awsui_tabs-tab-label"] {
    padding: 0 !important;
  }

  [class*="awsui_tabs-tab-link"] {
    padding: 0 !important;
    border: none !important;
  }

  [class*="awsui_pagination-button"] {
    margin: 0 !important;
  }
`;

export const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = useTabsStore((state) => state.tabs);
  const setActiveTabId = useTabsStore((state) => state.setActiveTabId);
  const closeTab = useTabsStore((state) => state.closeTab);
  const updateTab = useTabsStore((state) => state.updateTab);

  // Sync activePath: when the user navigates within a tab's scope,
  // update that tab's activePath so clicking the tab later restores the sub-route.
  useEffect(() => {
    const matchingTab = tabs.find((tab) =>
      location.pathname.startsWith(tab.basePath),
    );
    if (matchingTab && matchingTab.activePath !== location.pathname) {
      updateTab(matchingTab.id, { activePath: location.pathname });
    }
  }, [location.pathname, tabs, updateTab]);

  const handleDismissTab = (tabId: string) => {
    const currentTabs = useTabsStore.getState().tabs;
    const closedIndex = currentTabs.findIndex((t) => t.id === tabId);
    const closedTab = currentTabs[closedIndex];

    closeTab(tabId);

    // Only redirect if the current route belongs to the closed tab
    if (closedTab && location.pathname.startsWith(closedTab.basePath)) {
      const remaining = currentTabs.filter((t) => t.id !== tabId);
      if (remaining.length === 0) {
        navigate({ to: "/" });
      } else {
        const nextIndex = Math.min(closedIndex, remaining.length - 1);
        navigate({ to: remaining[nextIndex].activePath });
      }
    }
  };

  const cloudscapeTabs = useMemo<CustomTab[]>(
    () =>
      tabs.map((tab) => ({
        id: tab.id,
        dismissible: tab.closable !== false,
        dismissLabel: `Close ${tab.label}`,
        content: null,
        onDismiss: () => handleDismissTab(tab.id),
        label: <TabContent tab={tab} />,
        title: tab.label,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabs],
  );

  const {
    query,
    setQuery,
    filteredItems: filteredTabs,
  } = useSearchFilter(cloudscapeTabs, ["title"]);

  const handleTabChange: TabsProps["onChange"] = (event) => {
    const tabId = event.detail.activeTabId;
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;

    setActiveTabId(tabId);
  };

  // Hide tab bar when there are no tabs
  if (tabs.length === 0) {
    return null;
  }

  // Determine the visually active tab:
  // If the current URL falls within a tab's basePath, highlight that tab.
  // Otherwise (e.g., user is on /customers/search), no tab is highlighted.
  const visualActiveTabId =
    tabs.find((tab) => location.pathname.startsWith(tab.basePath))?.id ?? "";

  return (
    <TabsContainer>
      <TabSearch query={query} setQuery={setQuery} />
      {query && filteredTabs.length === 0 && <NoMatchIndicator />}
      <StyledTabs
        onChange={handleTabChange}
        activeTabId={visualActiveTabId}
        style={{
          tab: {
            activeIndicator: {
              width: spaceStaticXxxs,
            },
            fontSize: fontSizeBodyM,
            paddingBlock: "0px",
            paddingInline: "0px",
          },
        }}
        tabs={filteredTabs}
      />
    </TabsContainer>
  );
};
