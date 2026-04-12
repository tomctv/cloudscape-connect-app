import styled from "styled-components";
import {
  colorBackgroundContainerContent,
  colorBorderDividerDefault,
  colorTextBodySecondary,
  colorTextInteractiveDefault,
  colorTextInteractiveHover,
  fontFamilyBase,
  fontSizeBodyM,
  spaceScaledS,
} from "@cloudscape-design/design-tokens";

export const TabBarWrapper = styled.div`
  display: flex;
  background-color: ${colorBackgroundContainerContent};
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const scrollNavBase = `
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  flex-shrink: 0;
  cursor: pointer;
  border-bottom: 1px solid ${colorBorderDividerDefault};
  z-index: 1;
  background-color: ${colorBackgroundContainerContent};
  color: ${colorTextInteractiveDefault};

  &:hover:not(:disabled) {
    color: ${colorTextInteractiveHover};
  }

  &:disabled {
    cursor: default;
    /* Fade only the icon, not the border-bottom */
    & > * {
      opacity: 0.3;
    }
  }
`;

export const ScrollNavLeft = styled.button`
  ${scrollNavBase}
  border-right: 1px solid ${colorBorderDividerDefault};
  &:not(:disabled) {
    box-shadow: 4px 0 8px rgba(0, 0, 0, 0.12);
  }
`;

export const ScrollNavRight = styled.button`
  ${scrollNavBase}
  border-left: 1px solid ${colorBorderDividerDefault};
  &:not(:disabled) {
    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.12);
  }
`;

/**
 * Shown as a direct child of TabBarWrapper (flex row) when no tabs match the
 * search query. Being a direct flex child with align-items: stretch (default),
 * it fills the full height of the bar so its border-bottom aligns exactly with
 * TabSearch's border-bottom.
 */
export const NoMatchItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-top: 1px solid transparent;
  border-bottom: 1px solid ${colorBorderDividerDefault};
  padding: 10px ${spaceScaledS};
  font-family: ${fontFamilyBase};
  font-size: ${fontSizeBodyM};
  color: ${colorTextBodySecondary};
  line-height: 16px;
`;

export const TabsList = styled.ul`
  background-color: ${colorBackgroundContainerContent};
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: end;
  padding-top: 4px;
  min-width: 100%;

  li:first-child {
    padding-left: 6px;
    border-bottom: 1px solid ${colorBorderDividerDefault};
  }

  li:last-child {
    border-bottom: 1px solid ${colorBorderDividerDefault};
    padding-left: 12px;
    flex-grow: 1;
  }
`;
