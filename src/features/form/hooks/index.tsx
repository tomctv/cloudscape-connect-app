import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { fieldContext, formContext } from "../contexts/form-context.tsx";

const TextField = lazy(() => import("../components/text-field.tsx"));
const EmailField = lazy(() => import("../components/email-field.tsx"));
const TaxCodeField = lazy(() => import("../components/tax-code-field.tsx"));
const DateField = lazy(() => import("../components/date-field.tsx"));
const PhoneNumberField = lazy(
  () => import("../components/phone-number-field.tsx"),
);

const SearchButton = lazy(() => import("../components/search-button.tsx"));
const ClearFormButton = lazy(
  () => import("../components/clear-form-button.tsx"),
);

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    PhoneNumberField,
    EmailField,
    TaxCodeField,
    DateField,
    TextField,
  },
  formComponents: {
    SearchButton,
    ClearFormButton,
  },
  fieldContext,
  formContext,
});
