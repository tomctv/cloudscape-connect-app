import { type CollectionPreferencesProps } from "@cloudscape-design/components";

/**
 * A type-safe content display item that extends CloudScape's ContentDisplayItem.
 *
 * @template T - The data type whose properties will be used as valid `id` values
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   email: string;
 *   age: number;
 * }
 *
 * const item: CustomContentDisplayItem<User> = {
 *   id: "name", // Only "name", "email", or "age" are valid
 *   visible: true
 * };
 * ```
 */
export interface CustomContentDisplayItem<T> extends Omit<
  CollectionPreferencesProps.ContentDisplayItem,
  "id"
> {
  /** The property key from type `T` that this item represents. Must be a string key. */
  id: Extract<keyof T, string>;
}

/**
 * Type-safe preferences object that extends CloudScape's Preferences interface.
 * Replaces the standard `contentDisplay` with a type-safe version.
 *
 * @template T - The data type for content display items
 * @template K - The type of the custom preference value (e.g., boolean, string)
 *
 * @example
 * ```typescript
 * interface Product {
 *   name: string;
 *   price: number;
 * }
 *
 * const prefs: CustomPreferences<Product, boolean> = {
 *   pageSize: 20,
 *   custom: false,
 *   contentDisplay: [
 *     { id: "name", visible: true }, // Only "name" or "price" are valid
 *     { id: "price", visible: true } // Only "name" or "price" are valid
 *   ]
 * };
 * ```
 */
export interface CustomPreferences<T, K> extends Omit<
  CollectionPreferencesProps.Preferences<K>,
  "contentDisplay"
> {
  /**
   * Array of content display items with type-safe `id` values.
   * Each `id` must correspond to a string property of type `T`.
   */
  contentDisplay?: ReadonlyArray<CustomContentDisplayItem<T>>;
}

/**
 * A type-safe content display option that extends CloudScape's ContentDisplayOption.
 * Used to define available columns/fields that can be shown or hidden.
 *
 * @template T - The data type whose properties will be used as valid `id` values
 *
 * @example
 * ```typescript
 * interface Customer {
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 * }
 *
 * const option: CustomContentDisplayOption<Customer> = {
 *   id: "firstName",  // Only "firstName", "lastName" or "email" are valid
 *   label: "First Name",
 *   alwaysVisible: false
 * };
 * ```
 */
export interface CustomContentDisplayOption<T> extends Omit<
  CollectionPreferencesProps.ContentDisplayOption,
  "id"
> {
  /** The property key from type `T` that this option represents. Must be a string key. */
  id: Extract<keyof T, string>;
}

/**
 * Type-safe content display preference configuration.
 * Defines which columns are available and their properties.
 *
 * @template T - The data type for content display options
 *
 * @example
 * ```typescript
 * interface Employee {
 *   name: string;
 *   department: string;
 *   salary: number;
 * }
 *
 * const displayPref: CustomContentDisplayPreference<Employee> = {
 *   title: "Column preferences",
 *   description: "Customize the visibility and order of the columns.",
 *   options: [
 *     { id: "name", label: "Name", alwaysVisible: true },
 *     { id: "department", label: "Department" },
 *     { id: "salary", label: "Salary" }
 *   ]
 * };
 * ```
 */
export interface CustomContentDisplayPreference<T> extends Omit<
  CollectionPreferencesProps.ContentDisplayPreference,
  "options"
> {
  /**
   * Array of available content display options with type-safe `id` values.
   * Each option represents a column or field that can be shown/hidden.
   */
  options: ReadonlyArray<CustomContentDisplayOption<T>>;
}
