import { ApiError } from "@/api/clients/api-client";
import { LoadingFallback } from "@/components/loading-fallback";
import { customerQueryOptions } from "@/features/customer/api/query-options";
import { CustomerNotFoundPage } from "@/features/customer/components/customer-not-found-page";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod/v4";

const customerIdSchema = z
  .string()
  .length(8)
  .regex(/^\d{8}$/, "customerId must be a 8-digit string");

export const Route = createFileRoute("/customers/$customerId")({
  beforeLoad: ({ params }) => {
    const result = customerIdSchema.safeParse(params.customerId);

    if (!result.success) throw notFound();
  },
  loader: async ({
    params: { customerId },
    context: { queryClient },
    abortController,
  }) => {
    try {
      await queryClient.ensureQueryData({
        ...customerQueryOptions(customerId, abortController.signal),
      });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        throw notFound();
      }
      throw error;
    }
  },
  component: RouteComponent,
  pendingComponent: () => (
    <LoadingFallback secondaryContent={"Loading customer data"} />
  ),
  notFoundComponent: () => <CustomerNotFoundPage />,
});

function RouteComponent() {
  const { customerId } = Route.useParams();
  const { data: customer } = useSuspenseQuery(customerQueryOptions(customerId));

  return (
    <div>
      Customer page for customer: {customer.firstName} {customer.lastName}
    </div>
  );
}
