import type { Customer } from "../../schemas/customer.schema";
import {
  Box,
  CopyToClipboard,
  KeyValuePairs,
} from "@cloudscape-design/components";

interface PersonalInformationProps {
  customer: Customer;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({
  customer,
}) => {
  return (
    <Box>
      <KeyValuePairs
        columns={4}
        items={[
          {
            label: "Gender",
            value: customer.gender || "-",
          },
          {
            label: "Birth date",
            value: customer.birthDate || "-",
          },
          {
            label: "Birth place",
            value: customer.birthPlace || "-",
          },
          {
            label: "Tax code",
            value: customer.taxCode ? (
              <CopyToClipboard
                variant="inline"
                textToCopy={customer.taxCode}
                textToDisplay={customer.taxCode}
                copySuccessText="Tax code copied successfully"
                copyErrorText="Failed to copy tax code"
                copyButtonAriaLabel="Copy tax code"
                copyButtonText="Copy tax code"
              />
            ) : (
              "-"
            ),
          },
        ]}
      />
    </Box>
  );
};
