import {
  TokenGroup,
  type TokenGroupProps,
} from "@cloudscape-design/components";
import {
  borderRadiusBadge,
  lineHeightBodyS,
} from "@cloudscape-design/design-tokens";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import styled from "styled-components";
import {
  customerSearchFormParamsKeys,
  type CustomerSearchFormParams,
  type CustomerSearchParams,
} from "../../schemas/customer-search-params.schema";

const routeApi = getRouteApi("/customers/search");

const StyledTokenGroup = styled(TokenGroup)`
  [class*="awsui_token-box"] {
    padding: 0.5px 0px 0.5px 3px !important;
    line-height: 2px !important;
    border-width: 1px !important;
    border-radius: ${borderRadiusBadge} !important;

    span[class*="awsui_label-content"] {
      line-height: ${lineHeightBodyS} !important;

      span[class*="awsui_label-tag"] {
        display: none !important;
      }
    }

    button[class*="awsui_dismiss-button"] {
      padding: 0 !important;

      span[class*="awsui_icon"] {
        padding: 0 !important;
      }
    }
  }
`;

function getTokenLabel(key: string): string {
  switch (key) {
    case "firstName":
      return "First name";
    case "lastName":
      return "Last name";
    case "taxCode":
      return "Tax code";
    case "birthDate":
      return "Birth date";
    case "phoneNumber":
      return "Phone number";
    case "email":
      return "Email address";
    case "quoteNumber":
      return "Quote no.";
    case "licensePlateNumber":
      return "License plate";
    case "subjectCode":
      return "Subject code";
    case "policyNumber":
      return "Policy no.";
    default:
      return key;
  }
}

const FormTokenGroup: React.FC = () => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  const items = useMemo<TokenGroupProps.Item[]>(() => {
    return Object.entries(routeSearch)
      .filter((entry) =>
        customerSearchFormParamsKeys.includes(
          entry[0] as keyof CustomerSearchFormParams,
        ),
      )
      .map((entry) => {
        const key = entry[0];
        const value = entry[1];
        const tokenLabel = getTokenLabel(key);

        return {
          label: tokenLabel,
          description: String(value),
          dismissLabel: `Remove ${tokenLabel}`,
          labelTag: key,
        };
      });
  }, [routeSearch]);

  const handleDismiss = (tokenIndex: number) => {
    if (tokenIndex > items.length - 1) return;

    const token = items[tokenIndex];

    if (token && token.labelTag) {
      const param = token.labelTag;

      navigate({
        search: (prev) => {
          const newParams = { ...prev };
          delete newParams[param as keyof CustomerSearchParams];
          return newParams;
        },
      });
    }
  };

  return (
    <StyledTokenGroup
      disableOuterPadding
      onDismiss={({ detail: { itemIndex } }) => handleDismiss(itemIndex)}
      items={items}
    />
  );
};

export default FormTokenGroup;
