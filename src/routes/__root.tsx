import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AppNavigation } from "@/features/navigation/components/app-navigation";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <AppNavigation />
      <Outlet />
    </React.Fragment>
  );
}
