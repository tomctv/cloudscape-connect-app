import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  CustomerSearchPolicyParamsSchema,
  type CustomerSearchPolicyParams,
} from "../../schemas/customer-search-form.schema";
import { useAppForm } from "@/features/form/hooks";
import { revalidateLogic } from "@tanstack/react-form";
import { Box, Grid, SpaceBetween } from "@cloudscape-design/components";
import { createZodFieldValidator } from "@/lib/validation";

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
    defaultValues: {
      policyNumber: routeSearch.policyNumber || "",
      subjectCode: routeSearch.subjectCode || "",
      licensePlateNumber: routeSearch.licensePlateNumber || "",
    } as CustomerSearchPolicyParams,
    validators: {
      onSubmit: CustomerSearchPolicyParamsSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
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
    onSubmitInvalid() {
      const InvalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement;

      InvalidInput?.focus();
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
      <Grid
        gridDefinition={[
          {
            colspan: {
              default: 12,
              xxs: 12,
              xs: 9,
              s: 9,
              m: 10,
              l: 10,
              xl: 10,
            },
          },
          {
            colspan: { default: 12, xxs: 12, xs: 3, s: 3, m: 2, l: 2, xl: 2 },
          },
        ]}
      >
        <Grid
          gridDefinition={[
            {
              colspan: { default: 6, xxs: 4, xs: 4, s: 3, m: 2, l: 2, xl: 2 },
            },
            {
              colspan: { default: 6, xxs: 4, xs: 4, s: 3, m: 2, l: 2, xl: 2 },
            },
            {
              colspan: { default: 6, xxs: 4, xs: 4, s: 3, m: 2, l: 2, xl: 2 },
            },
          ]}
        >
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
