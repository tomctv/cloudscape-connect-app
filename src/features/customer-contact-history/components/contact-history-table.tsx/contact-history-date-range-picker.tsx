import {
  DateRangePicker,
  type DateRangePickerProps,
} from "@cloudscape-design/components";
import type { Dispatch } from "react";

interface ContactHistoryDateRangePickerProps {
  value: DateRangePickerProps.Value | null;
  disabled?: boolean;
  onChange: Dispatch<DateRangePickerProps.Value | null>;
}

export const ContactHistoryDateRangePicker: React.FC<
  ContactHistoryDateRangePickerProps
> = ({ value, disabled, onChange }) => {
  return (
    <DateRangePicker
      placeholder="Filter by date range"
      onChange={({ detail }) => onChange(detail.value)}
      value={value}
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
    />
  );
};
