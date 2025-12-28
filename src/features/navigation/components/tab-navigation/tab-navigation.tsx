import { Icon, Tabs, type TabsProps } from "@cloudscape-design/components";
import {
  fontSizeBodyM,
  spaceScaledXs,
  spaceStaticXxxs,
} from "@cloudscape-design/design-tokens";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { TabSearch } from "./tab-search";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { NoMatchIndicator } from "./no-match-indicator";

type CustomTab = TabsProps.Tab & {
  title: string;
};

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Styled Cloudscape Tabs component to hide default tab content slot
 */
const StyledTabs = styled(Tabs)`
  [class*="awsui_tabs-header-list"] {
    min-height: 34px;
  }

  [class*="awsui_tabs-content"] {
    display: none;
  }
`;

export const TabNavigation: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined);

  const tabs = useMemo<CustomTab[]>(
    () => [
      {
        title: "John Doe",
        label: (
          <span
            style={{
              display: "flex",
              gap: spaceScaledXs,
              alignItems: "center",
            }}
          >
            <Icon name="call" />
            <span>John Doe</span>
          </span>
        ),
        id: "01234567",
        dismissible: true,
        dismissLabel: "Dismiss first tab",
        content: null,
      },
      {
        title: "Marie White",
        label: "Marie White",
        id: "92748590",
        dismissible: true,
        dismissLabel: "Dismiss second tab",
        content: null,
      },
      {
        title: "Nicolas Johnson",
        label: "Nicolas Johnson",
        id: "27384910",
        dismissible: true,
        dismissLabel: "Dismiss second tab",
        content: null,
      },
    ],
    []
  );

  const {
    query,
    setQuery,
    filteredItems: filteredTabs,
  } = useSearchFilter(tabs, ["title"]);

  return (
    <TabsContainer>
      <TabSearch query={query} setQuery={setQuery} />
      {query && filteredTabs.length === 0 && <NoMatchIndicator />}
      <StyledTabs
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        activeTabId={activeTabId}
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
