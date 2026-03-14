import type { Customer } from "../../schemas/customer.schema";
import { Box, KeyValuePairs } from "@cloudscape-design/components";

interface EmploymentInformationProps {
  customer: Customer;
}

export const EmploymentInformation: React.FC<EmploymentInformationProps> = ({
  customer,
}) => {
  return (
    <Box>
      <KeyValuePairs
        columns={2}
        items={[
          {
            label: "Occupation",
            value: customer.occupation || "-",
          },
          {
            label: "Occupation sector",
            value: customer.occupationSector || "-",
          },
        ]}
      />
    </Box>
  );
};
