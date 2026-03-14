import { CustomerStatusIndicator } from "@/components/customer-status-indicator";
import type { Customer } from "../../schemas/customer.schema";
import {
  Box,
  CopyToClipboard,
  KeyValuePairs,
} from "@cloudscape-design/components";
import { YesOrNoStatusIndicator } from "@/components/yes-or-no-status-indicator";

interface ProfileInformationProps {
  customer: Customer;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({
  customer,
}) => {
  return (
    <Box>
      <KeyValuePairs
        columns={4}
        items={[
          {
            label: "Customer ID",
            value: customer.id ? (
              <CopyToClipboard
                variant="inline"
                textToCopy={customer.id}
                textToDisplay={customer.id}
                copySuccessText="Customer ID copied successfully"
                copyErrorText="Failed to copy customer ID"
                copyButtonAriaLabel="Copy customer ID"
                copyButtonText="Copy customer ID"
              />
            ) : (
              "-"
            ),
          },
          {
            label: "Status",
            value: <CustomerStatusIndicator status={customer.status} />,
          },
          {
            label: "Life client",
            value: <YesOrNoStatusIndicator value={customer.isLifeClient} />,
          },
          {
            label: "Non-Life client",
            value: <YesOrNoStatusIndicator value={customer.isNonLifeClient} />,
          },
        ]}
      />
    </Box>
  );
};
