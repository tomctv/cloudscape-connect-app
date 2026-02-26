import z from "zod/v4";

export const CustomerSearchResultSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "number" ? String(value) : value)),
  firstName: z.string().nullable(),
  lastName: z.string(),
  status: z.enum(["client", "prospect"]).nullable(),
  taxCode: z.string().nullable(),
  residenceProvince: z.string().nullable(),
  birthDate: z.string().nullable(),
  gender: z.enum(["F", "M"]).nullable(),
  birthPlace: z.string().nullish(),
  primaryPhone: z.string().nullish(),
});

export type CustomerSearchResult = z.infer<typeof CustomerSearchResultSchema>;

export const CustomerSearchResponseSchema = z.object({
  data: z.array(CustomerSearchResultSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export type CustomerSearchResponse = z.infer<
  typeof CustomerSearchResponseSchema
>;
