import { z } from "zod/v4";

/**
 * Creates a validator function for a single field of a Zod schema.
 *
 * @param schema - The complete Zod object schema
 * @param fieldName - The key of the field to validate
 * @returns A validator function compatible with the Standard Schema
 */
export function createZodFieldValidator<
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TField extends keyof z.infer<TSchema>,
>(schema: TSchema, fieldName: TField) {
  return ({ value }: { value: z.infer<TSchema>[TField] }) => {
    const result = schema
      .pick({ [fieldName]: true } as { [x: string]: true })
      .safeParse({ [fieldName]: value });

    if (!result.success) {
      return result.error.issues;
    }

    return undefined;
  };
}
