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
 * Semantic icon identifiers for tabs.
 * Mapped to actual icons (Cloudscape / Lucide) in the component layer.
 */
export const TabIconSchema = z.enum([
  "customer-default",
  "customer-client",
  "customer-prospect",
  "unknown-customer",
]);

export type TabIcon = z.infer<typeof TabIconSchema>;

/**
 * Tab status indicators for visual feedback in the tab bar.
 * - "active-contact": customer is currently on a call/chat/email
 * - "error": tab data failed to load or resource is unavailable
 * - "unsaved-changes": tab has pending unsaved modifications
 */
export const TabStatusSchema = z.enum([
  "active-contact",
  "error",
  "unsaved-changes",
]);

export type TabStatus = z.infer<typeof TabStatusSchema>;

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

  /** Semantic icon identifier, mapped to actual icons in the component layer. */
  icon: TabIconSchema.optional(),

  /** Whether the tab is pinned (pinned tabs stick to the left and can't be closed). */
  isPinned: z.boolean().optional(),

  /** Whether the tab can be dismissed. Defaults to true when undefined. */
  closable: z.boolean().optional(),

  /** Optional status indicator for visual feedback in the tab bar. */
  status: TabStatusSchema.optional(),

  /** Epoch timestamp (ms) of when the tab was last activated. */
  lastAccessedAt: z.number().int().nonnegative(),

  /** Epoch timestamp (ms) of when the tab was first opened. */
  createdAt: z.number().int().nonnegative(),
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
