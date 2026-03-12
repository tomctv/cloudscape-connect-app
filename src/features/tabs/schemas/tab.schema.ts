import z from "zod/v4";

/**
 * Supported tab types.
 * - "customer": a customer detail tab (unique per customerId)
 *
 * Future types might include "quote", "unknown-customer", etc.
 */
export const TabTypeSchema = z.enum(["customer"]);

export type TabType = z.infer<typeof TabTypeSchema>;

/**
 * Schema for a single tab in the tab bar.
 *
 * Tabs store only serializable data — no React elements or functions.
 * UI rendering (icons, labels, dismissible) is derived in the component layer.
 */
export const TabSchema = z.object({
  /** Unique tab identifier. For customer tabs, this equals the customerId. */
  id: z.string(),

  /** Tab category, used to determine rendering and behavior. */
  type: TabTypeSchema,

  /** Optional resource identifier associated with this tab (e.g., customerId). */
  resourceId: z.string().optional(),

  /** Display label shown in the tab bar (e.g., customer full name). */
  label: z.string(),

  /** The route path this tab navigates to (e.g., "/customers/12345678"). */
  route: z.string(),

  /** ISO timestamp of when the tab was last activated. */
  lastAccessedAt: z.string().datetime(),

  /** ISO timestamp of when the tab was first opened. */
  createdAt: z.string().datetime(),
});

export type Tab = z.infer<typeof TabSchema>;

/**
 * Schema for the persisted tabs state.
 * Validated on restore to handle corrupted or outdated data.
 */
export const TabsPersistedStateSchema = z.object({
  version: z.literal(1),
  tabs: z.array(TabSchema),
  activeTabId: z.string().nullable(),
});

export type TabsPersistedState = z.infer<typeof TabsPersistedStateSchema>;
