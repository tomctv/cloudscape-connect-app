import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customers/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/customers/search"!</div>
}
