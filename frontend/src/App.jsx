import Home from "./pages/Home";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";

import Prediction from "./pages/Prediction";
import Trains from "./pages/Trains";
import Stations from "./pages/Stations";
import Schedules from "./pages/Schedules";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import StatisticsChart from "./components/StatisticsChart";
import DashboardCards from "./components/DashboardCards";
import { useEffect, useState } from "react";
import "./App.css";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/DoughnutChart";
import SystemStatus from "./components/SystemStatus";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIAssistant from "./components/AIAssistant";
import AIChat from "./components/AIChat";
import CrowdPrediction from "./components/CrowdPrediction";


function App() {
  const [data, setData] = useState(null);
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [metroLines, setMetroLines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLoggedIn") === "true"
);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/dashboard")
    .then((res) => res.json())
    .then((data) => setData(data))
    .catch((err) => console.log(err));

  fetch("http://127.0.0.1:8000/metro-stations")
    .then((res) => res.json())
    .then((data) => setStations(data))
    .catch((err) => console.log(err));

  fetch("http://127.0.0.1:8000/metro-schedule")
    .then((res) => res.json())
    .then((data) => setSchedules(data))
    .catch((err) => console.log(err));

  fetch("http://127.0.0.1:8000/trains")
    .then((res) => res.json())
    .then((data) => setTrains(data))
    .catch((err) => console.log(err));

  fetch("http://127.0.0.1:8000/metro-lines")
    .then((res) => res.json())
    .then((data) => setMetroLines(data))
    .catch((err) => console.log(err));

}, []);
 

  const filteredStations = stations.filter((station) =>
  station.Station.toLowerCase().includes(search.toLowerCase())
);
  const filteredSchedules = schedules.filter((schedule) =>
  schedule.Train_Name.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
  schedule.Train_Number.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
  schedule.Station_Name.toLowerCase().includes(scheduleSearch.toLowerCase())
);
if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

  return (
    <>
    <Sidebar
  activePage={activePage}
  setActivePage={setActivePage}
/>

    <div
      className="container"
      style={{
        marginLeft: "240px",
        padding: "20px",
      }}
    >
      
      <Navbar />
<div style={{ textAlign: "right", marginBottom: "20px" }}>
  <button
    onClick={() => {
      localStorage.removeItem("isLoggedIn");
localStorage.removeItem("token");
localStorage.removeItem("role");
      setIsLoggedIn(false);
    }}
    style={{
      background: "#dc2626",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Logout
  </button>
</div>

      {data ? (
  activePage === "dashboard" ? (
    <Dashboard data={data} />
  ) : activePage === "stations" ? (
    <Stations />
  ) : activePage === "trains" ? (
    <Trains />
  ) : activePage === "schedules" ? (
    <Schedules />
  ) : activePage === "prediction" ? (
    <Prediction />
  ) : activePage === "analytics" ? (
    <Analytics />
  ) : activePage === "settings" ? (
    <Settings />
  ) : (
    <Dashboard data={data} />
  )
) : (
  <h2>Loading...</h2>
)}
      <footer style={{ marginTop: "50px" }}>
        <hr />
        <h3>Metro Crowd Management & Scheduling System</h3>
        <p>Developed using React + FastAPI</p>
        <p>Infosys Springboard Internship Project</p>
      </footer>
    </div>
</>

  );
}

export default App;