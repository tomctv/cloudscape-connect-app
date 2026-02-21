import apiClient, { ApiError } from "@/api/clients/api-client";
import { queryOptions } from "@tanstack/react-query";
import { CustomerSchema } from "../schemas/customer.schema";

export const customerQueryOptions = (customerId: string, signal?: AbortSignal) =>
  queryOptions({
    queryKey: ["customers", customerId],
    queryFn: async ({ signal: querySignal }) => {
      const data = await apiClient.get(`/customers/${customerId}`, {
        signal: signal ?? querySignal,
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
