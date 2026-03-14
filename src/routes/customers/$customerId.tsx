import { ApiError } from "@/api/clients/api-client";
import { LoadingState } from "@/components/loading-state";
import { customerQueryOptions } from "@/features/customer/api/query-options";
import { CustomerErrorPage } from "@/features/customer/components/customer-error-page";
import { CustomerNotFoundPage } from "@/features/customer/components/customer-not-found-page";
import { CustomerPage } from "@/features/customer/components/customer-page";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTabsStore } from "@/features/tabs";
import { z } from "zod/v4";
import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

const customerIdSchema = z
  .string()
  .length(8)
  .regex(/^\d{8}$/, "customerId must be a 8-digit string");

export const Route = createFileRoute("/customers/$customerId")({
  validateSearch: z.object({
    customerName: z.string().optional(),
  }),
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
  onEnter: (match) => {
    const customerId = match.params.customerId;
    const label = match.search.customerName ?? customerId;

    useTabsStore.getState().openTab({
      id: customerId,
      type: "customer",
      resourceId: customerId,
      label,
      basePath: match.pathname,
      icon: "customer-default",
    });
  },
  component: RouteComponent,
  pendingComponent: () => (
    <LoadingState secondaryContent={"Loading customer data"} />
  ),
  notFoundComponent: CustomerNotFoundPage,
  errorComponent: CustomerErrorPage,
});

function RouteComponent() {
  const { customerId } = Route.useParams();
  const { data: customer } = useSuspenseQuery(customerQueryOptions(customerId));
  const updateTab = useTabsStore((s) => s.updateTab);

  useEffect(() => {
    const label = [customer?.firstName, customer?.lastName]
      .filter(Boolean)
      .join(" ");
    if (label)
      updateTab(customerId, {
        label,
        icon:
          customer.status === "client"
            ? "customer-client"
            : customer.status === "prospect"
              ? "customer-prospect"
              : "customer-default",
      });
  }, [customerId, customer, updateTab]);

  return <CustomerPage />;
}
