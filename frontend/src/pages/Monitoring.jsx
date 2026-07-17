import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaMapMarkerAlt,
  FaUsers,
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaTrain,
  FaCalendarAlt
} from "react-icons/fa";

function Monitoring() {
  const [monitor, setMonitor] = useState(null);

  useEffect(() => {
    const loadMonitoring = () => {
      api
        .get("/monitor")
        .then((res) => {
          console.log("Monitoring:", res.data);
          setMonitor(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // Load immediately
    loadMonitoring();

    // Refresh every 5 seconds
    const interval = setInterval(loadMonitoring, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!monitor) {
    return (
      <>
        <Navbar />

        <div className="container text-center mt-5">
          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Monitoring Data...
          </h3>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center">
          🚇 Real-Time Metro Monitoring
        </h1>

        <p className="text-center text-muted">
          Live operational status of the metro system
        </p>

        <hr />

        <div className="row">

          {/* Date */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaCalendarAlt
                size={35}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                Date
              </h5>

              <h4>{monitor.Date}</h4>

            </div>
          </div>

          {/* Time */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaClock
                size={35}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                Time
              </h5>

              <h4>{monitor.Time}</h4>

            </div>
          </div>

          {/* Station */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaMapMarkerAlt
                size={35}
                className="text-danger mx-auto"
              />

              <h5 className="mt-3">
                Station
              </h5>

              <h4>{monitor.Station}</h4>

            </div>
          </div>

          {/* Passenger Count */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaUsers
                size={35}
                className="text-info mx-auto"
              />

              <h5 className="mt-3">
                Passenger Count
              </h5>

              <h2>{monitor.Passenger_Count}</h2>

            </div>
          </div>

          {/* Entries */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaSignInAlt
                size={35}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                Passenger Entries
              </h5>

              <h2>{monitor.Passenger_Entries}</h2>

            </div>
          </div>

          {/* Exits */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaSignOutAlt
                size={35}
                className="text-warning mx-auto"
              />

              <h5 className="mt-3">
                Passenger Exits
              </h5>

              <h2>{monitor.Passenger_Exits}</h2>

            </div>
          </div>

          {/* Delay */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaClock
                size={35}
                className="text-danger mx-auto"
              />

              <h5 className="mt-3">
                Delay
              </h5>

              <h2>{monitor.Delay_Minutes} min</h2>

            </div>
          </div>

          {/* Trips */}

          <div className="col-md-3 mb-4">
            <div className="card shadow text-center p-3 h-100">

              <FaTrain
                size={35}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                Trips
              </h5>

              <h2>{monitor.Trips}</h2>

            </div>
          </div>

        </div>

        {/* Occupancy */}

        <div className="card shadow mt-4 p-4">

          <h3>
            Occupancy Percentage
          </h3>

          <div
            className="progress"
            style={{ height: "30px" }}
          >

            <div
              className="progress-bar bg-success"
              style={{
                width: `${monitor.Occupancy_Percent}%`
              }}
            >
              {monitor.Occupancy_Percent}%
            </div>

          </div>

        </div>

        {/* Crowd Level */}

        <div className="card shadow mt-4 p-4">

          <h3>
            Crowd Status
          </h3>

          <h2 className="text-center mt-3">

            {monitor.Crowd_Level === "High" && (
              <span className="badge bg-danger fs-3">
                HIGH
              </span>
            )}

            {monitor.Crowd_Level === "Medium" && (
              <span className="badge bg-warning text-dark fs-3">
                MEDIUM
              </span>
            )}

            {monitor.Crowd_Level === "Low" && (
              <span className="badge bg-success fs-3">
                LOW
              </span>
            )}

          </h2>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Monitoring;