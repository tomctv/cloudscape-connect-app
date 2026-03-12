import { TabLink } from "./tab-link";
import { TabLinkContent } from "./tab-link-content";

interface CustomerTabLinkProps {
  customerId: string;
  label: string;
}

export const CustomerTabLink: React.FC<CustomerTabLinkProps> = ({
  customerId,
  label,
}) => {
  return (
    <TabLink to="/customers/$customerId" params={{ customerId }}>
      <TabLinkContent label={label} iconName="user-profile" />
    </TabLink>
  );
};
