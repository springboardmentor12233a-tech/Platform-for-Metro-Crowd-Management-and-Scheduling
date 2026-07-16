import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {

    if (username === "admin" && password === "admin123") {

      alert("Login Successful");

      navigate("/dashboard");

    } else {

      alert("Invalid Username or Password");

    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>🚇 AI MetroFlow</h1>

        <h3>Platform for Metro Crowd Management and Scheduling</h3>

        <br />

        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <br /><br />

        <div style={{position:"relative"}}>

          <input
            type={showPassword ? "text":"password"}
            placeholder="🔒 Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{width:"100%"}}
          />

          <span
            onClick={()=>setShowPassword(!showPassword)}
            style={{
              position:"absolute",
              right:"15px",
              top:"12px",
              cursor:"pointer",
              fontSize:"20px"
            }}
          >
            {showPassword ? "🙈":"👁"}
          </span>

        </div>

        <br />

        <button onClick={handleLogin}>

          LOGIN TO DASHBOARD

        </button>

        <br /><br />

       
          <p
  style={{
    color: "#666",
    fontSize: "14px",
    marginTop: "15px",
  }}
>
  Please enter your credentials to access the AI MetroFlow Dashboard.
</p>

      </div>

    </div>

  );

}

export default Login;