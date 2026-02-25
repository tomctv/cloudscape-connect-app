import { StatusIndicator } from "@cloudscape-design/components";

interface YesOrNoStatusIndicatorProps {
  value: boolean | null | undefined;
}

export const YesOrNoStatusIndicator: React.FC<YesOrNoStatusIndicatorProps> = ({
  value,
}) => {
  if (value === null || value === undefined) return "-";

  return (
    <StatusIndicator type={value ? "success" : "stopped"}>
      {value ? "Yes" : "No"}
    </StatusIndicator>
  );
};
