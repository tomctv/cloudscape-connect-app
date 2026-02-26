import {
  Button,
  Header,
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
import { useState } from "react";
import { TableFilter } from "./table-filter";

interface ContactHistoryTableProps {
  contacts: CustomerContact[] | null | undefined;
}

const SEARCHABLE_FIELDS = [
  "channel",
  "macro",
  "reason",
  "agent",
] as const satisfies (keyof CustomerContact)[];

export const ContactHistoryTable: React.FC<ContactHistoryTableProps> = ({
  contacts,
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
          { id: "macro", visible: true },
          { id: "reason", visible: true },
          { id: "agent", visible: true },
        ],
      },
    );

  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRangePickerProps.Value | null>(null);
  const [selectedChannel, setSelectedChannel] =
    useState<ContactChannelOption | null>({ value: "ALL" });

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(contacts ?? [], {
    filtering: {
      empty: <EmptyState title="No contacts" />,
      noMatch: (
        <EmptyState
          title="No matches"
          action={
            // eslint-disable-next-line react-hooks/immutability
            <Button onClick={() => actions.setFiltering("")}>
              Clear filter
            </Button>
          }
        />
      ),
      filteringFunction: (item, filteringText) => {
        const matchesText = SEARCHABLE_FIELDS.some((field) =>
          String(item[field] || "")
            .toLowerCase()
            .includes(filteringText.toLowerCase()),
        );

        const matchesChannel =
          selectedChannel?.value === "ALL"
            ? true
            : item.channel === selectedChannel?.value;

        return matchesText && matchesChannel;
      },
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  });

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
      header={
        <Header counter={contacts && `(${contacts?.length})`}>
          Contact history
        </Header>
      }
      {...collectionProps}
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
          header: "Start datetime",
          cell: (item) =>
            item.startDateTime
              ? format(new Date(item.startDateTime), "yyyy/MM/dd, HH:mm")
              : "-",
        },
        {
          id: "endDateTime",
          header: "End datetime",
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
          id: "macro",
          header: "Macro reason",
          cell: (item) => item.macro || "-",
        },
        {
          id: "reason",
          header: "Reason",
          cell: (item) => item.reason || "-",
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
          onDateRangeChange={setSelectedDateRange}
          filteringText={filterProps.filteringText}
          onFilterTextChange={filterProps.onChange}
          selectedChannel={selectedChannel}
          onChannelChange={(selectedOption) =>
            setSelectedChannel(selectedOption)
          }
          disabled={filterProps.disabled}
          filteredItemsCount={filteredItemsCount}
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
                label: "Start datetime",
                alwaysVisible: true,
              },
              {
                id: "endDateTime",
                label: "End datetime",
              },
              {
                id: "duration",
                label: "Duration",
              },
              {
                id: "macro",
                label: "Macro",
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
