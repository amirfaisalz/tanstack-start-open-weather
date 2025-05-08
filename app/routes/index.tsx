import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Hello from Homepage</h1>
      <Link to="/about">Go to about</Link>
    </div>
  );
}
