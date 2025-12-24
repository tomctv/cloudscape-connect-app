import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { GlobalTopNavigation } from "../components/global-top-navigation";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <GlobalTopNavigation />
      <Outlet />
    </React.Fragment>
  );
}
