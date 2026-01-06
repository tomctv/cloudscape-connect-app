import { CustomersTable } from "@/features/customer-search/components/customers-table";
import { CustomersTableFilter } from "@/features/customer-search/components/customers-table-filter";
import { CustomersTableHeader } from "@/features/customer-search/components/customers-table-header";
import type { CustomerResult } from "@/features/customer-search/schemas/customer-result.schema";
import { CustomerSearchParamsSchema } from "@/features/customer-search/schemas/customer-search-params.schema";
import { Box } from "@cloudscape-design/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/search")({
  validateSearch: CustomerSearchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const customers: CustomerResult[] = [
    {
      id: "10234567",
      firstName: "Marco",
      lastName: "Rossi",
      status: "client",
      taxCode: "RSSMRC85M10F205Z",
      residenceProvince: "MI",
      birthDate: "1985-08-10",
      gender: "M",
      birthPlace: "Milano",
      primaryPhone: "+39 333 1234567",
    },
    {
      id: "20345678",
      firstName: "Laura",
      lastName: "Bianchi",
      status: "prospect",
      taxCode: "BNCLRA90D45H501X",
      residenceProvince: "RM",
      birthDate: "1990-04-05",
      gender: "F",
      birthPlace: "Roma",
      primaryPhone: "+39 340 9876543",
    },
    {
      id: "30456789",
      firstName: "Giuseppe",
      lastName: "Verdi",
      status: "client",
      taxCode: "VRDGPP78C15L219Y",
      residenceProvince: "NA",
      birthDate: "1978-03-15",
      gender: "M",
      birthPlace: "Napoli",
      primaryPhone: "+39 338 5555555",
    },
    {
      id: "40567890",
      firstName: "Francesca",
      lastName: "Romano",
      status: "client",
      taxCode: "RMNFNC92L50A001W",
      residenceProvince: "TO",
      birthDate: "1992-07-10",
      gender: "F",
      birthPlace: "Torino",
      primaryPhone: "+39 345 7777777",
    },
    {
      id: "50678901",
      firstName: "Antonio",
      lastName: "Ferrari",
      status: "prospect",
      taxCode: "FRRNTN88H20B157V",
      residenceProvince: "FI",
      birthDate: "1988-06-20",
      gender: "M",
      birthPlace: "Firenze",
      primaryPhone: "+39 347 3333333",
    },
    {
      id: "39578123",
      firstName: "Giovanna",
      lastName: "Fiori",
      status: null,
      taxCode: "GVNFRIG96H20B157V",
      residenceProvince: "SA",
      birthDate: "1996-06-20",
      gender: "F",
      birthPlace: "Salerno",
      primaryPhone: "+39 328 7728394",
    },
  ];

  return (
    <Box padding={{ horizontal: "l", vertical: "s" }}>
      <CustomersTable
        header={<CustomersTableHeader />}
        filter={<CustomersTableFilter />}
        customers={customers}
      />
    </Box>
  );
}
