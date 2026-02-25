import { AppLayoutToolbar, ContentLayout } from "@cloudscape-design/components";
import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerNavbar } from "./customer-navbar";
import { CustomerHeader } from "./customer-header";
import { CustomerInformationCard } from "./customer-information-card";

export const CustomerPage: React.FC = () => {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  return (
    <div>
      <CustomerNavbar
        notesOpen={activeDrawerId === "customer-notes"}
        onNotesToggle={() =>
          setActiveDrawerId((prev) =>
            prev === "customer-notes" ? null : "customer-notes",
          )
        }
      />
      <AppLayoutToolbar
        navigationHide
        toolsHide
        content={
          <ContentLayout header={<CustomerHeader />}>
            <CustomerInformationCard />
            <Outlet />
          </ContentLayout>
        }
        navigationTriggerHide
        activeDrawerId={activeDrawerId}
        onDrawerChange={({ detail }) =>
          setActiveDrawerId(detail.activeDrawerId)
        }
        drawers={[
          {
            id: "customer-notes",
            badge: true,
            content: <div>Customer notes</div>,
            defaultSize: 350,
            preserveInactiveContent: true,
            ariaLabels: {
              drawerName: "Notes",
              triggerButton: "Notes",
              closeButton: "Close notes",
              resizeHandleTooltipText: "Resize notes",
              resizeHandle: "Resize",
            },
          },
        ]}
      />
    </div>
  );
};
