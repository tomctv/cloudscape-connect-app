import type { CustomerContact } from "../schemas/customer-contact.schema.ts";
import { ContactHistoryTable } from "./contact-history-table.tsx";

export const CustomerContactHistoryPage: React.FC = () => {
  const getMockChannel = (index: number): CustomerContact["channel"] => {
    return index % 13 === 0
      ? "VIDEOCALL"
      : index % 11 === 0
        ? "SMS"
        : index % 7 === 0
          ? "CHAT"
          : index % 5 == 0
            ? "EMAIL"
            : index % 3 === 0
              ? "VOICE_OUTBOUND"
              : "VOICE_INBOUND";
  };

  const contacts: CustomerContact[] = Array.from(
    { length: 75 },
    (_a, index) => ({
      id: `${1 + index}`,
      channel: getMockChannel(index),
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      contactId: `contact${1 + index}`,
      duration: 1000000 + index * 1500,
      agent: `agent${index + 1}`,
      macro: `Macro reason ${index + 1}`,
      reason: `Contact reason ${index + 1}`,
      subject: index % 2 === 0 ? `Policy inquiry` : null,
      contactNotes: null,
    }),
  );
  return <ContactHistoryTable contacts={contacts} />;
};
