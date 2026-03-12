import { Tabs, type TabsProps } from "@cloudscape-design/components";
import {
  colorBackgroundLayoutMain,
  fontSizeBodyM,
  spaceStaticXxxs,
} from "@cloudscape-design/design-tokens";
import { useMemo } from "react";
import styled from "styled-components";
import { TabSearch } from "./tab-search";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { NoMatchIndicator } from "./no-match-indicator";
import { CustomerTabLink } from "./customer-tab-link";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTabsStore } from "../store";

type CustomTab = TabsProps.Tab & {
  title: string;
  pathname: string;
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

  const handleDismissTab = (tabId: string) => {
    const currentTabs = useTabsStore.getState().tabs;
    const currentActive = useTabsStore.getState().activeTabId;
    const closedIndex = currentTabs.findIndex((t) => t.id === tabId);

    closeTab(tabId);

    // If we closed the active tab, navigate to the next active or home
    if (currentActive === tabId) {
      const remaining = currentTabs.filter((t) => t.id !== tabId);
      if (remaining.length === 0) {
        navigate({ to: "/" });
      } else {
        const nextIndex = Math.min(closedIndex, remaining.length - 1);
        navigate({ to: remaining[nextIndex].route });
      }
    }
  };

  const cloudscapeTabs = useMemo<CustomTab[]>(
    () =>
      tabs.map((tab) => ({
        id: tab.id,
        title: tab.label,
        pathname: tab.route,
        dismissible: true,
        dismissLabel: `Close ${tab.label}`,
        content: null,
        onDismiss: () => handleDismissTab(tab.id),
        label:
          tab.type === "customer" ? (
            <CustomerTabLink
              customerId={tab.resourceId ?? tab.id}
              label={tab.label}
            />
          ) : (
            tab.label
          ),
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
    navigate({ to: tab.route });
  };

  // Hide tab bar when there are no tabs
  if (tabs.length === 0) {
    return null;
  }

  // Determine the visually active tab:
  // If the current URL matches a tab's route, highlight that tab.
  // Otherwise (e.g., user is on /customers/search), no tab is highlighted.
  const visualActiveTabId =
    tabs.find((tab) => location.pathname.startsWith(tab.route))?.id ?? "";

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
