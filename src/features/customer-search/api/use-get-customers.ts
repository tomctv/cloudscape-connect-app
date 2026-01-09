import { useQuery } from "@tanstack/react-query";
import { queries } from "./queries";

export function useGetCustomers(params: Parameters<typeof queries.search>[0]) {
  return useQuery({
    ...queries.search(params),
    enabled: params.mode !== undefined && params.lastName !== undefined,
  });
}
