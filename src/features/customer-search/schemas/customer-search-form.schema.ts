import z from "zod/v4";
import { phoneNumberSchema, taxCodeOptionalSchema } from "@/lib/validation";

export const CustomerSearchContractorParamsSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "This field is required"),
  taxCode: taxCodeOptionalSchema,
  birthDate: z.string().trim().optional(),
  phoneNumber: phoneNumberSchema.optional(),
  email: z.email("Must be a valid email address").or(z.literal("")).optional(),
});

export type CustomerSearchContractorParams = z.infer<
  typeof CustomerSearchContractorParamsSchema
>;
