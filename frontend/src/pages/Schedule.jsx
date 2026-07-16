import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSchedule } from "../services/schedule";

function Schedule() {

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const data = await getSchedule();
      setSchedule(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getColor = (level) => {
    if (level === "High") return "#D32F2F";
    if (level === "Medium") return "#F9A825";
    return "#2E7D32";
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "#eef4fb",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0",
            marginBottom: "40px",
          }}
        >
          🚆 Train Schedule Optimization
        </h1>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            boxShadow: "0 5px 15px rgba(0,0,0,.2)",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <thead
            style={{
              background: "#1565C0",
              color: "white",
            }}
          >
            <tr>
              <th style={{ padding: "15px" }}>Crowd Level</th>
              <th>Current Interval</th>
              <th>Recommended Interval</th>
              <th>Suggested Action</th>
            </tr>
          </thead>

          <tbody>
            {schedule.map((item, index) => (
              <tr
                key={index}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td
                  style={{
                    color: getColor(item.Crowd_Level),
                    fontWeight: "bold",
                    padding: "15px",
                  }}
                >
                  {item.Crowd_Level}
                </td>

                <td>{item.Current_Interval}</td>

                <td>{item.Recommended_Interval}</td>

                <td>{item.Action}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,.2)",
          }}
        >
          <h2 style={{ color: "#1565C0" }}>
            🤖 AI Scheduling Recommendation
          </h2>

          <ul style={{ fontSize: "18px", lineHeight: "2" }}>
            <li>Increase train frequency during peak hours.</li>
            <li>Deploy additional metro staff.</li>
            <li>Open additional ticket counters.</li>
            <li>Issue passenger announcements.</li>
            <li>Continuously monitor station occupancy.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Schedule;