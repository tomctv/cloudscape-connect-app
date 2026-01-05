import { TextFilter } from "@cloudscape-design/components";

export const CustomersTableFilter: React.FC = () => {
  return (
    <TextFilter
      filteringPlaceholder="Find resources"
      filteringText=""
      countText="0 matches"
    />
  );
};
