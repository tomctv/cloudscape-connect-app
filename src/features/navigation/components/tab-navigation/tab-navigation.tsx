import { Tabs, type TabsProps } from "@cloudscape-design/components";
import {
  fontSizeBodyM,
  spaceStaticXxxs,
} from "@cloudscape-design/design-tokens";
import { useMemo } from "react";
import styled from "styled-components";
import { TabSearch } from "./tab-search";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { NoMatchIndicator } from "./no-match-indicator";
import { CustomerTabLink } from "./customer-tab-link";
import { useLocation } from "@tanstack/react-router";

type CustomTab = TabsProps.Tab & {
  title: string;
  pathname: string;
};

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
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

export const TabNavigation: React.FC = () => {
  const location = useLocation();

  const tabs = useMemo<CustomTab[]>(
    () => [
      {
        title: "John Doe",
        pathname: "/customers/01234567",
        label: <CustomerTabLink customerId={"01234567"} label={"John Doe"} />,
        id: "01234567",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Marie White",
        pathname: "/customers/92748590",
        label: (
          <CustomerTabLink customerId={"92748590"} label={"Marie White"} />
        ),
        id: "92748590",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Nicolas Johnson",
        pathname: "/customers/27384910",
        label: (
          <CustomerTabLink customerId={"27384910"} label={"Nicolas Johnson"} />
        ),
        id: "27384910",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Brian Collins",
        pathname: "/customers/82887365",
        label: (
          <CustomerTabLink customerId={"82887365"} label={"Brian Collins"} />
        ),
        id: "82887365",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Lisa Simpson",
        pathname: "/customers/82871543",
        label: (
          <CustomerTabLink customerId={"82871543"} label={"Lisa Simpson"} />
        ),
        id: "82871543",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Jessica Fletcher",
        pathname: "/customers/82887123",
        label: (
          <CustomerTabLink customerId={"82887123"} label={"Jessica Fletcher"} />
        ),
        id: "82887123",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Rico Tubbs",
        pathname: "/customers/82871984",
        label: <CustomerTabLink customerId={"82871984"} label={"Rico Tubbs"} />,
        id: "82871984",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Marta Lynn",
        pathname: "/customers/74787121",
        label: <CustomerTabLink customerId={"74787121"} label={"Marta Lynn"} />,
        id: "74787121",
        dismissible: true,
        dismissLabel: "Dismiss tab",
        content: null,
      },
      {
        title: "Sonny Crockett",
        pathname: "/customers/80878184",
        label: (
          <CustomerTabLink customerId={"80878184"} label={"Sonny Crockett"} />
        ),
        id: "80878184",
        dismissible: true,
        dismissLabel: "Dismiss tab",
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
        onChange={() => {}}
        activeTabId={
          tabs.find((tab) => tab.pathname === location.pathname)?.id ??
          location.pathname
        }
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
