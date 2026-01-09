import {
  Box,
  Button,
  SpaceBetween,
  type ButtonProps,
} from "@cloudscape-design/components";

interface EmptyStateProps {
  heading?: string;
  description?: string;
  buttonProps?: ButtonProps;
}

/**
 * A React component to render an empty or no-match state for a collection of items.
 *
 * @param param0 Component props.
 * @returns
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  heading,
  description,
  buttonProps,
}) => {
  return (
    <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
      <SpaceBetween size="m">
        <SpaceBetween size="xxxs">
          <b>{heading || "No items"}</b>
          {description && <span>{description}</span>}
        </SpaceBetween>
        {buttonProps && <Button {...buttonProps} />}
      </SpaceBetween>
    </Box>
  );
};
