import { type PropsWithChildren } from "react";
import { LayoutContext } from "../context/layout-context";
import { useElementHeight } from "../hooks/use-element-height";

/**
 * Layout provider that makes layout measurements available throughout the application.
 *
 * This provider tracks the dimensions of key layout elements (like headers, footers, sidebars)
 * and makes them available to any component in the tree via the `useLayoutContext` hook.
 *
 * @example
 * ```tsx
 * // Wrap your app root with LayoutProvider
 * import { LayoutProvider } from '@/features/layout';
 *
 * function App() {
 *   return (
 *     <LayoutProvider>
 *       <AppNavigation />
 *       <MainContent />
 *     </LayoutProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Access layout measurements in any child component
 * import { useLayoutContext } from '@/features/layout';
 *
 * function MyTable() {
 *   const { headerHeight } = useLayoutContext();
 *
 *   return (
 *     <Table
 *       stickyHeader
 *       stickyHeaderVerticalOffset={headerHeight}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * - Must wrap the part of your component tree that needs access to layout measurements
 * - Should be placed high enough in the tree to wrap all components that need it,
 *   but after the elements being measured are rendered
 * - Currently tracks the height of the app header (element with id "app-header")
 * - Measurements update automatically when elements resize (responsive breakpoints, content changes, etc.)
 * - Uses a single ResizeObserver per measured element for optimal performance
 *
 * @see {@link useLayoutContext} - Hook to consume layout measurements
 * @see {@link useElementHeight} - Underlying hook for element measurements
 */
export const LayoutProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const headerHeight = useElementHeight("app-header");

  return (
    <LayoutContext.Provider value={{ headerHeight }}>
      {children}
    </LayoutContext.Provider>
  );
};
