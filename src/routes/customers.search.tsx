import { EmptyState } from "@/components/empty-state";
import { useGetCustomers } from "@/features/customer-search/api/use-get-customers";
import { CustomersTable } from "@/features/customer-search/components/customers-table";
import { CustomerSearchForm } from "@/features/customer-search/components/customer-search-form";
import { CustomersTableHeader } from "@/features/customer-search/components/customers-table-header";
import { CustomerSearchParamsSchema } from "@/features/customer-search/schemas/customer-search-params.schema";
import { Box } from "@cloudscape-design/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/search")({
  validateSearch: CustomerSearchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const routeSearch = Route.useSearch();

  const { data: customersData, isLoading } = useGetCustomers(routeSearch);

  return (
    <Box padding={{ horizontal: "l", vertical: "s" }}>
      <CustomersTable
        header={<CustomersTableHeader count={customersData?.total} />}
        filter={<CustomerSearchForm isLoading={isLoading} />}
        empty={<EmptyState heading="No customers" />}
        customers={customersData?.data ?? []}
        totalItemsCount={customersData?.total}
        isLoading={isLoading}
      />
    </Box>
  );
}
