import z from "zod/v4";

export const CustomerContactSchema = z.object({
  id: z.string(),
  contactId: z.string(),
  channel: z.enum([
    "VOICE_INBOUND",
    "VOICE_OUTBOUND",
    "CHAT",
    "SMS",
    "EMAIL",
    "VIDEOCALL",
  ]),
  startDateTime: z.string(),
  endDateTime: z.string(),
  duration: z.number(),
  macro: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  agent: z.string().nullable().optional(),
  contactNotes: z.array(z.string()).nullable().optional(),
});

export type CustomerContact = z.infer<typeof CustomerContactSchema>;

export const CustomerContactsResponseSchema = z.object({
  data: z.array(CustomerContactSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export type CustomerContactsResponse = z.infer<
  typeof CustomerContactsResponseSchema
>;
