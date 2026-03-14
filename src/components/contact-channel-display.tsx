import type { ContactChannel } from "@/lib/validation";
import {
  Icon,
  SpaceBetween,
  type IconProps,
} from "@cloudscape-design/components";
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
  CircleQuestionMarkIcon,
  MailIcon,
  MessagesSquareIcon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
  VideoIcon,
} from "lucide-react";
import styled from "styled-components";

interface ContactChannelDisplayProps {
  channel: ContactChannel | null | undefined;
  disableColors?: boolean;
  colorOverride?: string;
  variant?: "icon-only" | "default";
  iconSize?: IconProps.Size;
}

const ContactChannelDisplayContainer = styled.div<{
  $channel: ContactChannelDisplayProps["channel"];
  $colorOverride: string | undefined;
}>`
  color: ${({ $channel, $colorOverride }) => {
    if ($colorOverride) return $colorOverride;

    switch ($channel) {
      case "VOICE_INBOUND":
        return colorChartsBlue1400;
      case "VOICE_OUTBOUND":
        return colorChartsBlue11200;
      case "CHAT":
        return colorChartsGreen500;
      case "SMS":
        return colorChartsYellow400;
      case "EMAIL":
        return colorChartsPurple500;
      case "VIDEOCALL":
        return colorChartsRed600;
      default:
        return "inherit";
    }
  }};
`;

export const ContactChannelDisplay: React.FC<ContactChannelDisplayProps> = ({
  channel,
  disableColors = false,
  colorOverride,
  variant = "default",
  iconSize = "normal",
}) => {
  if (channel === null || channel === undefined) return "-";

  const getIcon = (): React.ReactNode => {
    switch (channel) {
      case "VOICE_INBOUND":
        return <PhoneIncomingIcon />;
      case "VOICE_OUTBOUND":
        return <PhoneOutgoingIcon />;
      case "CHAT":
        return <BotIcon />;
      case "SMS":
        return <MessagesSquareIcon />;
      case "EMAIL":
        return <MailIcon />;
      case "VIDEOCALL":
        return <VideoIcon />;
      default:
        return <CircleQuestionMarkIcon />;
    }
  };

  const formatChannel = (): string => {
    switch (channel) {
      case "VOICE_INBOUND":
        return "Voice inbound";
      case "VOICE_OUTBOUND":
        return "Voice outbound";
      case "CHAT":
        return "Chat";
      case "SMS":
        return "SMS";
      case "EMAIL":
        return "Email";
      case "VIDEOCALL":
        return "Videocall";
      default:
        return "Unknown";
    }
  };

  return (
    <ContactChannelDisplayContainer
      $channel={disableColors || colorOverride ? undefined : channel}
      $colorOverride={colorOverride}
    >
      <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
        <Icon svg={getIcon()} size={iconSize} />
        {variant === "default" && <span>{formatChannel()}</span>}
      </SpaceBetween>
    </ContactChannelDisplayContainer>
  );
};
