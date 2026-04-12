import { createFileRoute } from "@tanstack/react-router";
import { useTabsStore } from "@/features/tabs";

export const Route = createFileRoute("/about")({
  beforeLoad: () => {
    useTabsStore.getState().setActiveTabId(null);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/about"!</div>;
}
