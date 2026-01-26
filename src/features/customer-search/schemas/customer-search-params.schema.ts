import {
  licensePlateSchema,
  phoneNumberSchema,
  taxCodeOptionalSchema,
} from "@/lib/validation";
import z from "zod/v4";

export const CustomerSearchParamsSchema = z.object({
  mode: z
    .enum(["contractor", "quote", "policy"])
    .default("contractor")
    .catch("contractor"),
  limit: z.number().int().positive().optional().default(25).catch(25),
  offset: z.number().int().nonnegative().optional().default(0).catch(0),
  firstName: z.string().trim().optional().catch(undefined),
  lastName: z.string().trim().min(1).optional().catch(undefined),
  taxCode: taxCodeOptionalSchema.catch(undefined),
  birthDate: z.string().trim().optional().catch(undefined),
  phoneNumber: phoneNumberSchema.optional().catch(undefined),
  email: z.email().optional().catch(undefined),
  quoteNumber: z.string().trim().optional().catch(undefined),
  licensePlateNumber: licensePlateSchema.optional().catch(undefined),
  subjectCode: z.string().trim().optional().catch(undefined),
  policyNumber: z.string().trim().optional().catch(undefined),
  compactHeader: z
    .preprocess((val) => {
      if (val === "true" || val === true || val === "") return true;
      else return undefined;
    }, z.boolean().optional())
    .optional(),
});

export type CustomerSearchParams = z.infer<typeof CustomerSearchParamsSchema>;

export const CustomerSearchApiParamsSchema = CustomerSearchParamsSchema.omit({
  compactHeader: true,
});

export type CustomerSearchApiParams = z.infer<
  typeof CustomerSearchApiParamsSchema
>;

export type CustomerSearchFormParams = Omit<
  CustomerSearchParams,
  "mode" | "limit" | "offset" | "compactHeader"
>;

export const customerSearchFormParamsKeys: readonly (keyof CustomerSearchFormParams)[] =
  [
    "firstName",
    "lastName",
    "taxCode",
    "birthDate",
    "phoneNumber",
    "email",
    "quoteNumber",
    "licensePlateNumber",
    "subjectCode",
    "policyNumber",
  ];
