import {
  Box,
  Button,
  ContentLayout,
  Grid,
  Icon,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useNavigate, type NotFoundRouteProps } from "@tanstack/react-router";

export const CustomerNotFoundPage: React.FC<NotFoundRouteProps> = () => {
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
                  Customer not found
                </Box>
              </SpaceBetween>
              <Box
                variant="p"
                color="text-body-secondary"
                margin={{ top: "xs", bottom: "l" }}
              >
                The customer you're looking for doesn't exist or may have been
                removed.
              </Box>
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  iconName="search"
                  href="/customers/search"
                  onFollow={(event) => {
                    event.preventDefault();
                    navigate({ to: "/customers/search", replace: true });
                  }}
                >
                  Search customers
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
