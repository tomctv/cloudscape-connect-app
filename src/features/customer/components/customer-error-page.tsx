import {
  Alert,
  Box,
  Button,
  ContentLayout,
  CopyToClipboard,
  ExpandableSection,
  Grid,
  Icon,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useNavigate } from "@tanstack/react-router";

interface CustomerErrorPageProps {
  error: Error;
  onRetry: () => void;
}

export const CustomerErrorPage: React.FC<CustomerErrorPageProps> = ({
  error,
  onRetry,
}) => {
  const navigate = useNavigate();

  return (
    <ContentLayout
      defaultPadding
      disableOverlap
      header={
        <Box padding={{}}>
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 8, m: 6, l: 6, xl: 4 } },
            ]}
          >
            <Box padding="s">
              <SpaceBetween direction="horizontal" size="s">
                <Icon name="status-negative" size="large" variant="subtle" />
                <Box
                  fontSize="display-l"
                  fontWeight="bold"
                  variant="h1"
                  padding="n"
                  color="text-status-inactive"
                >
                  Customer error
                </Box>
              </SpaceBetween>
              <Box
                variant="p"
                color="text-body-secondary"
                margin={{ top: "xs", bottom: "l" }}
              >
                An error occurred while retrieving the customer information or
                navigating the customer page.
              </Box>
              <Box margin={{ bottom: "xl" }}>
                <Alert type="error" header={error.message}>
                  <div>
                    An error occurred while retrieving the customer information.
                  </div>
                  <ExpandableSection
                    headerText={"Details (to be shared with Dev Team)"}
                  >
                    <CopyToClipboard
                      variant="inline"
                      textToCopy={error.stack || ""}
                      copyErrorText="Failed to copy error text"
                      copySuccessText="Successfully copied error text"
                      textToDisplay={error.stack}
                      copyButtonText="Copy error to clipboard"
                      copyButtonAriaLabel="Copy error to clipboard"
                    />
                  </ExpandableSection>
                </Alert>
              </Box>
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  iconName="refresh"
                  onClick={onRetry}
                >
                  Retry
                </Button>
                <Button
                  href="/"
                  onFollow={(event) => {
                    event.preventDefault();
                    navigate({ to: "/", replace: true });
                  }}
                >
                  Go to Home
                </Button>
              </SpaceBetween>
            </Box>
          </Grid>
        </Box>
      }
    />
  );
};
