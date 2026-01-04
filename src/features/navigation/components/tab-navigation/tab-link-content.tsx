import { Icon, type IconProps } from "@cloudscape-design/components";
import { spaceScaledS, spaceScaledXxs } from "@cloudscape-design/design-tokens";
import styled from "styled-components";

interface TabLinkContentProps {
  label: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
}

const StyledLinkContent = styled.span`
  display: flex;
  align-items: center;
  gap: ${spaceScaledXxs};
  margin-right: ${spaceScaledS};
`;

export const TabLinkContent: React.FC<TabLinkContentProps> = ({
  label,
  iconName,
  iconSvg,
}) => {
  const hasIcon = !!iconName || !!iconSvg;

  return (
    <StyledLinkContent>
      {hasIcon && <Icon name={iconName} svg={iconSvg} />}
      <span>{label}</span>
    </StyledLinkContent>
  );
};
