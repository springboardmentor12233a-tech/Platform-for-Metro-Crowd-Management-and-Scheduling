import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaUsers,
  FaClock,
  FaPercentage,
  FaChartLine,
  FaTrain,
  FaMapMarkerAlt,
  FaDownload
} from "react-icons/fa";

function Report() {

  const [report, setReport] = useState(null);

  useEffect(() => {

    api.get("/report")
      .then((response) => {

        console.log("Report Data:", response.data);

        setReport(response.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  if (!report) {

    return (

      <>
        <Navbar />

        <div className="container text-center mt-5">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Traffic Report...
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
          📊 Traffic Analysis Report
        </h1>

        <p className="text-center text-muted">
          AI Generated Metro Traffic Statistics and Operational Insights
        </p>

        <hr />

        <div className="row">

          {/* Total Passengers */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaUsers
                size={40}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                Total Passengers
              </h5>

              <h2>
                {report.Total_Passengers}
              </h2>

            </div>

          </div>

          {/* Average Passenger */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaChartLine
                size={40}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                Average Passenger Count
              </h5>

              <h2>
                {report.Average_Passenger_Count}
              </h2>

            </div>

          </div>

          {/* Delay */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaClock
                size={40}
                className="text-danger mx-auto"
              />

              <h5 className="mt-3">
                Average Delay
              </h5>

              <h2>
                {report.Average_Delay} min
              </h2>

            </div>

          </div>

          {/* Occupancy */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaPercentage
                size={40}
                className="text-warning mx-auto"
              />

              <h5 className="mt-3">
                Maximum Occupancy
              </h5>

              <h2>
                {report.Maximum_Occupancy}%
              </h2>

            </div>

          </div>

          {/* Peak Hour */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaTrain
                size={40}
                className="text-info mx-auto"
              />

              <h5 className="mt-3">
                Peak Hour
              </h5>

              <h2>
                {report.Peak_Hour}
              </h2>

            </div>

          </div>

          {/* Crowded Station */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaMapMarkerAlt
                size={40}
                className="text-secondary mx-auto"
              />

              <h5 className="mt-3">
                Most Crowded Station
              </h5>

              <h4>
                {report.Most_Crowded_Station}
              </h4>

            </div>

          </div>

        </div>

        {/* Summary */}

        <div className="card shadow mt-5 p-4">

          <h3 className="text-center mb-3">
            Report Summary
          </h3>

          <p>
            • Total passengers travelled:
            <strong> {report.Total_Passengers}</strong>
          </p>

          <p>
            • Average passenger count:
            <strong> {report.Average_Passenger_Count}</strong>
          </p>

          <p>
            • Peak operational hour:
            <strong> {report.Peak_Hour}</strong>
          </p>

          <p>
            • Most crowded station:
            <strong> {report.Most_Crowded_Station}</strong>
          </p>

          <p>
            • Maximum occupancy recorded:
            <strong> {report.Maximum_Occupancy}%</strong>
          </p>

        </div>

        {/* Download */}

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

            {" "}Download Report

          </button>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Report;