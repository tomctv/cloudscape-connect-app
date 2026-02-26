import { CustomerContactHistoryPage } from "@/features/customer-contact-history/components/customer-contact-history-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/$customerId/contacts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerContactHistoryPage />;
}
