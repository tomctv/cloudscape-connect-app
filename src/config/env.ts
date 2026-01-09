import { z } from "zod";

/**
 * Environment variables schema with Zod validation
 * All env vars from Vite are strings, so we parse/transform them as needed
 */
const envSchema = z.object({
  // API Configuration
  VITE_API_BASE_URL: z
    .url("VITE_API_BASE_URL must be a valid URL")
    .min(1, "VITE_API_BASE_URL is required"),

  VITE_API_TIMEOUT: z
    .string()
    .default("30000")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("VITE_API_TIMEOUT must be a positive number")),

  // App Configuration
  MODE: z.enum(["development", "production", "test"]).default("development"),

  // Optional: Feature Flags
  // VITE_ENABLE_DEVTOOLS: z
  //   .string()
  //   .optional()
  //   .transform((val) => val === "true")
  //   .pipe(z.boolean())
  //   .default(false),
});

// Infer TypeScript type from Zod schema
export type Env = z.infer<typeof envSchema>;

/**
 * Validates and parses environment variables.
 *
 * If the validation fails, a detailed pretty-printed error is printed to the console.
 * @returns Type-safe env variables.
 */
function validateEnv() {
  const rawEnv: Record<string, unknown> = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
    MODE: import.meta.env.MODE,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        const received = rawEnv[String(issue.path[0])];
        const receivedInfo =
          received !== undefined ? ` (received: "${received}")` : "";
        return `  ${path}: ${issue.message}${receivedInfo}`;
      })
      .join("\n");

    const errorOutput = [
      "Environment validation failed:",
      "",
      formattedErrors,
      "",
      "Please check your .env file and ensure all required variables are correctly set.",
      "Example: VITE_API_BASE_URL=http://localhost:8000",
      "",
    ].join("\n");

    console.error(errorOutput);

    throw new Error(
      "Environment validation failed. Check console for details."
    );
  }

  return result.data;
}

// Validate and export typed environment
export const env = validateEnv();

// Log configuration in development
if (env.MODE === "development") {
  console.log("Environment configuration:", {
    apiBaseUrl: env.VITE_API_BASE_URL,
    apiTimeout: env.VITE_API_TIMEOUT,
    mode: env.MODE,
  });
}
