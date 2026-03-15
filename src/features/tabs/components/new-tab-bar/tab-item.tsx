import { Box, Icon, Spinner } from "@cloudscape-design/components";
import {
  colorBackgroundSegmentDefault,
  colorBorderDividerDefault,
  colorTextInteractiveDefault,
  colorTextInteractiveHover,
  fontFamilyBase,
  fontSizeBodyM,
} from "@cloudscape-design/design-tokens";
import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToHorizontalAxis } from "@dnd-kit/abstract/modifiers";
import {
  CircleQuestionMarkIcon,
  UserCheckIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import styled from "styled-components";
import type { Tab, TabIcon } from "../../schemas/tab.schema";

interface TabItemProps {
  tab: Tab;
  index: number;
  isActive: boolean;
}

/** Maps semantic tab icon identifiers to Lucide React icons. */
const TAB_ICON_MAP: Record<TabIcon, React.ReactNode> = {
  "customer-default": <UserIcon size={16} />,
  "customer-client": <UserCheckIcon size={16} />,
  "customer-prospect": <UserPlusIcon size={16} />,
  "unknown-customer": <CircleQuestionMarkIcon size={16} />,
};

const StyledListItem = styled.li<{ $isActive: boolean }>`
  border-radius: 6px 6px 0px 0px;
  transition: 0.2s ease border-color;

  ${(props) => {
    if (props.$isActive) {
      return `
        border-top: 1px solid ${colorBorderDividerDefault};
        border-left: 1px solid ${colorBorderDividerDefault};
        border-right: 1px solid ${colorBorderDividerDefault};
        border-bottom: 1px solid ${colorBackgroundSegmentDefault};
      `;
    }
    return `
      border-top: 1px solid ${colorBackgroundSegmentDefault};
      border-left: 1px solid ${colorBackgroundSegmentDefault};
      border-right: 1px solid ${colorBackgroundSegmentDefault};
      border-bottom: 1px solid ${colorBorderDividerDefault};

      &:hover {
        border-top-color: ${colorBorderDividerDefault};
        border-left-color: ${colorBorderDividerDefault};
        border-right-color: ${colorBorderDividerDefault};
      }
    `;
  }}
`;

const TabItemContent = styled.div`
  font-family: ${fontFamilyBase};
  font-size: ${fontSizeBodyM};
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px 6px 0px 0px;
  background-color: ${colorBackgroundSegmentDefault};
`;

const TabLabel = styled.span`
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
`;

const CloseButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  cursor: pointer;
  color: ${colorTextInteractiveDefault};
  border-radius: 4px;

  &:hover {
    color: ${colorTextInteractiveHover};
  }

  &:focus-visible {
    outline: 2px solid ${colorTextInteractiveDefault};
    outline-offset: 1px;
  }
`;

export const TabItem: React.FC<TabItemProps> = ({ tab, index, isActive }) => {
  const { ref } = useSortable({
    id: tab.id,
    index,
    modifiers: [RestrictToHorizontalAxis],
  });

  const getTabIcon = () => {
    if (tab.status === "loading") return <Spinner size="normal" />;
    if (tab.status === "error") return <Icon name="status-warning" />;
    if (tab.icon) return <Icon svg={TAB_ICON_MAP[tab.icon]} />;

    return null;
  };

  return (
    <StyledListItem
      ref={ref}
      data-tab-id={tab.id}
      aria-label={tab.label}
      title={tab.label}
      $isActive={isActive}
    >
      <TabItemContent>
        <Box color={isActive ? "text-status-info" : "text-status-inactive"}>
          {getTabIcon()}
        </Box>
        <TabLabel>
          <Box
            variant="span"
            fontWeight="heavy"
            color={isActive ? "text-status-info" : "text-status-inactive"}
          >
            {tab.label}
          </Box>
        </TabLabel>
        {tab.closable !== false && (
          <CloseButton
            data-action="close"
            data-tab-id={tab.id}
            aria-label={`Close ${tab.label}`}
          >
            <Icon name="close" />
          </CloseButton>
        )}
      </TabItemContent>
    </StyledListItem>
  );
};
