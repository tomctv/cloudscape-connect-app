import { useQuery } from "@tanstack/react-query";
import { queries } from "./queries";
import { CustomerSearchApiParamsSchema } from "../schemas/customer-search-params.schema";

function shouldTrigger(params: Parameters<typeof queries.search>[0]): boolean {
  switch (params.mode) {
    case "contractor":
      return params.lastName !== undefined;
    case "quote":
      return params.quoteNumber !== undefined;
    case "policy":
      return false;
    default:
      return false;
  }
}

export function useGetCustomers(params: Parameters<typeof queries.search>[0]) {
  return useQuery({
    ...queries.search(CustomerSearchApiParamsSchema.parse(params)),
    enabled: shouldTrigger(params),
  });
}
