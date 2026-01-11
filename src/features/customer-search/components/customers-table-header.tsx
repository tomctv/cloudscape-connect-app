import { CalculatorIcon } from "@/components/icons/calculator";
import { Header, SegmentedControl } from "@cloudscape-design/components";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import type { CustomerSearchParams } from "../schemas/customer-search-params.schema";

const routeApi = getRouteApi("/customers/search");

interface CustomersTableHeaderProps {
  count?: number;
}

export const CustomersTableHeader: React.FC<CustomersTableHeaderProps> = ({
  count,
}) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  return (
    <Header
      variant="awsui-h1-sticky"
      counter={count != null && `(${count})`}
      description={
        <span>
          Find customers choosing between <b>contractor</b>, <b>quote</b> or{" "}
          <b>policy</b> search modes.
        </span>
      }
      actions={
        <SegmentedControl
          selectedId={routeSearch.mode}
          onChange={({ detail }) =>
            navigate({
              search: {
                mode: detail.selectedId as CustomerSearchParams["mode"],
              },
            })
          }
          label="Search by"
          options={[
            {
              id: "contractor",
              text: "Contractor",
              iconName: "user-profile",
            },
            {
              id: "quote",
              text: "Quote",
              iconSvg: <CalculatorIcon />,
            },
            {
              id: "policy",
              text: "Policy",
              iconName: "security",
            },
          ]}
        />
      }
    >
      Customer search
    </Header>
  );
};
