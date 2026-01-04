import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/$customerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { customerId } = Route.useParams();
  return <div>Customer page for customer ID: {customerId}</div>;
}
