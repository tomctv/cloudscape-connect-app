import { useQuery } from "@tanstack/react-query";
import { queries } from "./queries";
import {
  CustomerSearchApiParamsSchema,
  type CustomerSearchParams,
} from "../schemas/customer-search-params.schema";
import { getRouteApi } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type SearchCriteria = Omit<CustomerSearchParams, "offset" | "compactHeader">;

const routeApi = getRouteApi("/customers/search");

function isSameCriteria(
  searchCriteriaA: SearchCriteria | null,
  searchCriteriaB: SearchCriteria | null,
): boolean {
  return JSON.stringify(searchCriteriaA) === JSON.stringify(searchCriteriaB);
}

export function useGetCustomers() {
  const routeSearch = routeApi.useSearch();
  const { offset, limit, compactHeader, ...otherParams } = routeSearch;

  const [lastResolvedFilters, setLastResolvedFilters] =
    useState<SearchCriteria | null>(null);

  const isEnabled = useMemo(() => {
    switch (routeSearch.mode) {
      case "contractor":
        return !!routeSearch.lastName;
      case "quote":
        return !!routeSearch.quoteNumber;
      case "policy":
        return !!routeSearch.policyNumber;
      default:
        return false;
    }
  }, [routeSearch]);

  const queryResult = useQuery({
    ...queries.search(CustomerSearchApiParamsSchema.parse(routeSearch)),
    placeholderData:
      isEnabled &&
      isSameCriteria(lastResolvedFilters, { limit, ...otherParams })
        ? (previousData) => previousData
        : undefined,
    enabled: isEnabled,
  });

  if (
    queryResult.isSuccess &&
    !isSameCriteria(lastResolvedFilters, { limit, ...otherParams })
  ) {
    setLastResolvedFilters({ limit, ...otherParams });
  }

  const filtersChanged =
    lastResolvedFilters !== null &&
    JSON.stringify(lastResolvedFilters) !==
      JSON.stringify({ limit, ...otherParams });

  const isPaginationVisible =
    queryResult.isSuccess || (queryResult.isFetching && !filtersChanged);

  return {
    ...queryResult,
    isPaginationVisible,
  };
}
