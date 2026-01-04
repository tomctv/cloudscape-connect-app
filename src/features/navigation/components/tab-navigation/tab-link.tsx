import React from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import styled from "styled-components";

const StyledAnchor = styled.a`
  all: unset;
  cursor: pointer;
`;

const BasicLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => {
  return <StyledAnchor ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const TabLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
