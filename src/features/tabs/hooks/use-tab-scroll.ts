import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import type { Tab } from "../schemas/tab.schema";

/** Minimum pixels between a tab edge and the scroll container edge. */
const SCROLL_MARGIN = 60;

/**
 * Scrolls the container so that the target tab is fully visible with a margin.
 * Uses getBoundingClientRect() instead of offsetLeft so that the position is
 * always calculated relative to the scroll container, regardless of how
 * intermediate ancestors are positioned in CSS.
 */
function scrollTabIntoView(
  el: HTMLDivElement,
  tabId: string,
  behavior: ScrollBehavior,
) {
  const tabEl = el.querySelector<HTMLElement>(`[data-tab-id="${tabId}"]`);
  if (!tabEl) return;

  const containerRect = el.getBoundingClientRect();
  const tabRect = tabEl.getBoundingClientRect();

  // Convert viewport-relative positions to scroll-coordinate positions
  const tabLeft = tabRect.left - containerRect.left + el.scrollLeft;
  const tabRight = tabRect.right - containerRect.left + el.scrollLeft;
  const containerLeft = el.scrollLeft;
  const containerRight = containerLeft + el.clientWidth;

  if (tabLeft - SCROLL_MARGIN < containerLeft) {
    el.scrollTo({ left: tabLeft - SCROLL_MARGIN, behavior });
  } else if (tabRight + SCROLL_MARGIN > containerRight) {
    el.scrollTo({ left: tabRight + SCROLL_MARGIN - el.clientWidth, behavior });
  }
}

interface UseTabScrollResult {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
}

export function useTabScroll(
  tabs: Tab[],
  activeTabId: string | null,
): UseTabScrollResult {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabIdRef = useRef(activeTabId);
  const isFirstRender = useRef(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    activeTabIdRef.current = activeTabId;
  }, [activeTabId]);

  // Debounced: scrolls the active tab into view after viewport resize settles.
  // Uses refs so the debounced function never goes stale.
  const debouncedScrollActiveOnResize = useDebouncedCallback(
    () => {
      const el = scrollRef.current;
      const tabId = activeTabIdRef.current;
      if (!el || !tabId) return;
      scrollTabIntoView(el, tabId, "smooth");
    },
    { wait: 150 },
  );

  // Effect 1 (stable): registers scroll listener + ResizeObserver.
  // ResizeObserver handles both container resize and viewport resize.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };

    el.addEventListener("scroll", updateScrollState);
    const observer = new ResizeObserver(() => {
      updateScrollState();
      debouncedScrollActiveOnResize();
    });
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [debouncedScrollActiveOnResize]);

  // Effect 2: when tabs or active tab change, update scroll state (scrollWidth may
  // have changed) and scroll the active tab into view with margin.
  // Uses "instant" on first render to avoid animation on initial load.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);

    if (activeTabId) {
      const behavior: ScrollBehavior = isFirstRender.current
        ? "instant"
        : "smooth";
      scrollTabIntoView(el, activeTabId, behavior);
    }
    isFirstRender.current = false;
  }, [tabs, activeTabId]);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }, []);

  return { scrollRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight };
}
