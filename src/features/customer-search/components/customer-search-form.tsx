import {
  Box,
  Button,
  DateInput,
  FormField,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
  CustomerSearchContractorParamsSchema,
  type CustomerSearchContractorParams,
} from "../schemas/customer-search-form.schema";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { createZodFieldValidator } from "@/lib/validation";

const routeApi = getRouteApi("/customers/search");

interface CustomerSearchFormProps {
  isLoading?: boolean;
}

export const CustomerSearchForm: React.FC<CustomerSearchFormProps> = ({
  isLoading,
}) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  const form = useForm({
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
      <SpaceBetween direction="horizontal" size="xs" alignItems="start">
        <form.Field
          name="firstName"
          validators={{
            onBlur: createZodFieldValidator(
              CustomerSearchContractorParamsSchema,
              "firstName",
            ),
          }}
          children={(field) => (
            <>
              <FormField
                label={"First name"}
                errorText={field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              >
                <Input
                  inputMode="text"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.detail.value)}
                  placeholder="Type a first name"
                  disabled={isLoading}
                />
              </FormField>
            </>
          )}
        />

        <form.Field
          name="lastName"
          validators={{
            onBlur: createZodFieldValidator(
              CustomerSearchContractorParamsSchema,
              "lastName",
            ),
          }}
          children={(field) => (
            <>
              <FormField
                label={"Last name"}
                errorText={field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              >
                <Input
                  inputMode="text"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.detail.value)}
                  placeholder="Type a last name"
                  disabled={isLoading}
                />
              </FormField>
            </>
          )}
        />

        <form.Field
          name="taxCode"
          validators={{
            onBlur: createZodFieldValidator(
              CustomerSearchContractorParamsSchema,
              "taxCode",
            ),
          }}
          children={(field) => (
            <>
              <FormField
                label={"Tax code / VAT No."}
                errorText={field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              >
                <Input
                  inputMode="text"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.detail.value.toUpperCase())
                  }
                  placeholder="Type a tax code"
                  disabled={isLoading}
                />
              </FormField>
            </>
          )}
        />

        <form.Field
          name="birthDate"
          validators={{
            onBlur: createZodFieldValidator(
              CustomerSearchContractorParamsSchema,
              "birthDate",
            ),
          }}
          children={(field) => (
            <>
              <FormField
                label={"Birth date"}
                errorText={field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              >
                <DateInput
                  format="slashed"
                  inputFormat="slashed"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.detail.value)}
                  placeholder="YYYY/MM/DD"
                  disabled={isLoading}
                />
              </FormField>
            </>
          )}
        />

        <form.Field
          name="phoneNumber"
          validators={{
            onBlur: createZodFieldValidator(
              CustomerSearchContractorParamsSchema,
              "phoneNumber",
            ),
          }}
          children={(field) => (
            <>
              <FormField
                label={"Phone number"}
                errorText={field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              >
                <PhoneNumberInput
                  placeholder="Enter phone number"
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  disabled={isLoading}
                />
              </FormField>
            </>
          )}
        />

        <form.Field
          name="email"
          validators={{
            onBlur: createZodFieldValidator(
              CustomerSearchContractorParamsSchema,
              "email",
            ),
          }}
          children={(field) => (
            <>
              <FormField
                label={"Email"}
                errorText={field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              >
                <Input
                  inputMode="email"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.detail.value)}
                  placeholder="Type an email"
                  disabled={isLoading}
                />
              </FormField>
            </>
          )}
        />

        <Box margin={{ top: "xl" }}>
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isPristine,
              Object.values(state.values).some(
                (value) =>
                  value !== undefined && value !== null && value !== "",
              ),
            ]}
            children={([canSubmit, isSubmitting, isPristine, hasFilters]) => (
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  formAction="none"
                  iconName="remove"
                  ariaLabel="Clear filters"
                  disabled={isLoading || (isPristine && !hasFilters)}
                  onClick={(event) => {
                    event.preventDefault();

                    // Clear URL keeping only mode, limit and offset
                    navigate({
                      search: (prev) => ({
                        mode: prev.mode,
                        limit: prev.limit,
                        offset: 0,
                      }),
                      replace: true,
                    }).then(() => form.reset());
                  }}
                />
                <Button
                  formAction="submit"
                  variant="primary"
                  iconName="search"
                  ariaLabel="Search"
                  disabled={
                    !canSubmit || (isPristine && !hasFilters) || isLoading
                  }
                  disabledReason={
                    isPristine
                      ? "Apply some filters before performing a search"
                      : !canSubmit
                        ? "Make sure you only use valid filters before performing the search"
                        : undefined
                  }
                >
                  {isSubmitting ? "..." : isLoading ? "Searching" : "Search"}
                </Button>
              </SpaceBetween>
            )}
          />
        </Box>
      </SpaceBetween>
    </form>
  );
};
