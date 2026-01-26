import { useQuery } from "@tanstack/react-query";
import { queries } from "./queries";
import { CustomerSearchApiParamsSchema } from "../schemas/customer-search-params.schema";

export function useGetCustomers(params: Parameters<typeof queries.search>[0]) {
  return useQuery({
    ...queries.search(CustomerSearchApiParamsSchema.parse(params)),
    enabled: params.mode !== undefined && params.lastName !== undefined,
  });
}
