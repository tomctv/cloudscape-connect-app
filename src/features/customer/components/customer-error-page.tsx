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
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";

export const CustomerErrorPage: React.FC<ErrorComponentProps> = ({ error }) => {
  const router = useRouter();

  const handleRetry = async () => {
    router.invalidate();
  };

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
                  onClick={handleRetry}
                >
                  Retry
                </Button>
                <Button
                  href="/"
                  onFollow={(event) => {
                    event.preventDefault();
                    router.navigate({ to: "/", replace: true });
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
