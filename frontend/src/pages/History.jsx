import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/history/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch prediction history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteHistory = async (id) => {
    if (!window.confirm("Delete this prediction history?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchHistory();
    } catch (error) {
      console.log(error);
      alert("Unable to delete record");
    }
  };

  const filteredHistory = history.filter((item) =>
    item.station_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h2>Prediction History</h2>

      <input
        type="text"
        placeholder="Search by Station"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "white" }}>
            <th>ID</th>
            <th>Station</th>
            <th>Passengers</th>
            <th>Prediction</th>
            <th>Type</th>
            <th>Predicted By</th>
            <th>Date & Time</th>

            {role === "Admin" && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {filteredHistory.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">
                No Prediction History Found
              </td>
            </tr>
          ) : (
            filteredHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.station_name}</td>
                <td>{item.passenger_count}</td>
                <td>{item.predicted_crowd}</td>
                <td>{item.prediction_type}</td>
                <td>{item.predicted_by}</td>
                <td>{item.created_at}</td>

                {role === "Admin" && (
                  <td>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default History; 