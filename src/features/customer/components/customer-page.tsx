import { Box, SpaceBetween } from "@cloudscape-design/components";
import { useState } from "react";
import { CustomerNavbar } from "./customer-navbar";
import { CustomerHeader } from "./customer-header";
import { CustomerInformationCard } from "./customer-information-card";

interface CustomerPageProps {
  customerId: string;
}

export const CustomerPage: React.FC<CustomerPageProps> = ({ customerId }) => {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  return (
    <div>
      <CustomerNavbar
        customerId={customerId}
        notesOpen={activeDrawerId === "customer-notes"}
        onNotesToggle={() =>
          setActiveDrawerId((prev) =>
            prev === "customer-notes" ? null : "customer-notes",
          )
        }
      />
      <Box padding={{ horizontal: "l", vertical: "s" }}>
        <SpaceBetween size="l">
          <CustomerHeader customerId={customerId} />
          <CustomerInformationCard customerId={customerId} />
        </SpaceBetween>
      </Box>
    </div>
  );
};
