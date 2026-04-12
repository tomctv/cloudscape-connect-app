import { BreadcrumbGroup } from "@cloudscape-design/components";
import { customerQueryOptions } from "../../api/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface CustomerBreadcrumbsProps {
  customerId: string;
}

export const CustomerBreadcrumbs: React.FC<CustomerBreadcrumbsProps> = ({
  customerId,
}) => {
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
