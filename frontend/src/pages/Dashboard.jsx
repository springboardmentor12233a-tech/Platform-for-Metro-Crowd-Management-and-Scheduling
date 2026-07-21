import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Charts from "../components/Charts";
import api from "../services/api";

import { toast, ToastContainer } from "react-toastify";
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
  FaBell
} from "react-icons/fa";

function Dashboard() {

  const [data, setData] = useState(null);
  const [alert, setAlert] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const previousAlert = useRef("");

  useEffect(() => {

    const loadDashboard = () => {

      // Dashboard Data
      api.get("/dashboard")
        .then((res) => {

          setData(res.data);
          setLastUpdated(new Date().toLocaleTimeString());

        })
        .catch((err) => {

          console.log(err);

        });

      // Alerts
      api.get("/alerts")
        .then((res) => {

          setAlert(res.data);

          if (previousAlert.current !== res.data.Alert) {

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
        .catch((err) => {

          console.log(err);

        });

    };

    loadDashboard();

    const interval = setInterval(loadDashboard, 5000);

    return () => clearInterval(interval);

  }, []);

  if (!data) {

    return (
      <>
        <Navbar />

        <div className="container mt-5 text-center">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Dashboard...
          </h3>

        </div>

        <Footer />
      </>
    );

  }

  return (

    <>

      {/* Toast Notification */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
      />

      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center mb-2">
          🚇 MetroFlow Dashboard
        </h1>

        <p className="text-center text-muted">
          AI-Based Metro Crowd Management and Scheduling Platform
        </p>

        <p className="text-center">
          <strong>Last Updated :</strong> {lastUpdated}
        </p>

        <hr />

        {/* Live Metro Alert */}

        {alert && (

          <div
            className={`alert ${
              alert.Priority === "High"
                ? "alert-danger"
                : alert.Priority === "Medium"
                ? "alert-warning"
                : "alert-success"
            } shadow`}
          >

            <h5>
              <FaBell /> MetroFlow Live Alert
            </h5>

            <hr />

            <p>
              <strong>Station :</strong> {alert.Station}
            </p>

            <p>
              <strong>Crowd Level :</strong> {alert.Crowd_Level}
            </p>

            <p>
              <strong>Priority :</strong> {alert.Priority}
            </p>

            <p>
              <strong>Alert :</strong> {alert.Alert}
            </p>

            <p>
              <strong>AI Recommendation :</strong>{" "}
              {data.Forecast.Recommendation || "Normal Operation"}
            </p>

          </div>

        )}

        <div className="row">

          {/* Passenger Count */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaUsers
                size={35}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                Passenger Count
              </h5>

              <h2>
                {data.Current_Status.Passenger_Count}
              </h2>

            </div>

          </div>

          {/* Crowd Level */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaTrain
                size={35}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                Crowd Level
              </h5>

              <h2>

                <span
                  className={
                    data.Current_Status.Crowd_Level === "High"
                      ? "badge bg-danger"
                      : data.Current_Status.Crowd_Level === "Medium"
                      ? "badge bg-warning text-dark"
                      : "badge bg-success"
                  }
                >
                  {data.Current_Status.Crowd_Level}
                </span>

              </h2>

            </div>

          </div>

          {/* Forecast */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaChartLine
                size={35}
                className="text-info mx-auto"
              />

              <h5 className="mt-3">
                Predicted Passengers
              </h5>

              <h2>
                {data.Forecast.Predicted_Passenger_Count}
              </h2>

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
                Current Station
              </h5>

              <h4>
                {data.Current_Status.Station}
              </h4>

            </div>

          </div>

          {/* Delay */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaClock
                size={35}
                className="text-warning mx-auto"
              />

              <h5 className="mt-3">
                Delay
              </h5>

              <h2>
                {data.Current_Status.Delay_Minutes} min
              </h2>

            </div>

          </div>

          {/* Occupancy */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaPercentage
                size={35}
                className="text-secondary mx-auto"
              />

              <h5 className="mt-3">
                Occupancy
              </h5>

              <h2>
                {data.Current_Status.Occupancy}%
              </h2>

            </div>

          </div>

          {/* AI Recommendation */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaRobot
                size={35}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                AI Recommendation
              </h5>

              <h6>
                {data.Forecast.Recommendation || "Normal Operation"}
              </h6>

            </div>

          </div>

          {/* Total Passengers */}

          <div className="col-md-3 mb-4">

            <div className="card shadow text-center p-3 h-100">

              <FaUsers
                size={35}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                Total Passengers
              </h5>

              <h2>
                {data.Traffic_Report.Total_Passengers}
              </h2>

            </div>

          </div>

        </div>

        {/* Charts */}

        <div className="mt-5">

          <h2 className="text-center">
            📊 Advanced Analytics
          </h2>

          <p className="text-center text-muted">
            Passenger statistics, forecasting insights and operational monitoring analytics.
          </p>

          <Charts data={data} />

        </div>

        {/* Download Report */}

        <div className="text-center mt-5 mb-5">

          <button
            className="btn btn-success btn-lg"
            onClick={() =>
              window.open(
                "http://127.0.0.1:5000/report",
                "_blank"
              )
            }
          >

            <FaDownload />

            {" "}Download Traffic Report

          </button>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Dashboard;