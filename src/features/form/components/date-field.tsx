import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../contexts/form-context";
import { DateInput, FormField } from "@cloudscape-design/components";

interface DateFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  constraintText?: string;
  info?: React.ReactNode;
  disabled?: boolean;
}

const DateField: React.FC<DateFieldProps> = (props) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <FormField
      label={props.label}
      description={props.description}
      info={props.info}
      constraintText={!errors.length && props.constraintText}
      errorText={errors.map((error) => error?.message).join(", ")}
    >
      <DateInput
        format="slashed"
        inputFormat="slashed"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.detail.value)}
        placeholder={props.placeholder || "YYYY/MM/DD"}
        disabled={props.disabled}
      />
    </FormField>
  );
};

export default DateField;
