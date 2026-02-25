import { Box, Spinner } from "@cloudscape-design/components";

interface LoadingStateProps {
  secondaryContent?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  secondaryContent,
}) => {
  return (
    <Box padding={"l"} textAlign="center">
      <Spinner size="large" />
      {secondaryContent && <div>{secondaryContent}</div>}
    </Box>
  );
};
