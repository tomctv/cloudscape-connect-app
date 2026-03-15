import { Suspense, useEffect, memo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTabsStore } from "@/features/tabs";
import { customerQueryOptions } from "../api/query-options";
import { CustomerPage } from "./customer-page";
import { LoadingState } from "@/components/loading-state";

/**
 * Inner content for a customer tab.
 * Memoized to prevent re-renders when other tabs change.
 * Accepts only stable primitive props (not the full tab object).
 */
const CustomerTabContentInner = memo(
  ({ customerId, tabId }: { customerId: string; tabId: string }) => {
    const { data: customer } = useSuspenseQuery(
      customerQueryOptions(customerId),
    );
    const updateTab = useTabsStore((s) => s.updateTab);

    // Update tab label and icon from API data
    useEffect(() => {
      const label = [customer?.firstName, customer?.lastName]
        .filter(Boolean)
        .join(" ");
      if (label)
        updateTab(tabId, {
          label,
          icon:
            customer.status === "client"
              ? "customer-client"
              : customer.status === "prospect"
                ? "customer-prospect"
                : "customer-default",
        });
    }, [tabId, customer, updateTab]);

    return <CustomerPage customerId={customerId} />;
  },
);

/**
 * Tab panel for a customer tab.
 * Owns its own Suspense boundary and loading fallback.
 */
export const CustomerTabPanel: React.FC<{
  customerId: string;
  tabId: string;
}> = ({ customerId, tabId }) => {
  return (
    <Suspense
      fallback={<LoadingState secondaryContent="Loading customer data" />}
    >
      <CustomerTabContentInner customerId={customerId} tabId={tabId} />
    </Suspense>
  );
};
