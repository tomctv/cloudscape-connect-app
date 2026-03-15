import { useLocation } from "@tanstack/react-router";
import { useTabsStore } from "../store";
import { CustomerTabPanel } from "@/features/customer/components/customer-tab-panel";

/**
 * Renders all open tab panels simultaneously.
 * Inactive tabs are hidden with `display: none` for instant switching.
 * Active tab uses `display: contents` to avoid introducing an extra box in the layout.
 *
 * Each tab type is responsible for its own content rendering,
 * including Suspense boundaries and loading fallbacks.
 */
export const TabPanels: React.FC = () => {
  const tabs = useTabsStore((s) => s.tabs);
  const activeTabId = useTabsStore((s) => s.activeTabId);
  const location = useLocation();

  // A tab panel should be visible only when:
  // 1. It is the active tab AND
  // 2. The current URL matches a tab route (not a non-tab route like /customers/search)
  const isTabRoute = tabs.some((tab) =>
    location.pathname.startsWith(tab.basePath),
  );

  return (
    <>
      {tabs.map((tab) => {
        const isVisible = isTabRoute && tab.id === activeTabId;

        return (
          <div
            key={tab.id}
            style={{ display: isVisible ? "contents" : "none" }}
          >
            {tab.type === "customer" && tab.resourceId && (
              <CustomerTabPanel
                customerId={tab.resourceId}
                tabId={tab.id}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
