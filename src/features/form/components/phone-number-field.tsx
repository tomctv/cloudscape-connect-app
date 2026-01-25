import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../contexts/form-context";
import { FormField } from "@cloudscape-design/components";
import { PhoneNumberInput } from "@/components/phone-number-input";
import type { Value } from "react-phone-number-input";

interface PhoneNumberFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  constraintText?: string;
  info?: React.ReactNode;
  disabled?: boolean;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = (props) => {
  const field = useFieldContext<Value | undefined>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <FormField
      label={props.label || "Phone number"}
      description={props.description}
      info={props.info}
      constraintText={!errors.length && props.constraintText}
      errorText={errors.map((error) => error?.message).join(", ")}
    >
      <PhoneNumberInput
        placeholder={props.placeholder || "Enter phone number"}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        disabled={props.disabled}
      />
    </FormField>
  );
};

export default PhoneNumberField;
