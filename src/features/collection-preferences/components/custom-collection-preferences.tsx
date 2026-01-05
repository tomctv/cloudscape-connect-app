import {
  CollectionPreferences,
  type CollectionPreferencesProps,
} from "@cloudscape-design/components";
import type {
  CustomContentDisplayPreference,
  CustomPreferences,
} from "../types/interfaces";

/**
 * Props for the CustomCollectionPreferences component.
 *
 * @template T - The data type for your collection items
 * @template K - The type of custom preference value
 */
interface CustomCollectionPreferencesProps<T, K> {
  /** Title displayed at the top of the preferences modal */
  title?: string;

  /** Label for the confirm button */
  confirmLabel?: string;

  /** Label for the cancel button */
  cancelLabel?: string;

  /** ARIA label for the close button (accessibility) */
  closeAriaLabel?: string;

  /** Current preferences state (typically from `useCollectionPreferences` hook) */
  preferences: CustomPreferences<T, K>;

  /**
   * Callback invoked when user confirms their preference changes.
   * Receives the updated preferences object.
   */
  onConfirm: (preferences: CustomPreferences<T, K>) => void;

  /**
   * Optional callback invoked when user cancels preference changes.
   * If not provided, modal will simply close without additional actions.
   */
  onCancel?: () => void;

  /** If true, the preferences trigger button will be disabled */
  disabled?: boolean;

  /** Optional content to display before the preference controls */
  contentBefore?: React.ReactNode;

  /**
   * Render function for custom preference UI.
   * Receives the current custom value and a setter function.
   *
   * @example
   * ```typescript
   * customPreference={(value, setValue) => (
   *   <Toggle
   *     checked={value}
   *     onChange={({ detail }) => setValue(detail.checked)}
   *   >
   *     Advanced mode
   *   </Toggle>
   * )}
   * ```
   */
  customPreference?: (
    customValue: K,
    setCustomValue: React.Dispatch<K>
  ) => React.ReactNode;

  /**
   * Array of available page size options.
   * If provided, displays a page size selector in preferences.
   *
   * @example [10, 20, 50, 100]
   */
  pageSizeValues?: number[];

  /** If true, shows a toggle for wrapping text in table cells */
  showWrapLinesPreference?: boolean;

  /** If true, shows a toggle for alternating shaded rows */
  showStripedRowsPreference?: boolean;

  /** If true, shows options for table content density (compact/comfortable) */
  showContentDensityPreference?: boolean;

  /** If true, shows options for sticking first column(s) during horizontal scroll */
  showStickFirstColumnPreference?: boolean;

  /** If true, shows option for sticking last column during horizontal scroll */
  showStickLastColumnPreference?: boolean;

  /**
   * Configuration for which content sections are visible.
   * Uses CloudScape's standard VisibleContentPreference interface.
   */
  visibleContentPreference?: CollectionPreferencesProps.VisibleContentPreference;

  /**
   * Type-safe configuration for column visibility preferences.
   * Defines which columns can be shown/hidden and their properties.
   */
  contentDisplayPreference?: CustomContentDisplayPreference<T>;
}

/**
 * A type-safe wrapper around CloudScape's CollectionPreferences component.
 *
 * This component provides a preferences modal for customizing table/collection display
 * settings with full TypeScript support. It ensures that all column IDs match the
 * properties of your data type, preventing runtime errors from invalid column references.
 *
 * @template T - The data type for your collection items (e.g., User, Product, Customer)
 * @template K - The type of custom preference value (e.g., boolean, string)
 *
 * @example
 * // Basic usage with product table
 * interface Product {
 *   id: string;
 *   name: string;
 *   price: number;
 *   category: string;
 *   stock: number;
 * }
 *
 * const { preferences, setPreferences } = useCollectionPreferences<Product>(
 *   "products",
 *   {
 *     pageSize: 20,
 *     contentDisplay: [
 *       { id: "name", visible: true },
 *       { id: "price", visible: true }
 *     ]
 *   }
 * );
 *
 * <CustomCollectionPreferences
 *   preferences={preferences}
 *   onConfirm={setPreferences}
 *   pageSizeValues={[10, 20, 50, 100]}
 *   showWrapLinesPreference
 *   showStripedRowsPreference
 *   contentDisplayPreference={{
 *     title: "Column preferences",
 *     description: "Customize which columns to display",
 *     options: [
 *       { id: "name", label: "Product Name", alwaysVisible: true },
 *       { id: "price", label: "Price" },
 *       { id: "category", label: "Category" },
 *       { id: "stock", label: "Stock Level" }
 *     ]
 *   }}
 * />
 *
 * @example
 * // With custom preference (advanced mode toggle)
 * interface Customer {
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 * }
 *
 * const { preferences, setPreferences } = useCollectionPreferences<Customer>(
 *   "customers",
 *   { custom: false }
 * );
 *
 * <CustomCollectionPreferences
 *   preferences={preferences}
 *   onConfirm={setPreferences}
 *   customPreference={(value, setValue) => (
 *     <Toggle
 *       checked={value}
 *       onChange={({ detail }) => setValue(detail.checked)}
 *     >
 *       Show advanced filters
 *     </Toggle>
 *   )}
 *   contentDisplayPreference={{
 *     options: [
 *       { id: "firstName", label: "First Name" },
 *       { id: "lastName", label: "Last Name" },
 *       { id: "email", label: "Email" }
 *     ]
 *   }}
 * />
 */
export function CustomCollectionPreferences<T, K>({
  title = "Preferences",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  closeAriaLabel = "Cancel",
  preferences,
  onConfirm,
  onCancel,
  disabled,
  contentBefore,
  customPreference,
  pageSizeValues,
  showWrapLinesPreference,
  showStripedRowsPreference,
  showContentDensityPreference,
  showStickFirstColumnPreference,
  showStickLastColumnPreference,
  visibleContentPreference,
  contentDisplayPreference,
}: CustomCollectionPreferencesProps<T, K>) {
  return (
    <CollectionPreferences
      title={title}
      contentBefore={contentBefore}
      disabled={disabled}
      customPreference={customPreference}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      closeAriaLabel={closeAriaLabel}
      onConfirm={({ detail }) => onConfirm(detail as CustomPreferences<T, K>)}
      onCancel={onCancel}
      preferences={preferences}
      pageSizePreference={
        pageSizeValues && {
          title: "Page size",
          options: pageSizeValues.map((value) => ({
            value,
            label: `${value} items`,
          })),
        }
      }
      wrapLinesPreference={showWrapLinesPreference ? {} : undefined}
      stripedRowsPreference={showStripedRowsPreference ? {} : undefined}
      contentDensityPreference={showContentDensityPreference ? {} : undefined}
      visibleContentPreference={visibleContentPreference}
      contentDisplayPreference={contentDisplayPreference}
      stickyColumnsPreference={{
        firstColumns: showStickFirstColumnPreference
          ? {
              title: "Stick first column(s)",
              description:
                "Keep the first column(s) visible while horizontally scrolling the table content.",
              options: [
                { label: "None", value: 0 },
                { label: "First column", value: 1 },
                { label: "First two columns", value: 2 },
              ],
            }
          : undefined,
        lastColumns: showStickLastColumnPreference
          ? {
              title: "Stick last column",
              description:
                "Keep the last column visible while horizontally scrolling the table content.",
              options: [
                { label: "None", value: 0 },
                { label: "Last column", value: 1 },
              ],
            }
          : undefined,
      }}
    />
  );
}
