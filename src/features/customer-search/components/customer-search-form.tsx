import { getRouteApi } from "@tanstack/react-router";
import { ContractorSearchForm } from "./contractor-search-form/contractor-search-form";
import { Activity } from "react";
import { QuoteSearchForm } from "./quote-search-form/quote-search-form";
import { PolicySearchForm } from "./policy-search-form/policy-search-form";

const routeApi = getRouteApi("/customers/search");

interface CustomerSearchFormProps {
  isLoading?: boolean;
}

export const CustomerSearchForm: React.FC<CustomerSearchFormProps> = ({
  isLoading,
}) => {
  const routeSearch = routeApi.useSearch();
  // const navigate = useNavigate({ from: "/customers/search" });

  // return <ContractorSearchForm isLoading={isLoading} />;

  return (
    <div>
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
    </div>
  );
};
