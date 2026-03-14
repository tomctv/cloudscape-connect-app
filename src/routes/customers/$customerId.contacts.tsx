import { CustomerContactHistoryPage } from "@/features/customer-contact-history/components/customer-contact-history-page";
import { customerContactsQueryOptions } from "@/features/customer-contact-history/api/query-options";
import { CustomerContactHistoryParamsSchema } from "@/features/customer-contact-history/schemas/customer-contact-history-params.schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/$customerId/contacts")({
  validateSearch: CustomerContactHistoryParamsSchema,
  loaderDeps: ({ search: { startDate, endDate } }) => ({ startDate, endDate }),
  loader: ({
    params: { customerId },
    deps: { startDate, endDate },
    context: { queryClient },
    abortController,
  }) => {
    queryClient.prefetchQuery({
      ...customerContactsQueryOptions(
        { customerId, startDate, endDate },
        abortController.signal,
      ),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerContactHistoryPage />;
}
