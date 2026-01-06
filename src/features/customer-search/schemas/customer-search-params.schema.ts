import z from "zod/v4";

export const CustomerSearchParamsSchema = z.object({
  mode: z
    .enum(["contractor", "quote", "policy"])
    .default("contractor")
    .catch("contractor"),
  limit: z.number().int().positive().optional().default(25).catch(25),
  offset: z.number().int().nonnegative().optional().default(0).catch(0),
  firstName: z.string().min(1).trim().optional(),
  lastName: z.string().min(1).trim().optional(),
  taxCode: z.string().trim().optional(),
  birthDate: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  email: z.email().optional(),
  quoteNumber: z.string().trim().optional(),
  licensePlateNumber: z.string().trim().optional(),
  subjectCode: z.string().trim().optional(),
  policyNumber: z.string().trim().optional(),
});

export type CustomerSearchParams = z.infer<typeof CustomerSearchParamsSchema>;
