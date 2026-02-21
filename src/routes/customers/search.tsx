import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomerSearchParamsSchema } from "@/features/customer-search/schemas/customer-search-params.schema";
import { CustomerSearchPage } from "@/features/customer-search/components/customer-search-page";
import { LoadingFallback } from "@/components/loading-fallback";

export const Route = createFileRoute("/customers/search")({
  validateSearch: CustomerSearchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CustomerSearchPage />
    </Suspense>
  );
}
