import apiClient from "@/api/clients/api-client";
import { queryOptions } from "@tanstack/react-query";
import { CustomerContactsResponseSchema } from "../schemas/customer-contact.schema";

interface CustomerContactsParams {
  customerId: string;
  startDate?: string;
  endDate?: string;
}

export const customerContactsQueryOptions = (
  { customerId, startDate, endDate }: CustomerContactsParams,
  signal?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["customers", customerId, "contacts", { startDate, endDate }],
    queryFn: async ({ signal: querySignal }) => {
      const data = await apiClient.get(`/customers/${customerId}/contacts`, {
        params: !!startDate && !!endDate ? { startDate, endDate } : undefined,
        signal: signal ?? querySignal,
      });
      return CustomerContactsResponseSchema.parse(data);
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 20,
  });
