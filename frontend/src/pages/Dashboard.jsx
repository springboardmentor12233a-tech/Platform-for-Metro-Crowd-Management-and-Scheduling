// import { useEffect, useState, useRef } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Charts from "../components/Charts";
// import api from "../services/api";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ChatBot from "../components/ChatBot";
// import {
//   FaUsers,
//   FaTrain,
//   FaClock,
//   FaChartLine,
//   FaDownload,
//   FaPercentage,
//   FaRobot,
//   FaMapMarkerAlt,
//   FaBell,
//   FaHeartbeat,
//   FaWifi
// } from "react-icons/fa";

// function Dashboard() {

//   const [data, setData] = useState(null);
//   const [alert, setAlert] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState("");

//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString()
//   );

//   const previousAlert = useRef("");

//   useEffect(() => {

//     const loadDashboard = () => {

//       // Dashboard API
//       api.get("/dashboard")
//         .then((res) => {

//           setData(res.data);
//           setLastUpdated(new Date().toLocaleTimeString());

//         })
//         .catch(console.log);

//       // AI Alert API
//       api.get("/alerts")
//         .then((res) => {

//           setAlert(res.data);

//           if (
//             res.data &&
//             res.data.Alert &&
//             previousAlert.current !== res.data.Alert
//           ) {

//             previousAlert.current = res.data.Alert;

//             if (res.data.Priority === "High") {

//               toast.error(res.data.Alert);

//             }
//             else if (res.data.Priority === "Medium") {

//               toast.warning(res.data.Alert);

//             }
//             else {

//               toast.success(res.data.Alert);

//             }

//           }

//         })
//         .catch(console.log);

//       // AI Notification API
//       api.get("/notifications")
//         .then((res) => {

//           setNotification(res.data);

//         })
//         .catch(console.log);

//     };

//     loadDashboard();

//     // Refresh every 10 seconds
//     const dashboardInterval = setInterval(loadDashboard, 10000);

//     // Live Clock
//     const clockInterval = setInterval(() => {

//       setCurrentTime(new Date().toLocaleTimeString());

//     }, 1000);

//     return () => {

//       clearInterval(dashboardInterval);
//       clearInterval(clockInterval);

//     };

//   }, []);

//   if (!data) {

//     return (

//       <>

//         <Navbar />

//         <div className="container mt-5 text-center">

//           <div className="spinner-border text-primary"></div>

//           <h3 className="mt-3">
//             Loading MetroFlow Dashboard...
//           </h3>

//         </div>

//         <Footer />

//       </>

//     );

//   }

//   return (

//     <>

//       <ToastContainer
//         position="top-right"
//         autoClose={4000}
//         newestOnTop
//       />

//       <Navbar />

//       <div className="container mt-4">

//         <div className="text-center">

//           <span className="badge bg-success fs-6">
//             🟢 LIVE SYSTEM
//           </span>

//         </div>

//         <h1 className="text-center mt-3">
//           🚇 MetroFlow Dashboard
//         </h1>

//         <p className="text-center text-muted">
//           AI-Based Metro Crowd Management and Scheduling Platform
//         </p>

//         <h5 className="text-center">
//           🕒 Current Time : {currentTime}
//         </h5>

//         <p className="text-center">
//           <strong>Last Updated :</strong> {lastUpdated}
//         </p>

//         <hr />
//                 {/* ================= AI ALERT ================= */}

//         {alert && (

//           <div
//             className={`alert shadow mb-4 ${
//               alert.Priority === "High"
//                 ? "alert-danger"
//                 : alert.Priority === "Medium"
//                 ? "alert-warning"
//                 : "alert-success"
//             }`}
//           >

//             <h4>
//               <FaBell /> Live AI Alert
//             </h4>

//             <hr />

//             <div className="row">

//               <div className="col-md-6">

//                 <p>
//                   <strong>Station :</strong> {alert.Station}
//                 </p>

//                 <p>
//                   <strong>Passenger Count :</strong> {alert.Passenger_Count}
//                 </p>

//                 <p>
//                   <strong>Crowd Level :</strong> {alert.Crowd_Level}
//                 </p>

//                 <p>
//                   <strong>Delay :</strong> {alert.Delay} min
//                 </p>

//               </div>

//               <div className="col-md-6">

//                 <p>
//                   <strong>Priority :</strong>
//                 </p>

//                 <span
//                   className={`badge ${
//                     alert.Priority === "High"
//                       ? "bg-danger"
//                       : alert.Priority === "Medium"
//                       ? "bg-warning text-dark"
//                       : "bg-success"
//                   }`}
//                 >
//                   {alert.Priority}
//                 </span>

