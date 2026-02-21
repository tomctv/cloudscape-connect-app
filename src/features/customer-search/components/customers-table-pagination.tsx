import { Pagination } from "@cloudscape-design/components";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

interface CustomersTablePaginationProps {
  disabled?: boolean;
  totalItems: number;
}

const routeApi = getRouteApi("/customers/search");

export const CustomersTablePagination: React.FC<
  CustomersTablePaginationProps
> = ({ disabled, totalItems }) => {
  const routeSearch = routeApi.useSearch();
  const navigate = useNavigate({ from: "/customers/search" });

  const currentPage = Math.floor(routeSearch.offset / routeSearch.limit) + 1;
  const totalPages = Math.ceil(totalItems / routeSearch.limit);

  return (
    <Pagination
      disabled={disabled}
      currentPageIndex={currentPage}
      pagesCount={totalPages}
      onChange={({ detail }) => {
        navigate({
          search: (prev) => ({
            ...prev,
            offset: (detail.currentPageIndex - 1) * routeSearch.limit,
          }),
          replace: true,
        });
      }}
    />
  );
};
