import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Customer not found!</div>;
}
