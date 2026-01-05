import { useState } from "react";
import type { CustomPreferences } from "../types/interfaces";

/**
 * A type-safe React hook for managing CloudScape collection preferences state.
 *
 * This hook provides a stateful way to manage table/collection preferences with
 * full TypeScript support. It ensures that content display IDs match the properties
 * of your data type, preventing typos and invalid column references.
 *
 * @template T - The data type for your collection items (e.g., User, Product, Customer)
 * @template K - The type of custom preference value, defaults to `unknown`
 *
 * @param {string} _id - Unique identifier for these preferences (reserved for future persistence feature)
 * @param {CustomPreferences<T, K>} [defaultPreferences] - Initial preferences configuration
 *
 * @returns An object containing:
 *  - `preferences`: Current preferences state
 *  - `setPreferences`: Function to update preferences
 *
 * @example
 * // Basic usage with type inference
 * interface Product {
 *   id: string;
 *   name: string;
 *   price: number;
 *   stock: number;
 * }
 *
 * const { preferences, setPreferences } = useCollectionPreferences<Product>(
 *   "product-table-preferences",
 *   {
 *     pageSize: 20,
 *     contentDisplay: [
 *       { id: "name", visible: true },
 *       { id: "price", visible: true },
 *       { id: "stock", visible: false }
 *     ]
 *   }
 * );
 *
 * @example
 * // With custom preference (boolean)
 * interface Customer {
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 * }
 *
 * const { preferences, setPreferences } = useCollectionPreferences(
 *   "customer-table-preferences",
 *   {
 *     custom: false, // K is inferred as boolean
 *     contentDisplay: [
 *       { id: "firstName", visible: true },
 *       { id: "email", visible: true }
 *     ]
 *   }
 * );
 *
 * @example
 * // Without default preferences
 * const { preferences, setPreferences } = useCollectionPreferences<Product>(
 *   "product-table-preferences"
 * );
 *
 * // Later, update preferences
 * setPreferences({
 *   pageSize: 50,
 *   contentDisplay: [{ id: "name", visible: true }]
 * });
 */
export function useCollectionPreferences<T, K = unknown>(
  _id: string, // TODO: might use it later for preference persistence
  defaultPreferences?: CustomPreferences<T, K>
) {
  const [preferences, setPreferences] = useState<CustomPreferences<T, K>>(
    defaultPreferences ?? {}
  );

  return { preferences, setPreferences };
}
