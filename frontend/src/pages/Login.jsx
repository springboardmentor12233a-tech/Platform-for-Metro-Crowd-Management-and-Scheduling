import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = (e) => {
    e.preventDefault();

    const users =
      JSON.parse(localStorage.getItem("metroUsers")) || [];

    const currentUser = users.find(
      (u) =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (!currentUser) {
      alert("Invalid Username, Password or Role");
      return;
    }

    // Save login details
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", currentUser.role);
    localStorage.setItem("name", currentUser.name);
    localStorage.setItem("username", currentUser.username);

    alert("Login Successful!");

    navigate("/dashboard");
  };

  return (
    <div className="container">

      <div
        className="card shadow p-5"
        style={{
          maxWidth: "450px",
          margin: "80px auto"
        }}
      >

        <h2 className="text-center mb-4">
          🚇 MetroFlow Login
        </h2>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label>Username</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label>Login As</label>

            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>

        </form>

        <hr />

        <div className="text-center">

          <p>Don't have an account?</p>

          <Link
            to="/register"
            className="btn btn-success"
          >
            Create New Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;