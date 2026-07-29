import { useEffect, useState } from "react";

import UserLayout from "../layouts/UserLayout";

import LatestPredictionCard from "../components/user/LatestPredictionCard";
import UserAlert from "../components/user/UserAlert";
import AnnouncementCard from "../components/user/AnnouncementCard";

import "../styles/UserDashboard.css";


function UserDashboard(){

  const [userPrediction,setUserPrediction] = useState(null);
  const [dashboardData,setDashboardData] = useState(null);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    const token = localStorage.getItem("token");


    // User specific latest prediction
    fetch(
      "http://127.0.0.1:8000/user/latest-prediction",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    .then(response=>response.json())

    .then(data=>{
      setUserPrediction(data);
    })

    .catch(error=>{
      console.error(
        "User Prediction Error:",
        error
      );
    });



    // Common AI alert + announcement
    fetch(
      "http://127.0.0.1:8000/dashboard/dashboard/frontend"
    )

    .then(response=>response.json())

    .then(data=>{
      setDashboardData(data);
    })

    .catch(error=>{
      console.error(
        "Dashboard Error:",
        error
      );
    })

    .finally(()=>{
      setLoading(false);
    });


  },[]);



  if(loading){

    return(
      <UserLayout>
        <h2>
          Loading Dashboard...
        </h2>
      </UserLayout>
    );

  }



  return(

    <UserLayout>

      <div className="user-dashboard">

        <div className="welcome-section">

          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Plan your journey smarter with AI-powered
            metro crowd insights.
          </p>

        </div>


        <LatestPredictionCard
          prediction={userPrediction}
        />


        <UserAlert
          alert={dashboardData?.latest_alert}
        />


        <AnnouncementCard
          announcement={dashboardData?.latest_announcement}
        />

      </div>

    </UserLayout>

  );

}


export default UserDashboard;