//               </div>

//             </div>

//             <hr />

//             <div
//               className="border rounded p-3 bg-light"
//               style={{ whiteSpace: "pre-wrap" }}
//             >

//               <strong>🤖 AI Alert</strong>

//               <br />

//               {alert.Alert}

//             </div>

//             <div
//               className="border rounded p-3 mt-3 bg-info bg-opacity-10"
//             >

//               <strong>🚇 AI Recommendation</strong>

//               <br />

//               {alert.Recommendation}

//             </div>

//           </div>

//         )}

//         {/* ================= AI NOTIFICATION ================= */}

//         {notification && (

//           <div className="alert alert-primary shadow mb-4">

//             <h4>
//               📢 Passenger Notification
//             </h4>

//             <hr />

//             <p>

//               <strong>Station :</strong>

//               {" "}

//               {notification.Station}

//             </p>

//             <p>

//               <strong>Message :</strong>

//             </p>

//             <div
//               className="border rounded p-3 bg-white"
//               style={{ whiteSpace: "pre-wrap" }}
//             >

//               {notification.Notification}

//             </div>

//           </div>

//         )}

//         {/* ================= DASHBOARD CARDS ================= */}

//         <div className="row">

//           {/* Passenger Count */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaUsers
//                 size={35}
//                 className="text-primary mx-auto"
//               />

//               <h5 className="mt-3">
//                 Passenger Count
//               </h5>

//               <h2>
//                 {data.Current_Status.Passenger_Count}
//               </h2>

//             </div>

//           </div>

//           {/* Crowd Level */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaTrain
//                 size={35}
//                 className="text-success mx-auto"
//               />

//               <h5 className="mt-3">
//                 Crowd Level
//               </h5>

//               <h2>

//                 <span
//                   className={
//                     data.Current_Status.Crowd_Level === "High"
//                       ? "badge bg-danger"
//                       : data.Current_Status.Crowd_Level === "Medium"
//                       ? "badge bg-warning text-dark"
//                       : "badge bg-success"
//                   }
//                 >

//                   {data.Current_Status.Crowd_Level}

//                 </span>

//               </h2>

//             </div>

//           </div>

//           {/* Predicted Passengers */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaChartLine
//                 size={35}
//                 className="text-info mx-auto"
//               />

//               <h5 className="mt-3">
//                 Predicted Passengers
//               </h5>

//               <h2>

//                 {data.Forecast.Predicted_Passenger_Count}

//               </h2>

//             </div>

//           </div>

//           {/* Current Station */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaMapMarkerAlt
//                 size={35}
//                 className="text-danger mx-auto"
//               />

//               <h5 className="mt-3">
//                 Current Station
//               </h5>

//               <h4>

//                 {data.Current_Status.Station}

//               </h4>

//             </div>

//           </div>
//                     {/* Delay */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaClock
//                 size={35}
//                 className="text-warning mx-auto"
//               />

//               <h5 className="mt-3">
//                 Delay
//               </h5>

//               <h2>
//                 {data.Current_Status.Delay_Minutes} min
//               </h2>

//             </div>

//           </div>

//           {/* Occupancy */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaPercentage
//                 size={35}
//                 className="text-secondary mx-auto"
//               />

//               <h5 className="mt-3">
//                 Occupancy
//               </h5>

//               <h2>
//                 {data.Current_Status.Occupancy}%
//               </h2>

//             </div>

//           </div>

//           {/* AI Recommendation */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaRobot
//                 size={35}
//                 className="text-primary mx-auto"
//               />

//               <h5 className="mt-3">
//                 AI Recommendation
//               </h5>

//               <h6 className="mt-3">
//                 {alert?.Recommendation || "Normal Operation"}
//               </h6>

//             </div>

//           </div>

//           {/* Total Passengers */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaUsers
//                 size={35}
//                 className="text-success mx-auto"
//               />

//               <h5 className="mt-3">
//                 Total Passengers
//               </h5>

//               <h2>
//                 {data.Traffic_Report.Total_Passengers}
//               </h2>

//             </div>

//           </div>

//           {/* System Health */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaHeartbeat
//                 size={35}
//                 className="text-danger mx-auto"
//               />

//               <h5 className="mt-3">
//                 System Health
//               </h5>

//               <h3 className="text-success">
//                 Healthy
//               </h3>

//             </div>

//           </div>

