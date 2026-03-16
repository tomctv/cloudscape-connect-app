/**
 * Per-tab AbortControllers for canceling in-flight HTTP requests.
 *
 * Decoupled from React Query's internal signal management:
 * - React Query's querySignal is NOT passed to axios (to avoid cancellation on
 *   component remounts caused by TanStack Router).
 * - Instead, each tab gets its own AbortController whose signal IS passed to axios.
 * - The controller is aborted only on explicit tab close — never on React lifecycle events.
 */
const controllers = new Map<string, AbortController>();

/**
 * Get the AbortSignal for a tab's resource. Creates a new controller if needed.
 * Call this inside queryFns to pass the signal to axios.
 */
export function getTabSignal(resourceId: string): AbortSignal {
  let controller = controllers.get(resourceId);
  if (!controller || controller.signal.aborted) {
    controller = new AbortController();
    controllers.set(resourceId, controller);
  }
  return controller.signal;
}

/**
 * Abort all in-flight requests for a tab's resource.
 * Call this when the user closes a tab.
 */
export function abortTab(resourceId: string): void {
  controllers.get(resourceId)?.abort();
  controllers.delete(resourceId);
}
