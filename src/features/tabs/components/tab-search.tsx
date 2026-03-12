import { Box, Button, Input } from "@cloudscape-design/components";
import {
  colorBorderDividerDefault,
  colorBorderDividerSecondary,
  spaceScaledXs,
} from "@cloudscape-design/design-tokens";
import { useRef, useState } from "react";
import styled from "styled-components";

interface TabSearchProps {
  query: string;
  setQuery: (value: string) => void;
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

export const TabSearch: React.FC<TabSearchProps> = ({ query, setQuery }) => {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleActivate = () => {
    setActive(true);
  };

  const handleBlurCapture = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const relatedTarget = event.relatedTarget;

    if (containerRef.current && !containerRef.current.contains(relatedTarget)) {
      setActive(false);
      setQuery("");
    }
  };

  const handleKeyDown = (event: CustomEvent<{ key: string }>) => {
    if (event.detail.key === "Escape") {
      setActive(false);
      setQuery("");
    }
  };

  return (
    <TabSearchContainer ref={containerRef}>
      {!active && (
        <StyledBox padding={{ horizontal: "xxs" }}>
          <Button
            variant="icon"
            iconName="search"
            ariaLabel="Tab search"
            onClick={handleActivate}
          />
        </StyledBox>
      )}
      {active && (
        <Input
          onChange={({ detail }) => setQuery(detail.value)}
          value={query}
          placeholder="Search tabs"
          type="search"
          style={{
            root: {
              borderColor: {
                default: "transparent",
              },
            },
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          nativeInputAttributes={{
            onBlurCapture: handleBlurCapture,
          }}
        />
      )}
    </TabSearchContainer>
  );
};
