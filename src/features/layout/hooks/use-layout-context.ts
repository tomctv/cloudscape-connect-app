import { useContext } from "react";
import { LayoutContext } from "../context/layout-context";

/**
 * Custom hook to access layout measurements from the LayoutContext.
 *
 * This hook provides access to measurements of key layout elements (like headers,
 * footers, sidebars) that are tracked by the `LayoutProvider`. It must be used within
 * a component that is wrapped by `LayoutProvider`.
 *
 * @returns The layout context value containing current measurements
 * @throws {Error} If used outside of a LayoutProvider
 *
 * @example
 * ```tsx
 * // Basic usage in a component
 * import { useLayoutContext } from '@/features/layout';
 *
 * function MyComponent() {
 *   const { headerHeight } = useLayoutContext();
 *
 *   return (
 *     <div style={{ paddingTop: headerHeight }}>
 *       Content positioned below header
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - The hook automatically re-renders the component when layout measurements change
 * - Measurements update in real-time as elements resize (viewport changes, breakpoints, etc.)
 * - Always destructure only the values you need to avoid unnecessary re-renders
 * - The error thrown when used outside `LayoutProvider` helps catch setup mistakes early
 *
 * @see {@link LayoutProvider} - Provider that must wrap components using this hook
 * @see {@link LayoutContextType} - Type definition for the returned context value
 * @see {@link useElementHeight} - Hook for measuring individual elements directly
 */
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutContext must be used within LayoutProvider");
  }
  return context;
};
