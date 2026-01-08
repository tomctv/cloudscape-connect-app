import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AppNavigation } from "@/features/navigation/components/app-navigation";
import { LayoutProvider } from "@/features/layout/providers/layout-provider";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <LayoutProvider>
        <AppNavigation />
        <Outlet />
      </LayoutProvider>
    </React.Fragment>
  );
}
