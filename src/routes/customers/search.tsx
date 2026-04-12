import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomerSearchParamsSchema } from "@/features/customer-search/schemas/customer-search-params.schema";
import { CustomerSearchPage } from "@/features/customer-search/components/customer-search-page";
import { LoadingState } from "@/components/loading-state";
import { useTabsStore } from "@/features/tabs";

export const Route = createFileRoute("/customers/search")({
  validateSearch: CustomerSearchParamsSchema,
  beforeLoad: () => {
    useTabsStore.getState().setActiveTabId(null);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CustomerSearchPage />
    </Suspense>
  );
}
