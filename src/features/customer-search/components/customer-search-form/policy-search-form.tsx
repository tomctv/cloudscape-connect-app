import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  CustomerSearchPolicyParamsSchema,
  type CustomerSearchPolicyParams,
} from "../../schemas/customer-search-form.schema";
import { useAppForm } from "@/features/form/hooks";
import { Box, Grid, SpaceBetween } from "@cloudscape-design/components";
import { createZodFieldValidator } from "@/lib/validation";
import { customerSearchFormOpts } from "./form-options";
import { formGridDefinition, getFieldGridDefinition } from "./grid-options";

interface PolicySearchFormProps {
  isLoading?: boolean;
}

const routeApi = getRouteApi("/customers/search");

export const PolicySearchForm: React.FC<PolicySearchFormProps> = ({
  isLoading,
}) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  const form = useAppForm({
    ...customerSearchFormOpts,
    defaultValues: {
      policyNumber: routeSearch.policyNumber || "",
      subjectCode: routeSearch.subjectCode || "",
      licensePlateNumber: routeSearch.licensePlateNumber || "",
    } as CustomerSearchPolicyParams,
    validators: {
      onSubmit: CustomerSearchPolicyParamsSchema,
    },
    onSubmit: async ({ value }) => {
      const result = CustomerSearchPolicyParamsSchema.parse(value);

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
            name="policyNumber"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchPolicyParamsSchema,
                "policyNumber",
              ),
            }}
            children={(field) => (
              <field.TextField
                label={"Policy number"}
                placeholder={"Enter policy number"}
                disabled={isLoading}
              />
            )}
          />

          <form.AppField
            name="subjectCode"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchPolicyParamsSchema,
                "subjectCode",
              ),
            }}
            children={(field) => (
              <field.TextField
                label={"Subject code"}
                placeholder={"Enter subject code"}
                disabled={isLoading}
              />
            )}
          />

          <form.AppField
            name="licensePlateNumber"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchPolicyParamsSchema,
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
