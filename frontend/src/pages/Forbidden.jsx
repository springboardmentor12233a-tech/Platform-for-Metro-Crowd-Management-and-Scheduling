import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">

      <ShieldAlert
        size={80}
        className="text-red-600"
      />

      <h1 className="mt-6 text-4xl font-bold">
        403
      </h1>

      <p className="mt-2 text-gray-500">
        You don't have permission to access this page.
      </p>

      <Link
        to="/dashboard"
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>

    </div>
  );
}