import z from "zod/v4";

export const ContactChannelSchema = z.enum([
  "VOICE_INBOUND",
  "VOICE_OUTBOUND",
  "CHAT",
  "SMS",
  "EMAIL",
  "VIDEOCALL",
]);

export type ContactChannel = z.infer<typeof ContactChannelSchema>;
