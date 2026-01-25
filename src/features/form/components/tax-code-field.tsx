import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../contexts/form-context";
import { FormField, Input } from "@cloudscape-design/components";

interface TaxCodeFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  constraintText?: string;
  info?: React.ReactNode;
  disabled?: boolean;
}

const TaxCodeField: React.FC<TaxCodeFieldProps> = (props) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <FormField
      label={props.label || "Tax code / VAT No."}
      description={props.description}
      info={props.info}
      constraintText={!errors.length && props.constraintText}
      errorText={errors.map((error) => error?.message).join(", ")}
    >
      <Input
        inputMode="text"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.detail.value.toUpperCase())}
        placeholder={props.placeholder || "Enter tax code"}
        disabled={props.disabled}
      />
    </FormField>
  );
};

export default TaxCodeField;
