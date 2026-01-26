import { CalculatorIcon } from "@/components/icons/calculator";
import {
  ButtonGroup,
  Header,
  SegmentedControl,
} from "@cloudscape-design/components";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import type { CustomerSearchParams } from "../schemas/customer-search-params.schema";
import styled from "styled-components";
import { spaceScaledXs } from "@cloudscape-design/design-tokens";

const routeApi = getRouteApi("/customers/search");

interface CustomersTableHeaderProps {
  count?: number;
}

const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: ${spaceScaledXs};
`;

export const CustomersTableHeader: React.FC<CustomersTableHeaderProps> = ({
  count,
}) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });
  const compactHeader = routeSearch.compactHeader;

  return (
    <Header
      variant="awsui-h1-sticky"
      counter={count != null && `(${count})`}
      description={
        <span>
          Find customers choosing between <b>contractor</b>, <b>quote</b> or{" "}
          <b>policy</b> search modes.
        </span>
      }
      actions={
        <ActionsContainer>
          <SegmentedControl
            selectedId={routeSearch.mode}
            onChange={({ detail }) =>
              navigate({
                search: {
                  mode: detail.selectedId as CustomerSearchParams["mode"],
                },
              })
            }
            // label="Search by"
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
          <ButtonGroup
            variant="icon"
            items={[
              {
                type: "icon-button",
                id: "header-toggle-button",
                text: compactHeader
                  ? "Expand search form"
                  : "Collapse search form",
                iconName: compactHeader ? "angle-down" : "angle-up",
              },
            ]}
            onItemClick={({ detail }) => {
              if (detail.id === "header-toggle-button")
                navigate({
                  search: (prev) => ({
                    ...prev,
                    compactHeader: !compactHeader,
                  }),
                });
            }}
          />
        </ActionsContainer>
      }
    >
      Customer search
    </Header>
  );
};
