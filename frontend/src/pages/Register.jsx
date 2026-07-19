import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

 const handleRegister = (e) => {

    e.preventDefault();

    // Get all users
    const users = JSON.parse(localStorage.getItem("metroUsers")) || [];

    // Check username already exists
    const exists = users.find(
        (u) => u.username === user.username
    );

    if (exists) {
        alert("Username already exists!");
        return;
    }

    // Add new user
    users.push(user);

    // Save all users
    localStorage.setItem(
        "metroUsers",
        JSON.stringify(users)
    );

    alert("Registration Successful!");

    navigate("/");
};

  return (
    <div className="container">

      <div
        className="card shadow p-5"
        style={{
          maxWidth: "500px",
          margin: "60px auto"
        }}
      >

        <h2 className="text-center mb-4">
          🚇 MetroFlow Registration
        </h2>

        <form onSubmit={handleRegister}>

          <div className="mb-3">
            <label>Full Name</label>

            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Username</label>

            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Enter Username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label>Register As</label>

            <select
              className="form-select"
              name="role"
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-success w-100">
            Register
          </button>

        </form>

        <hr />

        <div className="text-center">

          <Link to="/">
            Already have an account? Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;


