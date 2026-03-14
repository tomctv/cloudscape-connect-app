import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to="/customers/search" replace />;
}
