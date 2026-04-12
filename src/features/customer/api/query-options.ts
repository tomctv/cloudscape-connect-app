import apiClient, { ApiError } from "@/api/clients/api-client";
import { queryOptions } from "@tanstack/react-query";
import { CustomerSchema } from "../schemas/customer.schema";
import { getTabSignal } from "@/features/tabs/store/tab-abort-controllers";

export const customerQueryOptions = (customerId: string) =>
  queryOptions({
    queryKey: ["customers", customerId],
    queryFn: async () => {
      const data = await apiClient.get(`/customers/${customerId}`, {
        signal: getTabSignal(customerId),
      });
      return CustomerSchema.parse(data);
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.statusCode === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
