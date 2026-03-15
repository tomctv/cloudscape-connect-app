import { ApiError } from "@/api/clients/api-client";
import { customerQueryOptions } from "@/features/customer/api/query-options";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTabsStore } from "@/features/tabs";
import { z } from "zod/v4";

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
  // Tab content is rendered by TabPanels (always mounted, hidden with CSS).
  // This route exists for URL matching, onEnter (tab creation), and loader (data prefetch).
  component: () => null,
});
