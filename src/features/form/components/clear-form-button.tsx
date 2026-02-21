import { Button } from "@cloudscape-design/components";
import { useFormContext } from "../contexts/form-context";

interface ClearFormButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => Promise<void>;
}

const ClearFormButton: React.FC<ClearFormButtonProps> = (props) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [
        state.isPristine,
        Object.values(state.values).some(
          (value) => value !== undefined && value !== null && value !== "",
        ),
      ]}
      children={([isPristine, hasValues]) => (
        <Button
          formAction="none"
          iconName="remove"
          ariaLabel="Clear filters"
          disabled={props.disabled || (isPristine && !hasValues)}
          onClick={(event) => {
            event.preventDefault();
            if (props.onClick) props.onClick?.().then(() => form.reset());
            else form.reset();
          }}
        />
      )}
    />
  );
};

export default ClearFormButton;
