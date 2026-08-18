'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import {
    TrainFront,
    ShieldCheck,
    Eye,
    EyeOff,
    Activity,
    MapPin,
    Brain,
    ArrowRight,
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        setLoading(true);

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

        setLoading(false);
        alert("Invalid Email or Password");
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <div className="relative z-10 min-h-screen flex">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex lg:w-[58%] relative flex-col justify-between p-12 xl:p-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                            <TrainFront
                                size={25}
                                className="text-cyan-400"
                            />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-wider">
                                METRO<span className="text-cyan-400">FLOW</span>
                            </h1>

                            <p className="text-[10px] text-slate-500 tracking-[0.25em]">
                                INTELLIGENT TRANSIT SYSTEM
                            </p>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="max-w-xl">

                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs text-green-400 tracking-widest uppercase">
                                System Operational
                            </span>
                        </div>

                        <h2 className="text-5xl xl:text-6xl font-bold leading-tight">
                            Smarter Metro.
                            <br />
                            <span className="text-cyan-400">
                                Better Flow.
                            </span>
                        </h2>

                        <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-lg">
                            AI-powered crowd intelligence and metro
                            management designed to keep passengers
                            moving efficiently.
                        </p>

                        {/* Network visualization */}
                        <div className="relative mt-12 h-36 max-w-lg">

                            {/* Lines */}
                            <div className="absolute left-4 top-1/2 w-[90%] h-px bg-gradient-to-r from-cyan-500/10 via-cyan-400/60 to-blue-500/10" />

                            <div className="absolute left-[18%] top-1/2 w-px h-20 bg-cyan-400/30 rotate-[35deg] origin-top" />

                            <div className="absolute left-[45%] top-1/2 w-px h-24 bg-blue-400/30 -rotate-[45deg] origin-top" />

                            <div className="absolute left-[70%] top-1/2 w-px h-16 bg-cyan-400/30 rotate-[30deg] origin-top" />

                            {/* Stations */}
                            <div className="absolute left-[4%] top-[43%] w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

                            <div className="absolute left-[18%] top-[43%] w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400" />

                            <div className="absolute left-[45%] top-[43%] w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)]" />

                            <div className="absolute left-[70%] top-[43%] w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-400" />

                            <div className="absolute right-[3%] top-[43%] w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />

                            {/* Train */}
                            <div className="absolute left-[42%] top-[30%] animate-pulse">
                                <TrainFront
                                    size={25}
                                    className="text-white"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 max-w-lg">

                            <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                    <MapPin size={16} />
                                    <span className="text-xs">NETWORK</span>
                                </div>

                                <p className="text-2xl font-bold">
                                    262
                                </p>

                                <p className="text-xs text-slate-500">
                                    Stations
                                </p>
                            </div>

                            <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    <Activity size={16} />
                                    <span className="text-xs">ROUTES</span>
                                </div>

                                <p className="text-2xl font-bold">
                                    36
                                </p>

                                <p className="text-xs text-slate-500">
                                    Active routes
                                </p>
                            </div>

                            <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <Brain size={16} />
                                    <span className="text-xs">AI MODEL</span>
                                </div>

                                <p className="text-2xl font-bold">
                                    92.1%
                                </p>

                                <p className="text-xs text-slate-500">
                                    Accuracy
                                </p>
                            </div>

                        </div>
                    </div>

                    <p className="text-xs text-slate-600">
                        MetroFlow AI Control Platform • Intelligent Transit Management
                    </p>

                </div>

                {/* RIGHT SIDE */}
                <div className="w-full lg:w-[42%] flex items-center justify-center p-6">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
                            <TrainFront className="text-cyan-400" size={30} />

                            <h1 className="text-2xl font-bold tracking-wider">
                                METRO<span className="text-cyan-400">FLOW</span>
                            </h1>
                        </div>

                        {/* Login card */}
                        <div className="relative">

                            {/* Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl" />

                            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-8 sm:p-10 shadow-2xl">

                                {/* Header */}
                                <div className="mb-8">

                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-5">
                                        <ShieldCheck
                                            className="text-cyan-400"
                                            size={25}
                                        />
                                    </div>

                                    <h2 className="text-3xl font-bold">
                                        Welcome back
                                    </h2>

                                    <p className="text-slate-400 mt-2">
                                        Sign in to access the MetroFlow Control Center.
                                    </p>

                                </div>

                                {/* Email */}
                                <div className="mb-5">

                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleLogin();
                                            }
                                        }}
                                        className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                                    />

                                </div>

                                {/* Password */}
                                <div className="mb-7">

                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleLogin();
                                                }
                                            }}
                                            className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>

                                    </div>

                                </div>

                                {/* Login button */}
                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="group w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 text-slate-950 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/10"
                                >
                                    {loading ? (
                                        "Authenticating..."
                                    ) : (
                                        <>
                                            Access Control Center

                                            <ArrowRight
                                                size={18}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Security */}
                                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
                                    <ShieldCheck size={14} />
                                    Secure authenticated access
                                </div>

                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-600 mt-6">
                            MetroFlow Intelligent Transit Platform
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
}