"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8000/users/login?email=${email}&password=${password}`,
      { method: "POST" }
    );
    const data = await res.json();

    if (data.error) {
      setIsError(true);
      setMessage(data.error);
    } else {
      setIsError(false);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      setMessage(`Welcome ${data.username}! Redirecting...`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          MetroFlow
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
           <input
             id="password"
             name="password"
             type="password"
             autoComplete="current-password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="••••••••"
             required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm text-center rounded-lg py-2 px-3 ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}