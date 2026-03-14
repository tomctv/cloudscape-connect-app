import z from "zod/v4";

export const CustomerSchema = z.object({
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
  secondaryPhone: z.string().nullable(),
  contactPreference: z
    .enum(["email", "primaryPhone", "secondaryPhone"])
    .nullable(),
  email: z.string().nullable(),
  residenceAddress: z.string().nullable(),
  occupation: z.string().nullable(),
  occupationSector: z.string().nullable(),
  livingArrangement: z
    .enum(["alone", "with_family", "with_partner", "with_roommates"])
    .nullable(),
  isNonLifeClient: z.boolean().nullable(),
  isLifeClient: z.boolean().nullable(),
});

export type Customer = z.infer<typeof CustomerSchema>;