//           {/* AI Status */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaRobot
//                 size={35}
//                 className="text-primary mx-auto"
//               />

//               <h5 className="mt-3">
//                 AI Status
//               </h5>

//               <h3 className="text-primary">
//                 Running
//               </h3>

//             </div>

//           </div>

//           {/* Network */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaWifi
//                 size={35}
//                 className="text-success mx-auto"
//               />

//               <h5 className="mt-3">
//                 Network
//               </h5>

//               <h3 className="text-success">
//                 Online
//               </h3>

//             </div>

//           </div>

//           {/* Last Prediction */}
//           <div className="col-md-3 mb-4">

//             <div className="card shadow text-center p-3 h-100">

//               <FaChartLine
//                 size={35}
//                 className="text-info mx-auto"
//               />

//               <h5 className="mt-3">
//                 Last Prediction
//               </h5>

//               <h2>
//                 {data.Forecast.Predicted_Passenger_Count}
//               </h2>

//             </div>

//           </div>

//         </div>

//         {/* Analytics */}

//         <div className="mt-5">

//           <h2 className="text-center">
//             📊 Advanced Analytics
//           </h2>

//           <p className="text-center text-muted">
//             Passenger statistics, forecasting insights and operational monitoring analytics.
//           </p>

//           <Charts data={data} />

//         </div>

//         {/* Download Report */}

//         <div className="text-center mt-5 mb-5">

//           <button
//             className="btn btn-success btn-lg"
//             onClick={() =>
//               window.open(
//                 "http://127.0.0.1:5000/report",
//                 "_blank"
//               )
//             }
//           >

//             <FaDownload />

//             {" "}Download Traffic Report

//           </button>

//         </div>
              

      

      

//     </div>

//     <Footer />
//     <ChatBot />

//   </>

// );

// }

// export default Dashboard;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Charts from "../components/Charts";
import ChatBot from "../components/ChatBot";

import api from "../services/api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaUsers,
  FaTrain,
  FaClock,
  FaChartLine,
  FaDownload,
  FaPercentage,
  FaRobot,
  FaMapMarkerAlt,
  FaBell,
  FaHeartbeat,
  FaWifi
} from "react-icons/fa";

