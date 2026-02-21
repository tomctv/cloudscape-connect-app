import { Box, Spinner } from "@cloudscape-design/components";

interface LoadingFallbackProps {
  secondaryContent?: React.ReactNode;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  secondaryContent,
}) => {
  return (
    <Box padding={"l"} textAlign="center">
      <Spinner size="large" />
      {secondaryContent && <div>{secondaryContent}</div>}
    </Box>
  );
};
