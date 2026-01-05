import { CalculatorIcon } from "@/components/icons/calculator";
import { Header, SegmentedControl } from "@cloudscape-design/components";
import { useState } from "react";

export const CustomersTableHeader: React.FC = () => {
  const [selectedId, setSelectedId] = useState("contractor");

  return (
    <Header
      variant="awsui-h1-sticky"
      counter={"(6)"}
      description={
        <span>
          Find customers choosing between <b>contractor</b>, <b>quote</b> or{" "}
          <b>policy</b> search modes.
        </span>
      }
      actions={
        <SegmentedControl
          selectedId={selectedId}
          onChange={({ detail }) => setSelectedId(detail.selectedId)}
          label="Search by"
          options={[
            {
              id: "contractor",
              text: "Contractor",
              iconName: "user-profile",
            },
            {
              id: "quote",
              text: "Quote",
              iconSvg: <CalculatorIcon />,
            },
            {
              id: "policy",
              text: "Policy",
              iconName: "security",
            },
          ]}
        />
      }
    >
      Customer search
    </Header>
  );
};
