import apiClient from "@/api/clients/api-client";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { CustomerSearchResponseSchema } from "../schemas/customer-result.schema";
import type { CustomerSearchApiParams } from "../schemas/customer-search-params.schema";

export const queries = createQueryKeys("customers", {
  search: (params: CustomerSearchApiParams) => ({
    queryKey: [{ params }],
    queryFn: async () => {
      const data = await apiClient.get("/customers", { params });
      return CustomerSearchResponseSchema.parse(data);
    },
  }),
});