function Dashboard() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [alert, setAlert] = useState(null);

  const [notification, setNotification] = useState(null);

  const [lastUpdated, setLastUpdated] = useState("");

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const previousAlert = useRef("");

  useEffect(() => {

    const loadDashboard = () => {

      // Dashboard API
      api.get("/dashboard")
        .then((res) => {

          setData(res.data);

          setLastUpdated(
            new Date().toLocaleTimeString()
          );

        })
        .catch(console.log);

      // AI Alerts
      api.get("/alerts")
        .then((res) => {

          setAlert(res.data);

          if (
            res.data &&
            res.data.Alert &&
            previousAlert.current !== res.data.Alert
          ) {

            previousAlert.current = res.data.Alert;

            if (res.data.Priority === "High") {

              toast.error(res.data.Alert);

            }

            else if (res.data.Priority === "Medium") {

              toast.warning(res.data.Alert);

            }

            else {

              toast.success(res.data.Alert);

            }

          }

        })
        .catch(console.log);

      // AI Notifications

      api.get("/notifications")
        .then((res) => {

          setNotification(res.data);

        })
        .catch(console.log);

    };

    loadDashboard();

    const dashboardInterval = setInterval(
      loadDashboard,
      10000
    );

    const clockInterval = setInterval(() => {

      setCurrentTime(
        new Date().toLocaleTimeString()
      );

    }, 1000);

    return () => {

      clearInterval(dashboardInterval);

      clearInterval(clockInterval);

    };

  }, []);

  if (!data) {

    return (

      <>

        <Navbar />

        <div className="container mt-5 text-center">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">

            Loading MetroFlow Dashboard...

          </h3>

        </div>

        <Footer />

      </>

    );

  }

  return (

    <>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
      />

      <Navbar />

      <div className="container mt-4">

        <div className="text-center">

          <span className="badge bg-success fs-6">

            🟢 LIVE SYSTEM

          </span>

        </div>

        <h1 className="text-center mt-3">

          🚇 MetroFlow Dashboard

        </h1>

        <p className="text-center text-muted">

          AI-Based Metro Crowd Management and Scheduling Platform

        </p>

        <h5 className="text-center">

          🕒 Current Time : {currentTime}

        </h5>

        <p className="text-center">

          <strong>Last Updated :</strong> {lastUpdated}

        </p>

        <hr />
                {/* ================= AI ALERT ================= */}

        {alert && (

          <div
            className={`alert shadow-lg mb-4 border-0 ${
              alert.Priority === "High"
                ? "alert-danger"
                : alert.Priority === "Medium"
                ? "alert-warning"
                : "alert-success"
            }`}
          >

            <div className="d-flex justify-content-between align-items-center">

              <h3>

                <FaBell className="me-2" />

                Live AI Alert

              </h3>

              <span
                className={`badge fs-6 ${
                  alert.Priority === "High"
                    ? "bg-danger"
                    : alert.Priority === "Medium"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >

                {alert.Priority} Priority

              </span>

            </div>

            <hr />

            <div className="row">

              <div className="col-md-6">

                <p>

                  <strong>Station :</strong>

                  {" "}

                  {alert.Station}

                </p>

                <p>

                  <strong>Passenger Count :</strong>

                  {" "}

                  {alert.Passenger_Count}

                </p>

                <p>

                  <strong>Crowd Level :</strong>

                  {" "}

                  {alert.Crowd_Level}

                </p>

                <p>

                  <strong>Delay :</strong>

                  {" "}

                  {alert.Delay} Minutes

                </p>

              </div>

              <div className="col-md-6">

                <div className="card bg-light border-0 p-3">

                  <h5>

                    🤖 AI Alert

                  </h5>

                  <p style={{ whiteSpace: "pre-wrap" }}>

                    {alert.Alert}

                  </p>

                </div>

                <div className="card bg-info bg-opacity-10 border-0 p-3 mt-3">

                  <h5>

                    🚇 AI Recommendation

                  </h5>

                  <p>

                    {alert.Recommendation}

                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ================= PASSENGER NOTIFICATION ================= */}

        {notification && (

          <div className="card shadow-lg border-0 mb-5">

            <div className="card-header bg-primary text-white">

              <h4>

                📢 Passenger Notification

              </h4>

            </div>

            <div className="card-body">

              <h5>

                Station :

                {" "}

                {notification.Station}

              </h5>

              <hr />

              <p
                style={{
                  fontSize: "17px",
                  whiteSpace: "pre-wrap"
                }}
              >

                {notification.Notification}

              </p>

            </div>

          </div>

        )}

        {/* ================= DASHBOARD CARDS ================= */}

        <div className="row">

          {/* Passenger Count */}

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaUsers
                  size={40}
                  className="text-primary mb-3"
                />

                <h5>

                  Passenger Count

                </h5>

                <h2 className="fw-bold">

                  {data.Current_Status.Passenger_Count}

                </h2>

              </div>

            </div>

          </div>

          {/* Crowd Level */}

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaTrain
                  size={40}
                  className="text-success mb-3"
                />

                <h5>

                  Crowd Level

                </h5>

                <span
                  className={`badge fs-5 ${
                    data.Current_Status.Crowd_Level === "High"
                      ? "bg-danger"
                      : data.Current_Status.Crowd_Level === "Medium"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}
                >

                  {data.Current_Status.Crowd_Level}

                </span>

              </div>

            </div>

          </div>

          {/* Predicted Passengers */}

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaChartLine
                  size={40}
                  className="text-info mb-3"
                />

                <h5>

                  Predicted Passengers

                </h5>

                <h2 className="fw-bold">

                  {data.Forecast.Predicted_Passenger_Count}

                </h2>

              </div>

            </div>

          </div>

          {/* Current Station */}

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaMapMarkerAlt
                  size={40}
                  className="text-danger mb-3"
                />

                <h5>

                  Current Station

                </h5>

                <h4>

                  {data.Current_Status.Station}

                </h4>

              </div>

            </div>

          </div>
                    {/* Delay */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaClock
                  size={40}
                  className="text-warning mb-3"
                />

                <h5>

                  Delay

                </h5>

                <h2 className="fw-bold">

                  {data.Current_Status.Delay_Minutes} min

                </h2>

              </div>

            </div>

          </div>

          {/* Occupancy */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaPercentage
                  size={40}
                  className="text-secondary mb-3"
                />

                <h5>

                  Occupancy

                </h5>

                <h2 className="fw-bold">

                  {data.Current_Status.Occupancy}%

                </h2>

              </div>

            </div>

          </div>

          {/* AI Recommendation */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaRobot
                  size={40}
                  className="text-primary mb-3"
                />

                <h5>

                  AI Recommendation

                </h5>

                <p className="fw-bold text-success">

                  {alert?.Recommendation || "Normal Operation"}

                </p>

              </div>

            </div>

          </div>

          {/* Total Passengers */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaUsers
                  size={40}
                  className="text-success mb-3"
                />

                <h5>

                  Total Passengers

                </h5>

                <h2 className="fw-bold">

                  {data.Traffic_Report.Total_Passengers}

                </h2>

              </div>

            </div>

          </div>

          {/* System Health */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaHeartbeat
                  size={40}
                  className="text-danger mb-3"
                />

                <h5>

                  System Health

                </h5>

                <span className="badge bg-success fs-6">

                  Healthy

                </span>

              </div>

            </div>

          </div>

          {/* AI Status */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaRobot
                  size={40}
                  className="text-primary mb-3"
                />

                <h5>

                  AI Status

                </h5>

                <span className="badge bg-primary fs-6">

                  Running

                </span>

              </div>

            </div>

          </div>

          {/* Network */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaWifi
                  size={40}
                  className="text-success mb-3"
                />

                <h5>

                  Network

                </h5>

                <span className="badge bg-success fs-6">

                  Online

                </span>

              </div>

            </div>

          </div>

          {/* Last Prediction */}
          <div className="col-lg-3 col-md-6 mb-4">

            <div className="card shadow h-100 text-center border-0">

              <div className="card-body">

                <FaChartLine
                  size={40}
                  className="text-info mb-3"
                />

                <h5>

                  Last Prediction

                </h5>

                <h2 className="fw-bold">

                  {data.Forecast.Predicted_Passenger_Count}

                </h2>

              </div>

            </div>

          </div>

        </div>
                {/* ================= ADVANCED ANALYTICS ================= */}

        <div className="mt-5">

          <h2 className="text-center">
            📊 Advanced Analytics
          </h2>

          <p className="text-center text-muted">

            AI-powered passenger forecasting and operational insights

          </p>

          <Charts data={data} />

        </div>

        {/* ================= QUICK AI INSIGHTS ================= */}

        <div className="row mt-5">

          <div className="col-lg-6 mb-4">

            <div className="card shadow h-100">

              <div className="card-header bg-primary text-white">

                🤖 AI Insights

              </div>

              <div className="card-body">

                <ul className="list-group list-group-flush">

                  <li className="list-group-item">

                    ✅ Crowd Level :
                    <strong> {data.Current_Status.Crowd_Level}</strong>

                  </li>

                  <li className="list-group-item">

                    🚉 Current Station :
                    <strong> {data.Current_Status.Station}</strong>

                  </li>

                  <li className="list-group-item">

                    👥 Predicted Passengers :
                    <strong> {data.Forecast.Predicted_Passenger_Count}</strong>

                  </li>

                  <li className="list-group-item">

                    🤖 Recommendation :
                    <strong>
                      {" "}
                      {alert?.Recommendation || "Normal Operation"}
                    </strong>

                  </li>

                </ul>

              </div>

            </div>

          </div>

          <div className="col-lg-6 mb-4">

            <div className="card shadow h-100">

              <div className="card-header bg-success text-white">

                🚦 System Status

              </div>

              <div className="card-body">

                <table className="table table-bordered">

                  <tbody>

                    <tr>

                      <td>Backend API</td>

                      <td>
                        <span className="badge bg-success">
                          Running
                        </span>
                      </td>

                    </tr>

                    <tr>

                      <td>AI Prediction Engine</td>

                      <td>
                        <span className="badge bg-success">
                          Active
                        </span>
                      </td>

                    </tr>

                    <tr>

                      <td>Database</td>

                      <td>
                        <span className="badge bg-success">
                          Connected
                        </span>
                      </td>

                    </tr>

                    <tr>

                      <td>Monitoring</td>

                      <td>
                        <span className="badge bg-success">
                          Live
                        </span>
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

        {/* ================= REPORT SECTION ================= */}

        <div className="card shadow-lg mt-5 border-0">

          <div className="card-body text-center">

            <FaDownload
              size={45}
              className="text-success mb-3"
            />

            <h3>

              Traffic Analysis Report

            </h3>

            <p className="text-muted">

              View the complete AI-generated traffic analysis,
              passenger statistics, operational insights,
              occupancy trends, and recommendations.

            </p>

            <button
              className="btn btn-success btn-lg"
              onClick={() => window.open("/report", "_blank")}
            >

              <FaDownload />

              {" "}Open Report

            </button>

          </div>

        </div>
                

       

      </div>

      <Footer />

      <ChatBot />

    </>

  );

}

export default Dashboard;