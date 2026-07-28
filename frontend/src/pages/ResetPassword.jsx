import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {

    const [params] = useSearchParams();

    const token = params.get("token");

    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const res = await resetPassword(
                token,
                password,
            );

            setMessage(res.message);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            setMessage(
                err.response?.data?.detail ||
                "Unable to reset password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center">
                    Reset Password
                </h1>

                <form
                    className="space-y-4 mt-6"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full border rounded-lg p-3"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full border rounded-lg p-3"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        className="w-full bg-blue-600 text-white rounded-lg p-3"
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>

                </form>

                {message && (
                    <p className="text-center mt-4 text-green-600">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}