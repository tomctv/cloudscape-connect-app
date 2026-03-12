import {
  CircleQuestionMarkIcon,
  UserCheckIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import type { Tab, TabIcon } from "../schemas/tab.schema";
import { TabLink } from "./tab-link";
import styled from "styled-components";
import { spaceScaledS, spaceScaledXxs } from "@cloudscape-design/design-tokens";
import { linkOptions } from "@tanstack/react-router";
import { Icon } from "@cloudscape-design/components";

/** Maps semantic tab icon identifiers to Cloudscape icon names. */
const TAB_ICON_MAP: Record<TabIcon, React.ReactNode> = {
  "customer-default": <UserIcon size={16} />,
  "customer-client": <UserCheckIcon size={16} />,
  "customer-prospect": <UserPlusIcon size={16} />,
  "unknown-customer": <CircleQuestionMarkIcon size={16} />,
};

interface TabContentProps {
  tab: Tab;
}

const StyledTabContent = styled.span`
  display: flex;
  align-items: center;
  gap: ${spaceScaledXxs};
  margin-right: ${spaceScaledS};
`;

export const TabContent: React.FC<TabContentProps> = ({ tab }) => {
  const getLinkOptions = () => {
    switch (tab.type) {
      case "customer":
        return linkOptions({
          to: "/customers/$customerId",
          params: { customerId: tab.id },
        });
      default:
        return linkOptions({ to: tab.route });
    }
  };

  const getTabIcon = () => {
    if (tab.status === "error") return <Icon name="status-warning" />;
    if (tab.icon) return TAB_ICON_MAP[tab.icon];

    return null;
  };

  return (
    <TabLink {...getLinkOptions()}>
      <StyledTabContent>
        {getTabIcon()}
        <span>{tab.label}</span>
      </StyledTabContent>
    </TabLink>
  );
};
