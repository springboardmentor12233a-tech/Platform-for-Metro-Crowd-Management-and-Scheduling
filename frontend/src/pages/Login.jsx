import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import metro from "../assets/metro.jpg";

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

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", currentUser.role);
    localStorage.setItem("name", currentUser.name);
    localStorage.setItem("username", currentUser.username);

    alert("Login Successful!");

    navigate("/dashboard");

  };

  return (

    <div
      style={{
        backgroundImage: `url(${metro})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >

      {/* Dark Overlay */}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.45)"
        }}
      ></div>

      {/* Heading */}

      <div
        style={{
          position: "absolute",
          top: "40px",
          width: "100%",
          textAlign: "center",
          color: "white",
          zIndex: 2
        }}
      >

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            textShadow: "2px 2px 10px black"
          }}
        >
          🚇 MetroFlow
        </h1>

        <h4
          style={{
            textShadow: "2px 2px 8px black"
          }}
        >
          AI-Based Metro Crowd Management & Scheduling
        </h4>

      </div>

      {/* Login Card */}

      <div
        className="card shadow-lg p-5"
        style={{
          width: "450px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          zIndex: 2
        }}
      >

        <h2 className="text-center mb-4">
          Login
        </h2>

        <form onSubmit={handleLogin}>

          <div className="mb-3">

            <label className="form-label">
              Username
            </label>

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

            <label className="form-label">
              Password
            </label>

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

            <label className="form-label">
              Login As
            </label>

            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >

              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

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

          <p>
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="btn btn-success w-100"
          >
            Create New Account
          </Link>

        </div>

      </div>

    </div>

  );

}

export default Login;