import { useState, useEffect } from "react";
import axios from "axios";

const CrowdPrediction = () => {
  const [formData, setFormData] = useState({
    from_station: "",
    to_station: "",
    distance: "",
    fare: "",
    ticket_type: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [stations, setStations] = useState([]);
 const ticketTypes = [
  "Return",
  "Single",
  "Smart Card",
  "Tourist Card",
];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
  loadStations();
}, []);

const loadStations = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/prediction/stations"
    );

    setStations(res.data.stations);
  } catch (err) {
    console.log(err);
  }
};

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/prediction/predict-crowd",
        {
          ...formData,
          distance: parseFloat(formData.distance),
          fare: parseFloat(formData.fare),
        }
      );

      setResult(res.data.predicted_crowd);
    } catch (err) {
      alert("Prediction Failed");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#0d47a1" }}>Crowd Prediction</h1>

      <form
        onSubmit={handlePredict}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          marginTop: "20px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>From Station</label>

          <select
            name="from_station"
            value={formData.from_station}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="">Select</option>

            {stations.map((station) => (
              <option key={station}>{station}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>To Station</label>

          <select
            name="to_station"
            value={formData.to_station}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="">Select</option>

            {stations.map((station) => (
              <option key={station}>{station}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Distance (KM)</label>

          <input
            type="number"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Fare</label>

          <input
            type="number"
            name="fare"
            value={formData.fare}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Ticket Type</label>

          <select
            name="ticket_type"
            value={formData.ticket_type}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="">Select</option>

            {ticketTypes.map((type) => (
              <option key={type} value={type}>
               {type}
             </option>
            ))}
          </select>
        </div>

        <button
          style={{
            background: "#1565c0",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Predicting..." : "Predict Crowd"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "30px",
            background: "#4caf50",
            color: "white",
            padding: "25px",
            borderRadius: "10px",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Predicted Crowd : {result}
        </div>
      )}
    </div>
  );
};

export default CrowdPrediction;