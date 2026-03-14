import { Box } from "@cloudscape-design/components";
import {
  colorBorderDividerDefault,
  spaceScaledXs,
} from "@cloudscape-design/design-tokens";
import styled from "styled-components";

const StyledIndicator = styled(Box)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-left: ${spaceScaledXs};
  border-top: 1px solid transparent;
  border-bottom: 1px solid ${colorBorderDividerDefault};
  padding: 6px ${spaceScaledXs};
`;

export const NoMatchIndicator: React.FC = () => {
  return <StyledIndicator>No matches</StyledIndicator>;
};
