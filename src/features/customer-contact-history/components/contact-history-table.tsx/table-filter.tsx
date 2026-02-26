import {
  ContactChannelSelect,
  type ContactChannelOption,
} from "@/components/contact-channel-select";
import {
  Box,
  DateRangePicker,
  TextFilter,
  type DateRangePickerProps,
  type TextFilterProps,
} from "@cloudscape-design/components";
import { spaceScaledXs } from "@cloudscape-design/design-tokens";
import type { Dispatch } from "react";
import styled from "styled-components";

interface TableFilterProps {
  disabled?: boolean;
  selectedDateRange: DateRangePickerProps.Value | null;
  onDateRangeChange: Dispatch<DateRangePickerProps.Value | null>;
  filteringText: string;
  onFilterTextChange: TextFilterProps["onChange"];
  selectedChannel: ContactChannelOption | null;
  onChannelChange: Dispatch<ContactChannelOption>;
  filteredItemsCount: number | undefined;
}

const TableFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spaceScaledXs};
`;

const TextFilterContainer = styled.div`
  max-width: 648px;
  width: 100%;
  flex-shrink: 1;
`;

export const TableFilter: React.FC<TableFilterProps> = ({
  disabled,
  selectedDateRange,
  onDateRangeChange,
  filteringText,
  onFilterTextChange,
  selectedChannel,
  onChannelChange,
  filteredItemsCount,
}) => {
  return (
    <TableFilterContainer>
      <DateRangePicker
        onChange={({ detail }) => onDateRangeChange(detail.value)}
        value={selectedDateRange}
        relativeOptions={[
          {
            key: "previous-3-months",
            amount: 3,
            unit: "month",
            type: "relative",
          },
          {
            key: "previous-6-months",
            amount: 6,
            unit: "month",
            type: "relative",
          },
          {
            key: "previous-1-year",
            amount: 1,
            unit: "year",
            type: "relative",
          },
        ]}
        customRelativeRangeUnits={["day", "month", "year"]}
        absoluteFormat="slashed"
        dateInputFormat="slashed"
        dateOnly
        disabled={disabled}
        isDateEnabled={(date) => new Date().getTime() > date.getTime()}
        dateDisabledReason={() => "You cannot search contacts in the future"}
        isValidRange={(range) => {
          if (!range) return { valid: true };

          if (range.type === "absolute") {
            const [startDateWithoutTime] = range.startDate.split("T");
            const [endDateWithoutTime] = range.endDate.split("T");
            if (!startDateWithoutTime || !endDateWithoutTime) {
              return {
                valid: false,
                errorMessage:
                  "The selected date range is incomplete. Select a start and end date for the date range.",
              };
            }
            if (
              new Date(range.startDate).getTime() -
                new Date(range.endDate).getTime() >
              0
            ) {
              return {
                valid: false,
                errorMessage:
                  "The selected date range is invalid. The start date must be before the end date.",
              };
            }
          }

          if (range.type === "relative" && range.amount < 1) {
            return {
              valid: false,
              errorMessage:
                "The selected date range is invalid. The duration must be a positive integer.",
            };
          }

          return { valid: true };
        }}
        placeholder="Filter by a date range"
      />

      <TextFilterContainer>
        <TextFilter
          disabled={disabled}
          filteringText={filteringText}
          onChange={onFilterTextChange}
          filteringAriaLabel="Filter contacts"
          filteringPlaceholder="Find contacts"
        />
      </TextFilterContainer>
      <ContactChannelSelect
        disabled={disabled}
        includeAllChannelsOption
        selectedOption={selectedChannel}
        onChange={onChannelChange}
      />
      {filteredItemsCount !== undefined &&
        (filteringText || selectedChannel?.value !== "ALL") && (
          <Box
            variant="span"
            padding={{ left: "xxs" }}
          >{`${filteredItemsCount} match${filteredItemsCount !== 1 ? "es" : ""}`}</Box>
        )}
    </TableFilterContainer>
  );
};
