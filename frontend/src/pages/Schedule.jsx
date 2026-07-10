import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import API from "../services/api";

function Schedule() {

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const response = await API.get("/schedule");
      setSchedule(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "rgba(255,255,255,0.9)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0"
          }}
        >
          🚇 Schedule Optimization
        </h1>

        <table
          style={{
            width: "100%",
            marginTop: "40px",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr style={{ background: "#1565C0", color: "white" }}>
              <th style={{ padding: "15px" }}>Crowd Level</th>
              <th>Current Interval</th>
              <th>Recommended Interval</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {schedule.map((item, index) => (

              <tr
                key={index}
                style={{
                  textAlign: "center",
                  background: "#F5F5F5"
                }}
              >

                <td>{item.Crowd_Level}</td>

                <td>{item.Current_Interval}</td>

                <td>{item.Recommended_Interval}</td>

                <td>{item.Action}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>
  );
}

export default Schedule;