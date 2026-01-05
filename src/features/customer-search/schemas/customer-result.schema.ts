import z from "zod/v4";

export const CustomerResultSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string(),
  status: z.enum(["client", "prospect"]).nullable(),
  taxCode: z.string().nullable(),
  residenceProvince: z.string().nullable(),
  birthDate: z.string().nullable(),
  gender: z.enum(["F", "M"]).nullable(),
  birthPlace: z.string().nullable(),
  primaryPhone: z.string().nullable(),
  // secondaryPhone: z.string().nullable(),
  // contactPreference: z
  //   .enum(["email", "primaryPhone", "secondaryPhone"])
  //   .nullable(),
  // email: z.string().nullable(),
  // residenceAddress: z.string().nullable(),
  // occupation: z.string().nullable(),
  // occupationSector: z.string().nullable(),
  // livingArrangement: z
  //   .enum(["alone", "with_family", "with_partner", "with_roommates"])
  //   .nullable(),
  // isNonLifeClient: z.boolean().nullable(),
  // isLifeClient: z.boolean().nullable(),
});

export type CustomerResult = z.infer<typeof CustomerResultSchema>;
