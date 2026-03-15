import { Box, SpaceBetween } from "@cloudscape-design/components";
import { useState, useCallback } from "react";
import { CustomerNavbar } from "./customer-navbar";
import { CustomerHeader } from "./customer-header";
import { CustomerInformationCard } from "./customer-information-card";
import { CustomerContactHistoryPage } from "@/features/customer-contact-history/components/customer-contact-history-page";
import { useTabsStore } from "@/features/tabs";

// Valid hash sections for the customer page
type CustomerSection = "overview" | "contacts";

const VALID_SECTIONS: CustomerSection[] = ["overview", "contacts"];

/**
 * Parses the current URL hash into a valid customer section.
 * Returns "overview" if the hash is empty or invalid.
 */
function parseHashSection(): CustomerSection {
  const hash = window.location.hash.slice(1); // Remove leading #
  return VALID_SECTIONS.includes(hash as CustomerSection)
    ? (hash as CustomerSection)
    : "overview";
}

interface CustomerPageProps {
  customerId: string;
  tabId: string;
}

export const CustomerPage: React.FC<CustomerPageProps> = ({
  customerId,
  tabId,
}) => {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [activeSection, setActiveSection] =
    useState<CustomerSection>(parseHashSection);
  const updateTab = useTabsStore((s) => s.updateTab);

  const handleSectionChange = useCallback(
    (sectionId: string) => {
      const section = sectionId as CustomerSection;

      setActiveSection(section);

      // Update the URL hash and store's activePath
      const hash = section === "overview" ? "" : `#${section}`;
      const newPath = `/customers/${customerId}${hash}`;
      window.history.replaceState(null, "", newPath);
      updateTab(tabId, { activePath: newPath });
    },
    [customerId, tabId, updateTab],
  );

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
        onSectionChange={handleSectionChange}
      />
      <Box padding={{ horizontal: "l", vertical: "s" }}>
        <SpaceBetween size="l">
          <CustomerHeader customerId={customerId} />
          <CustomerInformationCard customerId={customerId} />

          {activeSection === "contacts" && (
            <CustomerContactHistoryPage customerId={customerId} />
          )}
        </SpaceBetween>
      </Box>
    </div>
  );
};
