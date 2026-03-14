import { BreadcrumbGroup } from "@cloudscape-design/components";
import { getRouteApi } from "@tanstack/react-router";
import { customerQueryOptions } from "../../api/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const routeApi = getRouteApi("/customers/$customerId");

export const CustomerBreadcrumbs: React.FC = () => {
  const { customerId } = routeApi.useParams();
  const { data: customer } = useSuspenseQuery(customerQueryOptions(customerId));

  const customerHomeText = useMemo<string>(() => {
    if (!customer.firstName && !customer.lastName) return customerId;

    const firstName = customer.firstName ? `${customer.firstName} ` : "";
    const lastName = customer.lastName || "";

    return `${firstName}${lastName}`;
  }, [customerId, customer.firstName, customer.lastName]);

  return (
    <BreadcrumbGroup
      items={[
        { text: customerHomeText, href: "#" },
        { text: "Overview", href: "#" },
      ]}
      onFollow={(event) => {
        event.preventDefault();
      }}
    />
  );
};
