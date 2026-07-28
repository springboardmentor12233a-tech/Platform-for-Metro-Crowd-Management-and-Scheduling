import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await forgotPassword(email);

            setMessage(res.message);
        } catch (err) {
            setMessage(
                err.response?.data?.detail ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center">
                    Forgot Password
                </h1>

                <p className="text-gray-500 mt-2 text-center">
                    Enter your registered email.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-lg p-3"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />

                    <button
                        className="w-full bg-blue-600 text-white rounded-lg p-3"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                {message && (
                    <p className="text-green-600 mt-4 text-center">
                        {message}
                    </p>
                )}

                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-blue-600"
                    >
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}