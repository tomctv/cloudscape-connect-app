import apiClient from "@/api/clients/api-client";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { CustomerSearchResponseSchema } from "../schemas/customer-result.schema";
import type { CustomerSearchParams } from "../schemas/customer-search-params.schema";

export const queries = createQueryKeys("customers", {
  search: (params: CustomerSearchParams) => ({
    queryKey: [{ params }],
    queryFn: async () => {
      const data = await apiClient.get("/customers", { params });
      return CustomerSearchResponseSchema.parse(data);
    },
  }),
});
