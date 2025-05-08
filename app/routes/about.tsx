import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Hello from About</h1>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}
