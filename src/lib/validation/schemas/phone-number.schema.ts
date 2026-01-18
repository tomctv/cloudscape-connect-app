import { isPossiblePhoneNumber } from "react-phone-number-input";
import z from "zod/v4";

export const phoneNumberSchema = z
  .string()
  .trim()
  .refine(
    (value) => isPossiblePhoneNumber(value),
    "Must be a valid phone number",
  );
