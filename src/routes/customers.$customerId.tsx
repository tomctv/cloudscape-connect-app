import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod/v4";

const customerIdSchema = z
  .string()
  .length(8)
  .regex(/^\d{8}$/, "customerId deve essere una stringa di 8 cifre");

export const Route = createFileRoute("/customers/$customerId")({
  beforeLoad: ({ params }) => {
    const result = customerIdSchema.safeParse(params.customerId);
    
    if (!result.success) throw notFound();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { customerId } = Route.useParams();
  return <div>Customer page for customer ID: {customerId}</div>;
}
