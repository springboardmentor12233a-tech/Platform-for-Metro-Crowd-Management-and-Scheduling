import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-slate-900">
        {greeting}, {user?.name}
      </h1>

      <p className="mt-2 text-lg text-slate-600">
        Welcome back to MetroVision AI Metro Operations Dashboard
      </p>
    </header>
  );
}