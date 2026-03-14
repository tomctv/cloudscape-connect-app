import { Alert, Button } from "@cloudscape-design/components";

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  retryFn?: () => void;
}

/**
 * A React component to render an error state (e.g., a loading error for a collection of items).
 *
 * @param param0 Component props.
 * @returns
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  subtitle,
  retryFn,
}) => {
  return (
    <Alert
      type="error"
      header={title || "Error"}
      action={
        retryFn && (
          <Button iconName="refresh" ariaLabel="Retry" onClick={retryFn}>
            Retry
          </Button>
        )
      }
    >
      {subtitle}
    </Alert>
  );
};
