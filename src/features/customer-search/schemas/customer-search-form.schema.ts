import z from "zod/v4";
import { isPossiblePhoneNumber } from "react-phone-number-input";

export const CustomerSearchContractorParamsSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "This field is required"),
  taxCode: z.string().trim().optional(),
  birthDate: z.string().trim().optional(),
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (value) => isPossiblePhoneNumber(value),
      "Must be a valid phone number",
    )
    .optional(),
  email: z.email("Must be a valid email address").optional(),
});

export type CustomerSearchContractorParams = z.infer<
  typeof CustomerSearchContractorParamsSchema
>;
