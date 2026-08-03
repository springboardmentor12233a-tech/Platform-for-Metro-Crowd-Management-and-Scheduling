import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
} from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Member",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      alert("Registration successful!");

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            MetroVision
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 text-red-600 px-4 py-3">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <FiUser className="text-gray-400" />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full p-3 outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <FiMail className="text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <FiLock className="text-gray-400" />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Confirm Password
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <FiLock className="text-gray-400" />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Select Role
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <FiShield className="text-gray-400" />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 outline-none bg-transparent"
              >
                <option value="Member">Member</option>
                <option value="Analyst">Analyst</option>
                <option value="Operator">Operator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Register;