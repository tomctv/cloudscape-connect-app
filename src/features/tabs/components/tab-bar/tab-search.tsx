import { Button, Input } from "@cloudscape-design/components";
import {
  colorBorderDividerDefault,
  spaceScaledXs,
  colorTextBodyDefault,
  spaceScaledXxs,
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
`;

const ToggleContainer = styled.div`
  position: relative;
  border-left: 1px solid transparent;
  padding: 0 ${spaceScaledXxs};

  &::after {
    content: "";
    position: absolute;
    z-index: 2;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: ${colorBorderDividerDefault};
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-left: -1px;

  &::after {
    content: "";
    position: absolute;
    z-index: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: ${colorBorderDividerDefault};
  }

  [class*="awsui_input"] {
    border-color: transparent !important;
    outline-color: transparent !important;
    box-shadow: none !important;

    input {
      border-color: transparent !important;
      outline-color: transparent !important;
    }
  }
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
        <ToggleContainer>
          <Button
            variant="icon"
            iconName="search"
            ariaLabel="Tab search"
            onClick={() => onToggle(true)}
          />
        </ToggleContainer>
      )}
      {active && (
        <InputContainer>
          <Input
            name="tab-name"
            onChange={({ detail }) => onChange(detail.value)}
            value={query}
            placeholder="Search tabs"
            type="search"
            style={{
              root: {
                borderColor: {
                  default: "transparent",
                  focus: "transparent",
                  hover: "transparent",
                },
                color: {
                  hover: colorTextBodyDefault,
                },
              },
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </InputContainer>
      )}
    </TabSearchContainer>
  );
};
