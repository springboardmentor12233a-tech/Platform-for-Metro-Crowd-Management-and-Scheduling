import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      console.log(data);

      if(data.access_token){

        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "role",
          data.role
        );

        alert("Login Successful");

        console.log("Role:", data.role);


        if(data.role === "ADMIN"){
          navigate("/dashboard");
        }
        else if(data.role === "USER"){
          navigate("/user-dashboard");
        }

      }
      else{
        alert(data.message);
      }

    }

    catch(error){

      console.error(
        "Login Error:",
        error
      );

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>🚇 MetroFlow AI</h1>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to access your metro services
        </p>


        <div className="form-group">

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"

            value={formData.email}

            onChange={(e)=>
              setFormData({
                ...formData,
                email:e.target.value
              })
            }

          />

        </div>


        <div className="form-group">

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"

            value={formData.password}

            onChange={(e)=>
              setFormData({
                ...formData,
                password:e.target.value
              })
            }

          />

        </div>


        <button
          className="auth-button"
          onClick={handleLogin}
        >
          Login
        </button>


        <p className="auth-footer">

          Don't have an account?

          <span>
            Register
          </span>

        </p>

      </div>

    </div>

  );

}

export default Login;