import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col space-y-2">
      <p className="font-bold text-2xl">Not Found</p>
      <Link
        to="/"
        className="w-fit px-4 py-2 bg-green-700 text-white rounded-xl"
      >
        Back to Home
      </Link>
    </div>
  );
}
