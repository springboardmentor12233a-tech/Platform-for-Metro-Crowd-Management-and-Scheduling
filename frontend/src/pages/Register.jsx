import { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });


  const handleRegister = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      const data = await response.json();

      console.log(data);

      alert(data.message);

      navigate("/login");


    } catch (error) {

      console.error(
        "Register Error:",
        error
      );

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>🚇 MetroFlow AI</h1>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Join AI-powered metro crowd management
        </p>


        <div className="form-group">

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"

            value={formData.name}

            onChange={(e)=>
              setFormData({
                ...formData,
                name:e.target.value
              })
            }

          />

        </div>


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
            placeholder="Create password"

            value={formData.password}

            onChange={(e)=>
              setFormData({
                ...formData,
                password:e.target.value
              })
            }

          />

        </div>


        <div className="form-group">

          <label>Role</label>

          <select

            value={formData.role}

            onChange={(e)=>
              setFormData({
                ...formData,
                role:e.target.value
              })
            }

          >

            <option value="">
              Select Role
            </option>


            <option value="USER">
              Passenger
            </option>


            <option value="ADMIN">
              Metro Administrator
            </option>


          </select>

        </div>


        <button
          className="auth-button"
          onClick={handleRegister}
        >

          Register

        </button>


        <p className="auth-footer">

          Already have an account?

          <span
            onClick={() => navigate("/login")}
          >

            Login

          </span>

        </p>


      </div>

    </div>

  );

}


export default Register;