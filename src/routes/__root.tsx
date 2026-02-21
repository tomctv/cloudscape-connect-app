import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AppNavigation } from "@/features/navigation/components/app-navigation";
import { LayoutProvider } from "@/features/layout/providers/layout-provider";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
