interface QuoteSearchFormProps {
  isLoading?: boolean;
}

export const QuoteSearchForm: React.FC<QuoteSearchFormProps> = ({
  isLoading,
}) => {
  return <div aria-disabled={isLoading}>Quote search form</div>;
};
