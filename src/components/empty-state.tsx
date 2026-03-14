import { Box } from "@cloudscape-design/components";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * A React component to render an empty or no-match state for a collection of items.
 *
 * @param param0 Component props.
 * @returns
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: "s" }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
};
