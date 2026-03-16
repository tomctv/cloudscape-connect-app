import { useEffect, memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTabsStore } from "@/features/tabs";
import { ApiError } from "@/api/clients/api-client";
import { customerQueryOptions } from "../api/query-options";
import { CustomerPage } from "./customer-page";
import { CustomerNotFoundPage } from "./customer-not-found-page";
import { CustomerErrorPage } from "./customer-error-page";
import { LoadingState } from "@/components/loading-state";

/**
 * Inner content for a customer tab.
 * Memoized to prevent re-renders when other tabs change.
 * Accepts only stable primitive props (not the full tab object).
 */
const CustomerTabContentInner = memo(
  ({ customerId, tabId }: { customerId: string; tabId: string }) => {
    const tabStatus = useTabsStore(
      (s) => s.tabs.find((t) => t.id === tabId)?.status,
    );

    // Check both Zustand tab status AND React Query cache synchronously.
    // The tab status alone isn't enough on first 404 navigation because
    // the useEffect that sets "not-found-error" hasn't run yet when the
    // Router remounts the component. The cache check catches this case.
    const isNotFoundTab = tabStatus === "not-found-error";
    const queryClient = useQueryClient();
    const cachedError = queryClient.getQueryState(["customers", customerId])
      ?.error;
    const isNotFoundCached =
      cachedError instanceof ApiError && cachedError.statusCode === 404;
    const isNotFound = isNotFoundTab || isNotFoundCached;

    const {
      data: customer,
      isLoading,
      error,
      refetch,
    } = useQuery({
      ...customerQueryOptions(customerId),
      enabled: !isNotFound,
    });
    const updateTab = useTabsStore((s) => s.updateTab);

    // Update tab label, icon, and status from API data
    useEffect(() => {
      if (!customer) return;

      const label = [customer.firstName, customer.lastName]
        .filter(Boolean)
        .join(" ");
      if (label)
        updateTab(tabId, {
          status: "idle",
          label,
          icon:
            customer.status === "client"
              ? "customer-client"
              : customer.status === "prospect"
                ? "customer-prospect"
                : "customer-default",
        });
    }, [tabId, customer, updateTab]);

    // Update tab status on failure (not-found vs generic error)
    useEffect(() => {
      if (!error) return;

      const isNotFound = error instanceof ApiError && error.statusCode === 404;
      const status = isNotFound ? "not-found-error" : "error";

      updateTab(
        tabId,
        isNotFound ? { status, label: "Not found" } : { status },
      );
    }, [error, tabId, updateTab]);

    // Show not-found page from tab status or cached 404 (no fetch needed)
    if (isNotFound) {
      return <CustomerNotFoundPage />;
    }

    if (isLoading) {
      return <LoadingState secondaryContent="Loading customer data" />;
    }

    if (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return <CustomerNotFoundPage />;
      }
      return <CustomerErrorPage error={error} onRetry={refetch} />;
    }

    return <CustomerPage customerId={customerId} tabId={tabId} />;
  },
);

/**
 * Tab panel for a customer tab.
 */
export const CustomerTabPanel: React.FC<{
  customerId: string;
  tabId: string;
}> = ({ customerId, tabId }) => {
  return <CustomerTabContentInner customerId={customerId} tabId={tabId} />;
};
