import { useNavigate } from "react-router-dom";
import "../../styles/User/UserSidebar.css";

function UserSidebar(){

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");

  };


  return (

    <div className="user-sidebar">

      <h2>
        🚇 MetroFlow AI
      </h2>


      <div className="user-menu">

        <p onClick={()=>navigate("/user-dashboard")}>
          🏠 Dashboard
        </p>


        <p onClick={()=>navigate("/prediction")}>
          🔮 Predict Crowd
        </p>


        <p onClick={()=>navigate("/my-prediction")}>
          📊 My Predictions
        </p>


        <p onClick={()=>navigate("/profile")}>
          👤 Profile
        </p>

      </div>


      <button
        className="logout-btn"
        onClick={logout}
      >
        🚪 Logout
      </button>


    </div>

  );

}

export default UserSidebar;