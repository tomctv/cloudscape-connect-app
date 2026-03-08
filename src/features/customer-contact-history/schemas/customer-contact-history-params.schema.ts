import z from "zod/v4";
import { ContactChannelSchema } from "@/lib/validation";

export const CustomerContactHistoryParamsSchema = z.object({
  startDate: z.string().optional().catch(undefined),
  endDate: z.string().optional().catch(undefined),
  channel: ContactChannelSchema.optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

export type CustomerContactHistoryParams = z.infer<
  typeof CustomerContactHistoryParamsSchema
>;
