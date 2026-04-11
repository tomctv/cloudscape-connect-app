import { Box, Button, Input } from "@cloudscape-design/components";
import {
  colorBorderDividerDefault,
  colorBorderDividerSecondary,
  spaceScaledXs,
  colorTextBodyDefault,
} from "@cloudscape-design/design-tokens";
import styled from "styled-components";

interface TabSearchProps {
  active: boolean;
  onToggle: (value: boolean) => void;
  query: string;
  onChange: (value: string) => void;
}

const TabSearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spaceScaledXs};
  border-bottom: 1px solid ${colorBorderDividerDefault};
  padding: 1px 0;
`;

const StyledBox = styled(Box)`
  border-left: 1px solid transparent;
  border-right: 1px solid ${colorBorderDividerSecondary};
`;

export const TabSearch: React.FC<TabSearchProps> = ({
  active,
  onToggle,
  query,
  onChange,
}) => {
  const handleKeyDown = (event: CustomEvent<{ key: string }>) => {
    if (event.detail.key === "Escape") {
      onToggle(false);
      onChange("");
    }
  };

  return (
    <TabSearchContainer>
      {!active && (
        <StyledBox padding={{ horizontal: "xxs" }}>
          <Button
            variant="icon"
            iconName="search"
            ariaLabel="Tab search"
            onClick={() => onToggle(true)}
          />
        </StyledBox>
      )}
      {active && (
        <div style={{ paddingRight: "4px" }}>
          <Input
            onChange={({ detail }) => onChange(detail.value)}
            value={query}
            placeholder="Search tabs"
            type="search"
            style={{
              root: {
                borderColor: {
                  default: "transparent",
                },
                color: {
                  hover: colorTextBodyDefault,
                },
              },
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      )}
    </TabSearchContainer>
  );
};
