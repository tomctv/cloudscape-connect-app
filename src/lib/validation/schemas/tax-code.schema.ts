import z from "zod/v4";

// Regex for Italian fiscal code
// Format: 16 alphanumeric chars
// - 6 letters (last name)
// - 6 alphanumeric chars (name, year, month, day)
// - 4 chars (birth place + control char)
const ITALIAN_TAX_CODE_REGEX =
  /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;

export const taxCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(16, "Must be 16 characters")
  .regex(ITALIAN_TAX_CODE_REGEX, "Invalid tax code format");

// OPTIONAL optional - for when the field is not required
export const taxCodeOptionalSchema = taxCodeSchema
  .or(z.literal(""))
  .transform((val) => val || undefined)
  .optional();
