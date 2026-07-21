import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
      <ShieldAlert size={70} className="text-red-400" />

      <h1 className="mt-6 text-4xl font-bold">
        Access Denied
      </h1>

      <p className="mt-4 max-w-lg text-center text-slate-400">
        You do not have permission to access this page.
      </p>

      <Link
        to="/dashboard"
        className="mt-8 rounded-xl bg-cyan-600 px-8 py-3 font-semibold transition hover:bg-cyan-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}