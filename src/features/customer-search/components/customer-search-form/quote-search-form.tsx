import { useAppForm } from "@/features/form/hooks";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  CustomerSearchQuoteParamsSchema,
  type CustomerSearchQuoteParams,
} from "../../schemas/customer-search-form.schema";
import { Box, Grid, SpaceBetween } from "@cloudscape-design/components";
import { createZodFieldValidator } from "@/lib/validation";
import { customerSearchFormOpts } from "./form-options";
import { formGridDefinition, getFieldGridDefinition } from "./grid-options";

interface QuoteSearchFormProps {
  isLoading?: boolean;
}

const routeApi = getRouteApi("/customers/search");

export const QuoteSearchForm: React.FC<QuoteSearchFormProps> = ({
  isLoading,
}) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  const form = useAppForm({
    ...customerSearchFormOpts,
    defaultValues: {
      quoteNumber: routeSearch.quoteNumber || "",
      taxCode: routeSearch.taxCode || "",
      licensePlateNumber: routeSearch.licensePlateNumber || "",
    } as CustomerSearchQuoteParams,
    validators: {
      onSubmit: CustomerSearchQuoteParamsSchema,
    },
    onSubmit: async ({ value }) => {
      const result = CustomerSearchQuoteParamsSchema.parse(value);

      navigate({
        search: (prev) => ({
          mode: prev.mode, // keep previous mode
          limit: prev.limit, // keep limit
          offset: 0, // reset offset
          ...result, // new filters
        }),
        replace: true,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Grid gridDefinition={formGridDefinition}>
        <Grid gridDefinition={getFieldGridDefinition(3)}>
          <form.AppField
            name="quoteNumber"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchQuoteParamsSchema,
                "quoteNumber",
              ),
            }}
            children={(field) => (
              <field.TextField
                label={"Quote number"}
                placeholder={"Enter quote number"}
                disabled={isLoading}
              />
            )}
          />

          <form.AppField
            name="taxCode"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchQuoteParamsSchema,
                "taxCode",
              ),
            }}
            children={(field) => <field.TaxCodeField disabled={isLoading} />}
          />

          <form.AppField
            name="licensePlateNumber"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchQuoteParamsSchema,
                "licensePlateNumber",
              ),
            }}
            children={(field) => (
              <field.LicensePlateNumberField disabled={isLoading} />
            )}
          />
        </Grid>

        <Box margin={{ top: "xl" }} float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <form.AppForm>
              <SpaceBetween direction="horizontal" size="xs">
                <form.ClearFormButton
                  disabled={isLoading}
                  onClick={() =>
                    // Clear URL keeping only mode, limit and offset
                    navigate({
                      search: (prev) => ({
                        mode: prev.mode,
                        limit: prev.limit,
                        offset: 0,
                      }),
                      replace: true,
                    })
                  }
                />
                <form.SearchButton disabled={isLoading} />
              </SpaceBetween>
            </form.AppForm>
          </SpaceBetween>
        </Box>
      </Grid>
    </form>
  );
};
