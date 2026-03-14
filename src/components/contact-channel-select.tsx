import { ContactChannelSchema, type ContactChannel } from "@/lib/validation";
import { Select, type SelectProps } from "@cloudscape-design/components";
import {
  colorChartsBlue11200,
  colorChartsBlue1400,
  colorChartsGreen500,
  colorChartsPurple500,
  colorChartsRed600,
  colorChartsYellow400,
} from "@cloudscape-design/design-tokens";
import {
  BotIcon,
  MailIcon,
  MessagesSquareIcon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
  VideoIcon,
} from "lucide-react";
import z from "zod/v4";

export type ContactChannelSelectValue = ContactChannel | "ALL";

export type ContactChannelOption = Omit<SelectProps.Option, "value"> & {
  value: ContactChannelSelectValue;
};

export interface ContactChannelSelectProps extends Omit<
  SelectProps,
  "options" | "selectedOption" | "onChange"
> {
  includeAllChannelsOption?: boolean;
  disableColors?: boolean;
  selectedOption: ContactChannelOption | null;
  onChange: (selectedOption: ContactChannelOption) => void;
}

const contactChannelSelectValueSchema = ContactChannelSchema.or(
  z.literal("ALL"),
);

export const ContactChannelSelect: React.FC<ContactChannelSelectProps> = ({
  selectedOption,
  includeAllChannelsOption = false,
  disableColors = false,
  onChange,
  ...rest
}) => {
  const options: ContactChannelOption[] = [
    ...(includeAllChannelsOption
      ? [
          {
            label: "All channels",
            value: "ALL",
          } as ContactChannelOption,
        ]
      : []),
    {
      label: "Voice inbound",
      value: "VOICE_INBOUND",
      iconSvg: (
        <PhoneIncomingIcon
          color={disableColors ? undefined : colorChartsBlue1400}
        />
      ),
    },
    {
      label: "Voice outbound",
      value: "VOICE_OUTBOUND",
      iconSvg: (
        <PhoneOutgoingIcon
          color={disableColors ? undefined : colorChartsBlue11200}
        />
      ),
    },
    {
      label: "Chat",
      value: "CHAT",
      iconSvg: (
        <BotIcon color={disableColors ? undefined : colorChartsGreen500} />
      ),
    },
    {
      label: "SMS",
      value: "SMS",
      iconSvg: (
        <MessagesSquareIcon
          color={disableColors ? undefined : colorChartsYellow400}
        />
      ),
    },
    {
      label: "Email",
      value: "EMAIL",
      iconSvg: (
        <MailIcon color={disableColors ? undefined : colorChartsPurple500} />
      ),
    },
    {
      label: "Videocall",
      value: "VIDEOCALL",
      iconSvg: (
        <VideoIcon color={disableColors ? undefined : colorChartsRed600} />
      ),
    },
  ];

  return (
    <Select
      {...rest}
      placeholder={rest.placeholder || "Select a channel"}
      selectedOption={
        options.find((option) => option.value === selectedOption?.value) ?? null
      }
      options={options}
      onChange={({ detail }) => {
        const result = contactChannelSelectValueSchema.safeParse(
          detail.selectedOption.value,
        );

        if (result.success) {
          onChange({
            ...detail.selectedOption,
            value: result.data,
          });
        }
      }}
      triggerVariant="option"
    />
  );
};
