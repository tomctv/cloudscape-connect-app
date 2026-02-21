import { Button } from "@cloudscape-design/components";
import { useFormContext } from "../contexts/form-context";

interface SearchButtonProps {
  label?: string;
  disabled?: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = (props) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [
        state.canSubmit,
        state.isSubmitting,
        state.isPristine,
        Object.values(state.values).some(
          (value) => value !== undefined && value !== null && value !== "",
        ),
      ]}
      children={([canSubmit, isSubmitting, isPristine, hasValues]) => (
        <Button
          formAction="submit"
          variant="primary"
          iconName="search"
          ariaLabel="Search"
          loading={props.disabled}
          loadingText={"Searching"}
          disabled={!canSubmit || (isPristine && !hasValues) || props.disabled}
          disabledReason={
            isPristine
              ? "Apply some filters before performing a search"
              : !canSubmit
                ? "Make sure you only use valid filters before performing the search"
                : undefined
          }
        >
          {isSubmitting || props.disabled
            ? "Searching"
            : props.label || "Search"}
        </Button>
      )}
    />
  );
};

export default SearchButton;
