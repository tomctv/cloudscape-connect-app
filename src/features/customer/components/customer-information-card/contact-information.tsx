import type { Customer } from "../../schemas/customer.schema";
import {
  Badge,
  Box,
  CopyToClipboard,
  KeyValuePairs,
} from "@cloudscape-design/components";

interface ContactInformationProps {
  customer: Customer;
}

const PreferredContactBadge = () => {
  return <Badge color="blue">Preferred method</Badge>;
};

export const ContactInformation: React.FC<ContactInformationProps> = ({
  customer,
}) => {
  return (
    <Box>
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: "Primary phone",
            value: customer.primaryPhone ? (
              <CopyToClipboard
                variant="inline"
                textToCopy={customer.primaryPhone}
                textToDisplay={customer.primaryPhone}
                copySuccessText="Primary phone copied successfully"
                copyErrorText="Failed to copy primary phone"
                copyButtonAriaLabel="Copy primary phone"
                copyButtonText="Copy primary phone"
              />
            ) : (
              "-"
            ),
            info:
              customer.contactPreference === "primaryPhone" ? (
                <PreferredContactBadge />
              ) : undefined,
          },
          {
            label: "Secondary phone",
            value: customer.secondaryPhone ? (
              <CopyToClipboard
                variant="inline"
                textToCopy={customer.secondaryPhone}
                textToDisplay={customer.secondaryPhone}
                copySuccessText="Secondary phone copied successfully"
                copyErrorText="Failed to copy secondary phone"
                copyButtonAriaLabel="Copy secondary phone"
                copyButtonText="Copy secondary phone"
              />
            ) : (
              "-"
            ),
            info:
              customer.contactPreference === "secondaryPhone" ? (
                <PreferredContactBadge />
              ) : undefined,
          },
          {
            label: "Email address",
            value: customer.email ? (
              <CopyToClipboard
                variant="inline"
                textToCopy={customer.email}
                textToDisplay={customer.email}
                copySuccessText="Email address copied successfully"
                copyErrorText="Failed to copy email address"
                copyButtonAriaLabel="Copy email address"
                copyButtonText="Copy email address"
              />
            ) : (
              "-"
            ),
            info:
              customer.contactPreference === "email" ? (
                <PreferredContactBadge />
              ) : undefined,
          },
        ]}
      />
    </Box>
  );
};
