import { useState } from "react";
import "../styles/Schedule.css";

function Schedule() {
  const [search, setSearch] = useState("");

  const schedules = [
    {
      id: 1,
      train: "M101",
      from: "Rajiv Chowk",
      to: "AIIMS",
      platform: 1,
      arrival: "09:15 AM",
      departure: "09:17 AM",
      status: "On Time",
    },
    {
      id: 2,
      train: "M102",
      from: "AIIMS",
      to: "Noida City Centre",
      platform: 2,
      arrival: "09:30 AM",
      departure: "09:32 AM",
      status: "Delayed",
    },
    {
      id: 3,
      train: "M103",
      from: "Kashmere Gate",
      to: "New Delhi",
      platform: 3,
      arrival: "09:45 AM",
      departure: "09:47 AM",
      status: "On Time",
    },
    {
      id: 4,
      train: "M104",
      from: "Hauz Khas",
      to: "Rajiv Chowk",
      platform: 1,
      arrival: "10:00 AM",
      departure: "10:02 AM",
      status: "On Time",
    },
  ];

  const filteredSchedules = schedules.filter(
    (item) =>
      item.from.toLowerCase().includes(search.toLowerCase()) ||
      item.to.toLowerCase().includes(search.toLowerCase()) ||
      item.train.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="schedule-page">

      <h1>🚆 Metro Train Schedule</h1>

      <input
        type="text"
        placeholder="Search by Train or Station..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>

        <thead>
          <tr>
            <th>Train</th>
            <th>From</th>
            <th>To</th>
            <th>Platform</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {filteredSchedules.map((item) => (
            <tr key={item.id}>
              <td>{item.train}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.platform}</td>
              <td>{item.arrival}</td>
              <td>{item.departure}</td>
              <td>
                <span
                  className={
                    item.status === "On Time"
                      ? "status on-time"
                      : "status delayed"
                  }
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Schedule;