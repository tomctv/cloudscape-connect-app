import type React from "react";
import { useTabsStore } from "../store";
import { CustomerTabPanel } from "@/features/customer/components/customer-tab-panel";

const hiddenStyle: React.CSSProperties = {
  visibility: "hidden",
  position: "absolute",
  overflow: "hidden",
  height: 0,
  pointerEvents: "none",
};

/**
 * Renders all open tab panels simultaneously.
 *
 * Inactive tabs are hidden with `visibility: hidden` + `position: absolute`
 * instead of `display: none`. This preserves the browser's rendering state
 * (layout, paint cache) so switching tabs is instant with no flash.
 *
 * Visibility is driven entirely by Zustand (activeTabId).
 * Non-tab routes set activeTabId to null so all panels hide.
 * No dependency on TanStack Router — eliminates unnecessary re-renders on navigation.
 *
 * Each tab type is responsible for its own content rendering,
 * including Suspense boundaries and loading fallbacks.
 */
export const TabPanels: React.FC = () => {
  const tabs = useTabsStore((s) => s.tabs);
  const activeTabId = useTabsStore((s) => s.activeTabId);

  return (
    <>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={tab.id === activeTabId ? undefined : hiddenStyle}
        >
          {tab.type === "customer" && tab.resourceId && (
            <CustomerTabPanel
              customerId={tab.resourceId}
              tabId={tab.id}
            />
          )}
        </div>
      ))}
    </>
  );
};
