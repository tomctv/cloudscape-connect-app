import { useGetCustomers } from "../api/use-get-customers";
import { Box } from "@cloudscape-design/components";
import { CustomersTable } from "./customers-table";
import { CustomersTableHeader } from "./customers-table-header";
import { CustomerSearchForm } from "./customer-search-form";
import { EmptyState } from "@/components/empty-state";
import { CustomersTablePagination } from "./customers-table-pagination";

export const CustomerSearchPage: React.FC = () => {
  const {
    data: customersData,
    isLoading,
    isFetching,
    isPaginationVisible,
  } = useGetCustomers();

  return (
    <Box padding={{ horizontal: "l", vertical: "s" }}>
      <CustomersTable
        header={<CustomersTableHeader count={customersData?.total} />}
        filter={<CustomerSearchForm isLoading={isLoading} />}
        pagination={
          isPaginationVisible && customersData?.total ? (
            <CustomersTablePagination
              disabled={isFetching}
              totalItems={customersData.total}
            />
          ) : undefined
        }
        empty={
          <EmptyState
            title="No customers"
            subtitle={
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
