"use client";
import { useState } from "react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/users/register?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(`Account created! Welcome ${data.username || username}`);
      } else {
        let errorMsg = "Signup failed";
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map((err) => err.msg).join(", ");
        }
        setMessage(errorMsg);
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900 text-center">MetroFlow</h1>
        <p className="text-slate-500 text-center mb-6">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-green-600">{message}</p>
        )}

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </main>
  );
}