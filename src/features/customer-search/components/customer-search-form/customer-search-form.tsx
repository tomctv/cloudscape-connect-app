import { getRouteApi } from "@tanstack/react-router";
import { ContractorSearchForm } from "./contractor-search-form";
import { Activity, lazy } from "react";
import { QuoteSearchForm } from "./quote-search-form";
import { PolicySearchForm } from "./policy-search-form";

const FormTokenGroup = lazy(() => import("./form-token-group"));

const routeApi = getRouteApi("/customers/search");

interface CustomerSearchFormProps {
  isLoading?: boolean;
}

export const CustomerSearchForm: React.FC<CustomerSearchFormProps> = ({
  isLoading,
}) => {
  const routeSearch = routeApi.useSearch();
  const expanded = !routeSearch.compactHeader;

  return (
    <div>
      <Activity
        name="customer-search-form"
        mode={expanded ? "visible" : "hidden"}
      >
        <Activity
          name="contractor-search-form"
          mode={routeSearch.mode === "contractor" ? "visible" : "hidden"}
        >
          <ContractorSearchForm isLoading={isLoading} />
        </Activity>

        <Activity
          name="quote-search-form"
          mode={routeSearch.mode === "quote" ? "visible" : "hidden"}
        >
          <QuoteSearchForm isLoading={isLoading} />
        </Activity>

        <Activity
          name="policy-search-form"
          mode={routeSearch.mode === "policy" ? "visible" : "hidden"}
        >
          <PolicySearchForm isLoading={isLoading} />
        </Activity>
      </Activity>

      {!expanded && <FormTokenGroup />}
    </div>
  );
};
