import {
  colorBackgroundContainerHeader,
  colorBorderDividerDefault,
  spaceScaledM,
  spaceScaledXl,
  spaceScaledXs,
  spaceScaledXxs,
} from "@cloudscape-design/design-tokens";
import styled from "styled-components";
import { CustomerBreadcrumbs } from "./customer-breadcrumbs";
import { ButtonGroup } from "@cloudscape-design/components";
import { useLayoutContext } from "@/features/layout/hooks/use-layout-context";
import { CalendarPlusIcon, NotebookPenIcon } from "lucide-react";

interface CustomerNavbarProps {
  customerId: string;
  notesOpen: boolean;
  onNotesToggle: () => void;
  onSectionChange: (sectionId: string) => void;
}

const StyledNavbar = styled.div<{ $verticalOffset: number }>`
  position: sticky;
  top: ${({ $verticalOffset }) => `${$verticalOffset}px`};
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: ${spaceScaledXs};
  background-color: ${colorBackgroundContainerHeader};
  padding-top: ${spaceScaledXxs};
  padding-bottom: ${spaceScaledXxs};
  padding-left: ${spaceScaledXl};
  padding-right: ${spaceScaledM};
  justify-content: space-between;
  border-bottom: 1px solid ${colorBorderDividerDefault};
`;

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  customerId,
  onNotesToggle,
  onSectionChange,
}) => {
  const { headerHeight } = useLayoutContext();

  return (
    <StyledNavbar id="customer-navbar" $verticalOffset={headerHeight ?? 0}>
      <CustomerBreadcrumbs customerId={customerId} />

      <a onClick={() => onSectionChange("contacts")}>Contacts</a>

      <ButtonGroup
        variant="icon"
        items={[
          {
            id: "book-appointment",
            text: "Book an appointment",
            type: "icon-button",

            iconSvg: <CalendarPlusIcon />,
          },
          {
            id: "customer-notes",
            text: "Customer notes",
            type: "icon-button",
            iconSvg: <NotebookPenIcon />,
          },
        ]}
        onItemClick={({ detail }) => {
          switch (detail.id) {
            case "customer-notes": {
              onNotesToggle();
              return;
            }
            case "book-appointment":
            default:
              return;
          }
        }}
      />
    </StyledNavbar>
  );
};
