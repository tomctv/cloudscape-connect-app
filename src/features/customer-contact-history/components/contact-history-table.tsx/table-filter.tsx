import {
  ContactChannelSelect,
  type ContactChannelOption,
} from "@/components/contact-channel-select";
import {
  Grid,
  TextFilter,
  type DateRangePickerProps,
  type TextFilterProps,
} from "@cloudscape-design/components";
import type { Dispatch } from "react";
import styled from "styled-components";
import { ContactHistoryDateRangePicker } from "./contact-history-date-range-picker";

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

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  height: 100%;
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
    <Grid
      gridDefinition={[
        { colspan: { default: 6, xxs: 6, xs: 4, s: 3, m: 3, l: 3, xl: 3 } },
        { colspan: { default: 6, xxs: 6, xs: 4, s: 4, m: 4, l: 5, xl: 5 } },
        { colspan: { default: 6, xxs: 6, xs: 3, s: 3, m: 3, l: 2, xl: 2 } },
        { colspan: { default: 6, xxs: 6, xs: 6, s: 2, m: 2, l: 2, xl: 2 } },
      ]}
    >
      <FilterContainer>
        <ContactHistoryDateRangePicker
          value={selectedDateRange}
          onChange={onDateRangeChange}
          disabled={disabled}
        />
      </FilterContainer>

      <FilterContainer>
        <TextFilter
          disabled={disabled}
          filteringText={filteringText}
          onChange={onFilterTextChange}
          filteringAriaLabel="Filter contacts"
          filteringPlaceholder="Find contacts"
        />
      </FilterContainer>

      <FilterContainer>
        <ContactChannelSelect
          inlineLabelText="Channel"
          disabled={disabled}
          includeAllChannelsOption
          selectedOption={selectedChannel}
          onChange={onChannelChange}
        />
      </FilterContainer>

      <FilterContainer>
        {filteredItemsCount !== undefined &&
          (filteringText || selectedChannel?.value !== "ALL") && (
            <span
              style={{ paddingBottom: "6px" }}
            >{`${filteredItemsCount} match${filteredItemsCount !== 1 ? "es" : ""}`}</span>
          )}
      </FilterContainer>
    </Grid>
  );
};
