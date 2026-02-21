import { useEffect, useState } from "react";

/**
 * Custom hook that tracks the height of a DOM element by its ID.
 *
 * This hook uses ResizeObserver to efficiently monitor element height changes,
 * making it reactive to viewport resizing, content changes, and CSS breakpoints.
 *
 * @param elementId - The HTML id attribute of the element to measure
 * @returns The current height of the element in pixels, or 0 if element not found
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const headerHeight = useElementHeight('app-header');
 *
 *   return (
 *     <div style={{ marginTop: headerHeight }}>
 *       Content below header
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Using with Cloudscape sticky header
 * const TablePage = () => {
 *   const headerHeight = useElementHeight('app-header');
 *
 *   return (
 *     <Table
 *       stickyHeader
 *       stickyHeaderVerticalOffset={headerHeight}
 *       // ... other props
 *     />
 *   );
 * };
 * ```
 *
 * @remarks
 * - The hook returns 0 if the element is not found in the DOM
 * - Height is recalculated automatically when:
 *   - The element is resized (via ResizeObserver)
 *   - The window is resized (fallback listener)
 *   - The elementId changes
 * - The hook cleans up all listeners and observers on unmount
 * - ResizeObserver provides better performance than polling or manual measurements
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver MDN}
 */
export const useElementHeight = (elementId: string) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const updateHeight = () => {
      setHeight(element.offsetHeight);
    };

    // Initial measurement
    updateHeight();

    // Listen for size changes
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    // Fallback for browser not supporting ResizeObserver
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [elementId]);

  return height;
};
