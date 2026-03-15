import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AppNavigation } from "@/features/navigation/components/app-navigation";
import { LayoutProvider } from "@/features/layout/providers/layout-provider";
import { TabPanels } from "@/features/tabs/components/tab-panels";
import type { QueryClient } from "@tanstack/react-query";
import { AppLayoutToolbar, ContentLayout } from "@cloudscape-design/components";

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
        <AppLayoutToolbar
          navigationHide
          toolsHide
          navigationTriggerHide
          disableContentPaddings
          content={
            <ContentLayout>
              <TabPanels />
              <Outlet />
            </ContentLayout>
          }
        />
      </LayoutProvider>
    </React.Fragment>
  );
}
