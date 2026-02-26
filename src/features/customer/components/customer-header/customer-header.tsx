import { Header } from "@cloudscape-design/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { customerQueryOptions } from "../../api/query-options";

const routeApi = getRouteApi("/customers/$customerId");

export const CustomerHeader: React.FC = () => {
  const { customerId } = routeApi.useParams();
  const { data: customer } = useSuspenseQuery(customerQueryOptions(customerId));

  return (
    <Header
      variant="awsui-h1-sticky"
      actions={
        <Link to="/customers/$customerId/contacts" params={{ customerId }}>
          Contacts
        </Link>
      }
    >
      {`${customer.firstName ? customer.firstName + " " : ""}${customer.lastName}`}
    </Header>
  );
};
