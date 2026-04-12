import { Header } from "@cloudscape-design/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { customerQueryOptions } from "../../api/query-options";

interface CustomerHeaderProps {
  customerId: string;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  customerId,
}) => {
  const { data: customer } = useSuspenseQuery(customerQueryOptions(customerId));

  return (
    <Header variant="awsui-h1-sticky">
      {`${customer.firstName ? customer.firstName + " " : ""}${customer.lastName}`}
    </Header>
  );
};
