interface PolicySearchFormProps {
  isLoading?: boolean;
}

export const PolicySearchForm: React.FC<PolicySearchFormProps> = ({
  isLoading,
}) => {
  return <div aria-disabled={isLoading}>Policy search form</div>;
};
