import React from "react";
import { createLink, Link, type LinkComponent } from "@tanstack/react-router";
import styled from "styled-components";
import {
  colorTextLinkDefault,
  colorTextLinkHover,
  fontWeightButton,
  spaceScaledXxs,
} from "@cloudscape-design/design-tokens";
import { Icon } from "@cloudscape-design/components";

const StyledAnchor = styled(Link)`
  all: unset;
  cursor: pointer;
  font-weight: ${fontWeightButton};
  color: ${colorTextLinkDefault};

  &:hover {
    color: ${colorTextLinkHover};
  }
`;

const StyledLinkContent = styled.span`
  display: flex;
  align-items: center;
  gap: ${spaceScaledXxs};
`;

const BasicLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => {
  return <StyledAnchor ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(BasicLinkComponent);

const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"viewport"} {...props} />;
};

interface CustomerDetailsLinkProps {
  customerId: string;
}

export const CustomerDetailsLink: React.FC<CustomerDetailsLinkProps> = ({
  customerId,
}) => {
  return (
    <CustomLink
      to="/customers/$customerId"
      params={{ customerId }}
      aria-label="Open customer page"
    >
      <StyledLinkContent>
        <span>Open</span>
        <Icon name={"external"} />
      </StyledLinkContent>
    </CustomLink>
  );
};
