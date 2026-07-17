import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FaTrain,
  FaUsers,
  FaExclamationTriangle,
  FaSearch
} from "react-icons/fa";

function Schedule() {

  const [schedule, setSchedule] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://127.0.0.1:5000/schedule")
      .then((response) => response.json())
      .then((data) => {

        setSchedule(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });

  }, []);

  if (loading) {

    return (

      <>
        <Navbar />

        <div className="container text-center mt-5">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Train Schedule...
          </h3>

        </div>

        <Footer />

      </>

    );

  }

  const filteredSchedule = schedule.filter((item) =>
    item.Station.toLowerCase().includes(search.toLowerCase())
  );

  const highCrowd = schedule.filter(
    (item) => item.Crowd_Level === "High"
  ).length;

  const avgPassengers = (
    schedule.reduce(
      (sum, item) => sum + item.Passenger_Count,
      0
    ) / schedule.length
  ).toFixed(0);

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center">
          🚆 Train Scheduling System
        </h1>

        <p className="text-center text-muted">
          AI-Based Train Frequency Recommendation
        </p>

        <hr />

        {/* Summary Cards */}

        <div className="row mb-4">

          <div className="col-md-4 mb-3">

            <div className="card shadow text-center p-3 h-100">

              <FaTrain
                size={40}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                Total Stations
              </h5>

              <h2>{schedule.length}</h2>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card shadow text-center p-3 h-100">

              <FaExclamationTriangle
                size={40}
                className="text-danger mx-auto"
              />

              <h5 className="mt-3">
                High Crowd Stations
              </h5>

              <h2>{highCrowd}</h2>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card shadow text-center p-3 h-100">

              <FaUsers
                size={40}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                Average Passengers
              </h5>

              <h2>{avgPassengers}</h2>

            </div>

          </div>

        </div>

        {/* Search */}

        <div className="input-group mb-4">

          <span className="input-group-text">

            <FaSearch />

          </span>

          <input
            type="text"
            className="form-control"
            placeholder="Search Station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Table */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover table-striped shadow">

            <thead className="table-dark">

              <tr>

                <th>Station</th>

                <th>Passenger Count</th>

                <th>Crowd Level</th>

                <th>Recommended Frequency</th>

              </tr>

            </thead>

            <tbody>

              {filteredSchedule.map((item, index) => (

                <tr key={index}>

                  <td>{item.Station}</td>

                  <td>{item.Passenger_Count}</td>

                  <td>

                    {item.Crowd_Level === "High" && (
                      <span className="badge bg-danger">
                        High
                      </span>
                    )}

                    {item.Crowd_Level === "Medium" && (
                      <span className="badge bg-warning text-dark">
                        Medium
                      </span>
                    )}

                    {item.Crowd_Level === "Low" && (
                      <span className="badge bg-success">
                        Low
                      </span>
                    )}

                  </td>

                  <td>
                    {item.Recommended_Frequency}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <Footer />

    </>
  );
}

export default Schedule;