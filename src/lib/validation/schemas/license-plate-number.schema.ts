import z from "zod/v4";

// Accepts most international license plate number formats
// - Letters (A-Z)
// - Digits (0-9)
// - Length between 2 and 15 chars (covers almost all countries)
// - Common blank spaces and hyphens
const LICENSE_PLATE_REGEX = /^[A-Z0-9]([A-Z0-9\s-]*[A-Z0-9])?$/i;

export const licensePlateSchema = z
  .string()
  .trim()
  .toUpperCase()
  .max(15, "Must be at most 15 characters")
  .regex(
    LICENSE_PLATE_REGEX,
    "Only letters, numbers, spaces and hyphens allowed",
  )
  .transform((val) => val.replace(/\s+/g, " "))
  .refine((val) => val.length >= 2, {
    message: "Must be at least 2 characters",
  });

// // OPTIONAL optional - for when the field is not required
export const licensePlateOptionalSchema = z
  .string()
  .transform((val) => val.trim())
  .transform((val) => (val === "" ? undefined : val))
  .pipe(licensePlateSchema.optional());
