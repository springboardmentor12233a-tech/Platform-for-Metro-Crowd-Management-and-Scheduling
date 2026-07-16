import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Schedule() {

  const [schedule, setSchedule] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/schedule")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">🚆 Train Scheduling</h2>
        <input
  type="text"
  className="form-control mb-3"
  placeholder="🔍 Search Station..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

        <table className="table table-bordered table-striped table-hover">

          <thead className="table-dark">
            <tr>
              <th>Station</th>
              <th>Passenger Count</th>
              <th>Crowd Level</th>
              <th>Recommended Frequency</th>
            </tr>
          </thead>

          <tbody>
            {schedule
  .filter((item) =>
    item.Station.toLowerCase().includes(search.toLowerCase())
  )
  .map((item, index) => (
              <tr key={index}>
                <td>{item.Station}</td>
                <td>{item.Passenger_Count}</td>
                <td>
  {item.Crowd_Level === "High" && (
    <span className="badge bg-danger">High</span>
  )}

  {item.Crowd_Level === "Medium" && (
    <span className="badge bg-warning text-dark">Medium</span>
  )}

  {item.Crowd_Level === "Low" && (
    <span className="badge bg-success">Low</span>
  )}
</td>
                <td>{item.Recommended_Frequency}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}

export default Schedule;