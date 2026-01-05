import {
  Box,
  Button,
  Pagination,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import type { CustomerResult } from "../schemas/customer-result.schema";
import { CustomerStatusIndicator } from "@/components/customer-status-indicator";
import { CustomerDetailsLink } from "./customer-details-link";
import { useCollectionPreferences } from "@/features/collection-preferences/hooks/use-collection-preferences";
import { CustomCollectionPreferences } from "@/features/collection-preferences/components/custom-collection-preferences";

interface CustomersTableProps {
  header: React.ReactNode;
  filter: React.ReactNode;
  customers: CustomerResult[];
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  header,
  filter,
  customers,
}) => {
  const { preferences, setPreferences } =
    useCollectionPreferences<CustomerResult>(
      "customer-search-table-preferences",
      {
        contentDisplay: [
          { id: "firstName", visible: true },
          { id: "lastName", visible: true },
          { id: "birthDate", visible: true },
          { id: "birthPlace", visible: true },
          { id: "status", visible: true },
          { id: "taxCode", visible: true },
          { id: "residenceProvince", visible: true },
          { id: "primaryPhone", visible: true },
        ],
      }
    );

  return (
    <Table
      variant="full-page"
      stickyHeader
      header={header}
      filter={filter}
      pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      enableKeyboardNavigation
      renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
        `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
      }
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
      columnDefinitions={[
        {
          id: "firstName",
          header: "First name",
          cell: (item) => item.firstName || "-",
          isRowHeader: true,
        },
        {
          id: "lastName",
          header: "Last name",
          cell: (item) => item.lastName || "-",
        },
        {
          id: "birthDate",
          header: "Birth date",
          cell: (item) => item.birthDate || "-",
        },
        {
          id: "birthPlace",
          header: "Birth place",
          cell: (item) => item.birthPlace || "",
        },
        {
          id: "status",
          header: "Status",
          cell: (item) => <CustomerStatusIndicator status={item.status} />,
          minWidth: 135,
          maxWidth: 135,
        },
        {
          id: "taxCode",
          header: "Tax code / VAT number",
          cell: (item) => item.taxCode || "-",
        },
        {
          id: "residenceProvince",
          header: "Residence province",
          cell: (item) => item.residenceProvince || "-",
        },
        {
          id: "primaryPhone",
          header: "Primary phone number",
          cell: (item) => item.primaryPhone || "-",
        },
        {
          id: "details",
          header: "Details",
          cell: (item) => <CustomerDetailsLink customerId={item.id} />,
        },
      ]}
      columnDisplay={[
        ...(preferences.contentDisplay ?? []),
        { id: "details", visible: true },
      ]}
      items={customers}
      trackBy="id"
      loadingText="Loading customers"
      stickyColumns={{ first: preferences.stickyColumns?.first, last: 1 }}
      wrapLines={preferences.wrapLines}
      contentDensity={preferences.contentDensity}
      stripedRows={preferences.stripedRows}
      preferences={
        <CustomCollectionPreferences
          preferences={preferences}
          onConfirm={setPreferences}
          pageSizeValues={[25, 50, 100]}
          showWrapLinesPreference
          showStripedRowsPreference
          showContentDensityPreference
          showStickFirstColumnPreference
          contentDisplayPreference={{
            options: [
              {
                id: "firstName",
                label: "First name",
                alwaysVisible: true,
              },
              {
                id: "lastName",
                label: "Last name",
                alwaysVisible: true,
              },
              {
                id: "birthDate",
                label: "Birth date",
              },
              {
                id: "birthPlace",
                label: "Birth place",
              },
              {
                id: "status",
                label: "Status",
              },
              {
                id: "taxCode",
                label: "Tax code",
              },
              {
                id: "residenceProvince",
                label: "Residence province",
              },
              {
                id: "primaryPhone",
                label: "Primary phone",
              },
            ],
          }}
        />
      }
    />
  );
};
