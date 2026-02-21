import { createContext } from "react";

/**
 * The shape of the layout context value.
 *
 * Contains measurements and layout-related data that can be accessed
 * by any component within the LayoutProvider tree.
 *
 * @remarks
 * This interface is designed to be extensible. Add new properties here
 * as you need to track additional layout measurements throughout your app.
 *
 * @example
 * ```tsx
 * // Current usage
 * const { headerHeight } = useLayoutContext();
 *
 * // Future extensibility
 * const { headerHeight, footerHeight, sidebarWidth } = useLayoutContext();
 * ```
 */
export interface LayoutContextType {
  /**
   * The current height of the app header in pixels.
   *
   * Tracks the height of the element with id `"app-header"`.
   * Updates automatically when the header resizes due to:
   * - Viewport size changes
   * - Responsive breakpoints
   * - Content changes
   * - CSS transitions/animations
   *
   * @example
   * ```tsx
   * // Use with sticky elements
   * <Table
   *   stickyHeader
   *   stickyHeaderVerticalOffset={headerHeight}
   * />
   * ```
   *
   * @example
   * ```tsx
   * // Use for positioning
   * <div style={{ marginTop: headerHeight }}>
   *   Content below header
   * </div>
   * ```
   */
  headerHeight: number;
}

/**
 * React Context for sharing layout measurements across the application.
 *
 * This context should not be used directly. Instead, use the `useLayoutContext`
 * hook which provides the context value with proper error handling.
 *
 * @internal
 *
 * @see {@link LayoutProvider} - Provider component that supplies the context value
 * @see {@link useLayoutContext} - Hook to consume this context safely
 *
 * @example
 * ```tsx
 * // Don't use directly
 * const context = useContext(LayoutContext);
 *
 * // Use the hook instead
 * const { headerHeight } = useLayoutContext();
 * ```
 */
export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined
);
