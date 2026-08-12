// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function Register() {

//   const navigate = useNavigate();

//   const [user, setUser] = useState({
//     name: "",
//     username: "",
//     password: "",
//     role: "user"
//   });

//   const handleChange = (e) => {
//     setUser({
//       ...user,
//       [e.target.name]: e.target.value
//     });
//   };

//  const handleRegister = (e) => {

//     e.preventDefault();

//     // Get all users
//     const users = JSON.parse(localStorage.getItem("metroUsers")) || [];

//     // Check username already exists
//     const exists = users.find(
//         (u) => u.username === user.username
//     );

//     if (exists) {
//         alert("Username already exists!");
//         return;
//     }

//     // Add new user
//     users.push(user);

//     // Save all users
//     localStorage.setItem(
//         "metroUsers",
//         JSON.stringify(users)
//     );

//     alert("Registration Successful!");

//     navigate("/");
// };

//   return (
//     <div className="container">

//       <div
//         className="card shadow p-5"
//         style={{
//           maxWidth: "500px",
//           margin: "60px auto"
//         }}
//       >

//         <h2 className="text-center mb-4">
//           🚇 MetroFlow Registration
//         </h2>

//         <form onSubmit={handleRegister}>

//           <div className="mb-3">
//             <label>Full Name</label>

//             <input
//               type="text"
//               className="form-control"
//               name="name"
//               placeholder="Enter Full Name"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label>Username</label>

//             <input
//               type="text"
//               className="form-control"
//               name="username"
//               placeholder="Enter Username"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label>Password</label>

//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               placeholder="Enter Password"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label>Register As</label>

//             <select
//               className="form-select"
//               name="role"
//               onChange={handleChange}
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           <button className="btn btn-success w-100">
//             Register
//           </button>

//         </form>

//         <hr />

//         <div className="text-center">

//           <Link to="/">
//             Already have an account? Login
//           </Link>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Register;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import metro from "../assets/metro.jpg";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Get existing users
    const users =
      JSON.parse(localStorage.getItem("metroUsers")) || [];

    // Check if username already exists
    const exists = users.find(
      (u) => u.username === user.username
    );

    if (exists) {
      alert("Username already exists!");
      return;
    }

    // Save new user
    users.push(user);

    localStorage.setItem(
      "metroUsers",
      JSON.stringify(users)
    );

    alert("Registration Successful!");

    navigate("/");
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
        position: "relative",
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
          backgroundColor: "rgba(0,0,0,0.45)",
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
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            textShadow: "2px 2px 10px black",
            marginBottom: "10px",
          }}
        >
          🚇 MetroFlow
        </h1>

        <h4
          style={{
            textShadow: "2px 2px 8px black",
          }}
        >
          AI-Based Metro Crowd Management & Scheduling
        </h4>
      </div>

      {/* Registration Card */}
      <div
        className="card shadow-lg p-4"
        style={{
          width: "450px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          zIndex: 2,
        }}
      >
        <h2 className="text-center mb-3">
          Create New Account
        </h2>

        <form onSubmit={handleRegister}>
          <div className="mb-2">
            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter Full Name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Enter Username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter Password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Register As
            </label>

            <select
              className="form-select"
              name="role"
              value={user.role}
              onChange={handleChange}
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
            className="btn btn-success w-100"
          >
            Register
          </button>
        </form>

        <hr className="my-3" />

        <div className="text-center">
          <p className="mb-2">
            Already have an account?
          </p>

          <Link
            to="/"
            className="btn btn-primary w-100"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;