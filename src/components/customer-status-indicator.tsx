import {
  Box,
  Icon,
  SpaceBetween,
  type BoxProps,
} from "@cloudscape-design/components";
import { UserCheckIcon } from "./icons/user-check";
import { UserPlusIcon } from "./icons/user-plus";
import { CircleQuestionMarkIcon } from "./icons/circle-question-mark";

interface CustomerStatusIndicatorProps {
  status: "client" | "prospect" | null | undefined;
}

export const CustomerStatusIndicator: React.FC<
  CustomerStatusIndicatorProps
> = ({ status }) => {
  const iconSvg =
    status === "client" ? (
      <UserCheckIcon />
    ) : status === "prospect" ? (
      <UserPlusIcon />
    ) : (
      <CircleQuestionMarkIcon />
    );

  const color: BoxProps.Color =
    status === "client"
      ? "text-status-success"
      : status === "prospect"
        ? "text-status-warning"
        : "text-status-inactive";

  const formatStatus = (): string => {
    switch (status) {
      case "client":
        return "Client";
      case "prospect":
        return "Prospect";
      default:
        return "Unknown";
    }
  };

  return (
    <Box color={color}>
      <SpaceBetween direction="horizontal" size="xxs">
        <Icon svg={iconSvg} />
        <span>{formatStatus().toUpperCase()}</span>
      </SpaceBetween>
    </Box>
  );
};
