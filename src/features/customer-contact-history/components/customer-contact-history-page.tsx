import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type DateRangePickerProps } from "@cloudscape-design/components";
import { subDays, subMonths, subYears, format } from "date-fns";
import { customerContactsQueryOptions } from "../api/query-options";
import { ContactHistoryTable } from "./contact-history-table.tsx";
import type { ContactChannelOption } from "@/components/contact-channel-select";
import type { ContactChannel } from "@/lib/validation";
import { TableHeader } from "./contact-history-table.tsx/table-header.tsx";

const routeApi = getRouteApi("/customers/$customerId/contacts");

function resolveToAbsoluteDates(range: DateRangePickerProps.Value): {
  startDate: string;
  endDate: string;
} {
  if (range.type === "absolute") {
    return { startDate: range.startDate, endDate: range.endDate };
  }

  const end = new Date();
  let start: Date;

  switch (range.unit) {
    case "day":
      start = subDays(end, range.amount);
      break;
    case "month":
      start = subMonths(end, range.amount);
      break;
    case "year":
      start = subYears(end, range.amount);
      break;
    default:
      start = subDays(end, range.amount);
  }

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
  };
}

export const CustomerContactHistoryPage: React.FC = () => {
  const { customerId } = routeApi.useParams();
  const {
    startDate,
    endDate,
    channel,
    q: filteringText = "",
  } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const { data, isLoading, isError, refetch } = useQuery(
    customerContactsQueryOptions({ customerId, startDate, endDate }),
  );

  const selectedDateRange: DateRangePickerProps.Value | null =
    startDate && endDate ? { type: "absolute", startDate, endDate } : null;

  const selectedChannel: ContactChannelOption | null = channel
    ? { value: channel as ContactChannel }
    : { value: "ALL" };

  const handleDateRangeChange = (value: DateRangePickerProps.Value | null) => {
    if (!value) {
      void navigate({
        search: (prev) => ({
          ...prev,
          startDate: undefined,
          endDate: undefined,
        }),
      });
      return;
    }
    const { startDate: resolvedStart, endDate: resolvedEnd } =
      resolveToAbsoluteDates(value);
    void navigate({
      search: (prev) => ({
        ...prev,
        startDate: resolvedStart,
        endDate: resolvedEnd,
      }),
    });
  };

  const handleChannelChange = (option: ContactChannelOption) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        channel: option.value === "ALL" ? undefined : option.value,
      }),
    });
  };

  const handleFilteringTextChange = (text: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: text || undefined }),
    });
  };

  const handleClearFilters = () => {
    void navigate({
      search: (prev) => ({ ...prev, q: undefined, channel: undefined }),
    });
  };

  return (
    <ContactHistoryTable
      header={<TableHeader totalItemsCount={data?.length} />}
      isLoading={isLoading}
      isError={isError}
      retryFn={refetch}
      contacts={data}
      filteringText={filteringText}
      onFilteringTextChange={handleFilteringTextChange}
      selectedChannel={selectedChannel}
      onChannelChange={handleChannelChange}
      selectedDateRange={selectedDateRange}
      onDateRangeChange={handleDateRangeChange}
      onClearFilters={handleClearFilters}
    />
  );
};
