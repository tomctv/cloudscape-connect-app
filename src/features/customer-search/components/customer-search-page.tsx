import { getRouteApi } from "@tanstack/react-router";
import { useGetCustomers } from "../api/use-get-customers";
import { Box } from "@cloudscape-design/components";
import { CustomersTable } from "./customers-table";
import { CustomersTableHeader } from "./customers-table-header";
import { CustomerSearchForm } from "./customer-search-form";
import { EmptyState } from "@/components/empty-state";

const routeApi = getRouteApi("/customers/search");

export const CustomerSearchPage: React.FC = () => {
  const routeSearch = routeApi.useSearch();

  const { data: customersData, isLoading } = useGetCustomers(routeSearch);

  return (
    <Box padding={{ horizontal: "l", vertical: "s" }}>
      <CustomersTable
        header={<CustomersTableHeader count={customersData?.total} />}
        filter={<CustomerSearchForm isLoading={isLoading} />}
        empty={
          <EmptyState
            heading="No customers"
            description={
              customersData?.data.length === 0
                ? "No customers matching the filter criteria"
                : "Apply some filters to find customers"
            }
          />
        }
        customers={customersData?.data ?? []}
        totalItemsCount={(customersData?.data ?? []).length}
        isLoading={isLoading}
      />
    </Box>
  );
};
