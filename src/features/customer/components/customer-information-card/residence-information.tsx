import type { Customer } from "../../schemas/customer.schema";
import { Box, KeyValuePairs } from "@cloudscape-design/components";

interface ResidenceInformationProps {
  customer: Customer;
}

export const ResidenceInformation: React.FC<ResidenceInformationProps> = ({
  customer,
}) => {
  const formatLivingArrangement = (): string => {
    switch (customer.livingArrangement) {
      case "alone":
        return "Alone";
      case "with_family":
        return "With family";
      case "with_partner":
        return "With partner";
      case "with_roommates":
        return "With roommates";
      default:
        return customer.livingArrangement || "-";
    }
  };

  return (
    <Box>
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: "Residence address",
            value: customer.residenceAddress || "-",
          },
          {
            label: "Residence province",
            value: customer.residenceProvince || "-",
          },
          {
            label: "Living arrangement",
            value: formatLivingArrangement(),
          },
        ]}
      />
    </Box>
  );
};
