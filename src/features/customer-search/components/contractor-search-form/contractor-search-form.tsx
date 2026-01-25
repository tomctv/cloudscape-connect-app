import { useAppForm } from "@/features/form/hooks";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  CustomerSearchContractorParamsSchema,
  type CustomerSearchContractorParams,
} from "../../schemas/customer-search-form.schema";
import { revalidateLogic } from "@tanstack/react-form";
import { Box, Grid, SpaceBetween } from "@cloudscape-design/components";
import { createZodFieldValidator } from "@/lib/validation";

const routeApi = getRouteApi("/customers/search");

interface ContractorSearchFormProps {
  isLoading?: boolean;
}

export const ContractorSearchForm: React.FC<ContractorSearchFormProps> = ({
  isLoading,
}) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  const form = useAppForm({
    defaultValues: {
      firstName: routeSearch.firstName,
      lastName: routeSearch.lastName || "",
      taxCode: routeSearch.taxCode,
      birthDate: routeSearch.birthDate,
      phoneNumber: routeSearch.phoneNumber,
      email: routeSearch.email,
    } as CustomerSearchContractorParams,
    validators: {
      onSubmit: CustomerSearchContractorParamsSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      const result = CustomerSearchContractorParamsSchema.parse(value);

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
            name="firstName"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchContractorParamsSchema,
                "firstName",
              ),
            }}
            children={(field) => (
              <field.TextField
                label={"First name"}
                placeholder={"Enter first name"}
                disabled={isLoading}
              />
            )}
          />

          <form.AppField
            name="lastName"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchContractorParamsSchema,
                "lastName",
              ),
            }}
            children={(field) => (
              <field.TextField
                label={"Last name"}
                placeholder={"Enter last name"}
                disabled={isLoading}
              />
            )}
          />

          <form.AppField
            name="taxCode"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchContractorParamsSchema,
                "taxCode",
              ),
            }}
            children={(field) => <field.TaxCodeField disabled={isLoading} />}
          />

          <form.AppField
            name="birthDate"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchContractorParamsSchema,
                "birthDate",
              ),
            }}
            children={(field) => (
              <field.DateField label="Birth date" disabled={isLoading} />
            )}
          />

          <form.AppField
            name="phoneNumber"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchContractorParamsSchema,
                "phoneNumber",
              ),
            }}
            children={(field) => (
              <field.PhoneNumberField disabled={isLoading} />
            )}
          />

          <form.AppField
            name="email"
            validators={{
              onBlur: createZodFieldValidator(
                CustomerSearchContractorParamsSchema,
                "email",
              ),
            }}
            children={(field) => <field.EmailField disabled={isLoading} />}
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
