import { Tabs } from "@cloudscape-design/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { customerQueryOptions } from "../../api/query-options";
import { ContactInformation } from "./contact-information";
import { PersonalInformation } from "./personal-information";
import { ResidenceInformation } from "./residence-information";
import { EmploymentInformation } from "./employment-information";
import { ProfileInformation } from "./profile-information";

interface CustomerInformationCardProps {
  customerId: string;
}

export const CustomerInformationCard: React.FC<CustomerInformationCardProps> = ({
  customerId,
}) => {
  const { data: customer } = useSuspenseQuery(customerQueryOptions(customerId));

  return (
    <Tabs
      variant="container"
      style={{
        tab: {
          fontSize: "16px",
          paddingBlock: "4px",
        },
      }}
      tabs={[
        {
          id: "profile-info",
          label: "Profile",
          content: <ProfileInformation customer={customer} />,
        },
        {
          id: "personal-info",
          label: "Personal",
          content: <PersonalInformation customer={customer} />,
        },
        {
          id: "contact-info",
          label: "Contact",
          content: <ContactInformation customer={customer} />,
        },
        {
          id: "residence-info",
          label: "Residence",
          content: <ResidenceInformation customer={customer} />,
        },
        {
          id: "employment-info",
          label: "Employment",
          content: <EmploymentInformation customer={customer} />,
        },
      ]}
    />
  );
};
