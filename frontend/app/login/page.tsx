'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {

        const result = await apiService.login(email, password);
        console.log("LOGIN RESPONSE:", result);

        if (result.success) {

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", result.role);
            localStorage.setItem("userEmail", result.email);

            if (result.role === "admin") {
                router.replace("/admin");
            } else {
                router.replace("/dashboard");
            }

            return;
        }

        alert("Invalid Email or Password");
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="bg-slate-900 p-8 rounded-xl w-96">

                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    MetroFlow Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 p-3 rounded bg-slate-800 text-white"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded text-white font-bold"
                >
                    Login
                </button>

            </div>
        </div>
    );
}