import apiClient from "@/api/clients/api-client";
import { queryOptions } from "@tanstack/react-query";
import { CustomerContactsResponseSchema } from "../schemas/customer-contact.schema";
import { getTabSignal } from "@/features/tabs/store/tab-abort-controllers";

interface CustomerContactsParams {
  customerId: string;
  startDate?: string;
  endDate?: string;
}

export const customerContactsQueryOptions = ({
  customerId,
  startDate,
  endDate,
}: CustomerContactsParams) =>
  queryOptions({
    queryKey: ["customers", customerId, "contacts", { startDate, endDate }],
    queryFn: async () => {
      const data = await apiClient.get(`/customers/${customerId}/contacts`, {
        params: !!startDate && !!endDate ? { startDate, endDate } : undefined,
        signal: getTabSignal(customerId),
      });
      return CustomerContactsResponseSchema.parse(data);
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 20,
  });
