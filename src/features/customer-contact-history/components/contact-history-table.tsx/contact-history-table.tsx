import {
  Button,
  Pagination,
  Table,
  type DateRangePickerProps,
} from "@cloudscape-design/components";
import { format } from "date-fns";
import { type CustomerContact } from "../../schemas/customer-contact.schema";
import { useLayoutContext } from "@/features/layout/hooks/use-layout-context";
import { useCollectionPreferences } from "@/features/collection-preferences/hooks/use-collection-preferences";
import { CustomCollectionPreferences } from "@/features/collection-preferences/components/custom-collection-preferences";
import { useCollection } from "@cloudscape-design/collection-hooks";
import { EmptyState } from "@/components/empty-state";
import { ContactChannelDisplay } from "@/components/contact-channel-display";
import { type ContactChannelOption } from "@/components/contact-channel-select";
import { useMemo } from "react";

import { ContactReasonCellDisplay } from "./contact-reason-cell-display";
import { TableFilter } from "./table-filter";
import { ErrorState } from "@/components/error-state";

interface ContactHistoryTableProps {
  header?: React.ReactNode;
  // error?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  contacts: CustomerContact[] | null | undefined;
  filteringText: string;
  onFilteringTextChange: (text: string) => void;
  selectedChannel: ContactChannelOption | null;
  onChannelChange: (option: ContactChannelOption) => void;
  selectedDateRange: DateRangePickerProps.Value | null;
  onDateRangeChange: (value: DateRangePickerProps.Value | null) => void;
  onClearFilters: () => void;
  retryFn?: () => void;
}

const SEARCHABLE_FIELDS = [
  "channel",
  "macroReason",
  "reason",
  "subject",
  "agent",
] as const satisfies (keyof CustomerContact)[];

export const ContactHistoryTable: React.FC<ContactHistoryTableProps> = ({
  header,
  // error,
  isError,
  isLoading,
  contacts,
  onClearFilters,
  selectedDateRange,
  onDateRangeChange,
  filteringText,
  onFilteringTextChange,
  selectedChannel,
  onChannelChange,
  retryFn,
}) => {
  const { headerHeight } = useLayoutContext();

  const { preferences, setPreferences } =
    useCollectionPreferences<CustomerContact>(
      "customer-contact-history-table-preferences",
      {
        pageSize: 25,
        stickyColumns: { first: 2, last: 1 },
        contentDisplay: [
          { id: "channel", visible: true },
          { id: "startDateTime", visible: true },
          { id: "endDateTime", visible: true },
          { id: "duration", visible: true },
          { id: "macroReason", visible: true },
          { id: "reason", visible: true },
          { id: "agent", visible: true },
        ],
      },
    );

  const filteredContacts = useMemo(() => {
    const items = contacts ?? [];
    return items.filter((item) => {
      const matchesText =
        !filteringText ||
        SEARCHABLE_FIELDS.some((field) =>
          String(item[field] || "")
            .toLowerCase()
            .includes(filteringText.toLowerCase()),
        );
      const matchesChannel =
        !selectedChannel || selectedChannel.value === "ALL"
          ? true
          : item.channel === selectedChannel.value;
      return matchesText && matchesChannel;
    });
  }, [contacts, filteringText, selectedChannel]);

  const hasActiveFilter =
    !!filteringText || (selectedChannel?.value !== "ALL" && !!selectedChannel);

  const renderEmptyContent = () => {
    if (isError)
      return (
        <ErrorState
          title="Failed to fetch contacts"
          subtitle="The list of customer contacts could not be loaded due to a server error. Try again later."
          retryFn={retryFn}
        />
      );
    else if ((contacts ?? []).length === 0)
      return <EmptyState title="No contacts" />;
    else
      return (
        <EmptyState
          title="No matches"
          subtitle="No contacts match the selected filters"
          action={<Button onClick={onClearFilters}>Clear filter</Button>}
        />
      );
  };

  const { items, collectionProps, paginationProps } = useCollection(
    filteredContacts,
    {
      pagination: { pageSize: preferences.pageSize },
      sorting: {},
      selection: {},
    },
  );

  function formatDuration(start: Date, end: Date): string {
    const totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
  }

  return (
    <Table
      variant="full-page"
      stickyHeader
      stickyHeaderVerticalOffset={headerHeight + 52}
      enableKeyboardNavigation
      header={header}
      {...collectionProps}
      loading={isLoading}
      loadingText="Loading contacts"
      empty={renderEmptyContent()}
      items={items}
      trackBy="id"
      columnDefinitions={[
        {
          id: "channel",
          isRowHeader: true,
          header: "Channel",
          width: 170,
          minWidth: 170,
          cell: (item) => <ContactChannelDisplay channel={item.channel} />,
        },
        {
          id: "startDateTime",
          header: "Started at",
          cell: (item) =>
            item.startDateTime
              ? format(new Date(item.startDateTime), "yyyy/MM/dd, HH:mm")
              : "-",
        },
        {
          id: "endDateTime",
          header: "Ended at",
          cell: (item) =>
            item.endDateTime
              ? format(new Date(item.endDateTime), "yyyy/MM/dd, HH:mm")
              : "-",
        },
        {
          id: "duration",
          header: "Duration",
          cell: (item) => {
            if (!item.startDateTime || !item.endDateTime) return "-";

            return formatDuration(
              new Date(item.startDateTime),
              new Date(item.endDateTime),
            );
          },
        },
        {
          id: "macroReason",
          header: "Macro reason",
          cell: (item) => item.macroReason || "-",
        },
        {
          id: "reason",
          header: "Reason",
          cell: (item) => (
            <ContactReasonCellDisplay
              reason={item.reason}
              emailSubject={item.subject}
            />
          ),
        },
        {
          id: "agent",
          header: "Agent",
          cell: (item) => item.agent || "-",
        },
      ]}
      filter={
        <TableFilter
          selectedDateRange={selectedDateRange}
          onDateRangeChange={onDateRangeChange}
          filteringText={filteringText}
          onFilterTextChange={({ detail }) =>
            onFilteringTextChange(detail.filteringText)
          }
          selectedChannel={selectedChannel}
          onChannelChange={onChannelChange}
          filteredItemsCount={
            hasActiveFilter ? filteredContacts?.length : undefined
          }
        />
      }
      pagination={<Pagination {...paginationProps} />}
      columnDisplay={preferences.contentDisplay}
      stickyColumns={preferences.stickyColumns}
      wrapLines={preferences.wrapLines}
      contentDensity={preferences.contentDensity}
      stripedRows={preferences.stripedRows}
      preferences={
        <CustomCollectionPreferences
          preferences={preferences}
          onConfirm={(newPreferences) => setPreferences(newPreferences)}
          pageSizeValues={[25, 50, 100]}
          showWrapLinesPreference
          showStripedRowsPreference
          showContentDensityPreference
          showStickFirstColumnPreference
          showStickLastColumnPreference
          contentDisplayPreference={{
            options: [
              {
                id: "channel",
                label: "Channel",
                alwaysVisible: true,
              },
              {
                id: "startDateTime",
                label: "Started at",
                alwaysVisible: true,
              },
              {
                id: "endDateTime",
                label: "Ended at",
              },
              {
                id: "duration",
                label: "Duration",
              },
              {
                id: "macroReason",
                label: "Macro reason",
              },
              {
                id: "reason",
                label: "Reason",
              },
              {
                id: "agent",
                label: "Agent",
              },
            ],
          }}
        />
      }
    />
  );
};
