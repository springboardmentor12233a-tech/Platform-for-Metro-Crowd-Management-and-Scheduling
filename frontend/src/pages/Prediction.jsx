import { useEffect, useState } from "react";

function Prediction() {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    From_Station: "",
    To_Station: "",
    Distance_km: "",
    Fare: "",
    Cost_per_passenger: "",
    Ticket_Type: "",
    Day: "",
    Month: "",
  });

  const [routeDetails, setRouteDetails] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load station names
  useEffect(() => {
    fetch("http://127.0.0.1:8000/metro-stations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load stations");
        }
        return response.json();
      })
      .then((data) => {
  const stationNames = data.map((item) => item.Station);
  setStations([...new Set(stationNames)].sort());
})
      .catch((err) => {
        console.error(err);
        setError("Unable to load stations.");
      });
  }, []);

  // When From and To stations are selected
  useEffect(() => {
    if (!formData.From_Station || !formData.To_Station) {
      setRouteDetails(null);
      return;
    }

    if (formData.From_Station === formData.To_Station) {
      setError("From and To stations cannot be the same.");
      setRouteDetails(null);
      return;
    }

    setError("");

    fetch(
      `http://127.0.0.1:8000/route-details?from_station=${encodeURIComponent(
        formData.From_Station
      )}&to_station=${encodeURIComponent(formData.To_Station)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Route not found");
        }
        return response.json();
      })
      .then((data) => {
        setRouteDetails(data);

        // Automatically fill route information
        setFormData((prev) => ({
          ...prev,
          Distance_km: data.Distance_km,
          Fare: data.Fare,
          Cost_per_passenger: data.Cost_per_passenger,
        }));
      })
      .catch((err) => {
        console.error(err);
        setRouteDetails(null);
        setError(
          "Route details not found for the selected stations."
        );
      });
  }, [formData.From_Station, formData.To_Station]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePredict = async () => {
    setError("");
    setPrediction(null);

    const requiredFields = [
      "From_Station",
      "To_Station",
      "Distance_km",
      "Fare",
      "Cost_per_passenger",
      "Ticket_Type",
      "Day",
      "Month",
    ];

    for (const key of requiredFields) {
      if (!formData[key]) {
        setError("Please fill all required fields.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict-crowd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            From_Station: formData.From_Station,
            To_Station: formData.To_Station,
            Distance_km: Number(formData.Distance_km),
            Fare: Number(formData.Fare),
            Cost_per_passenger: Number(
              formData.Cost_per_passenger
            ),
            Ticket_Type: formData.Ticket_Type,
            Day: Number(formData.Day),
            Month: Number(formData.Month),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setPrediction(data.predicted_passengers);
    } catch (err) {
      console.error(err);
      setError("Unable to get prediction from AI model.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#0f172a" }}>
        🤖 AI Crowd Prediction
      </h1>

      <p style={{ color: "#64748b" }}>
        Select metro stations and trip details to predict the
        expected passenger count.
      </p>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          marginTop: "25px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          {/* FROM STATION */}
          <select
            name="From_Station"
            value={formData.From_Station}
            onChange={handleChange}
          >
            <option value="">Select From Station</option>

            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>

          {/* TO STATION */}
          <select
            name="To_Station"
            value={formData.To_Station}
            onChange={handleChange}
          >
            <option value="">Select To Station</option>

            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>

          {/* DISTANCE */}
          <input
            name="Distance_km"
            type="number"
            placeholder="Distance (km)"
            value={formData.Distance_km}
            readOnly
          />

          {/* FARE */}
          <input
            name="Fare"
            type="number"
            placeholder="Fare"
            value={formData.Fare}
            readOnly
          />

          {/* COST */}
          <input
            name="Cost_per_passenger"
            type="number"
            placeholder="Cost per Passenger"
            value={formData.Cost_per_passenger}
            readOnly
          />

          {/* TICKET TYPE */}
          <select
            name="Ticket_Type"
            value={formData.Ticket_Type}
            onChange={handleChange}
          >
            <option value="">Select Ticket Type</option>
            <option value="Single">Single</option>
            <option value="Smart Card">Smart Card</option>
            <option value="Tourist Card">Tourist Card</option>
          </select>

          {/* DAY */}
          <input
            name="Day"
            type="number"
            min="1"
            max="31"
            placeholder="Day"
            value={formData.Day}
            onChange={handleChange}
          />

          {/* MONTH */}
          <input
            name="Month"
            type="number"
            min="1"
            max="12"
            placeholder="Month"
            value={formData.Month}
            onChange={handleChange}
          />
        </div>

        {/* ROUTE INFORMATION */}
        {routeDetails && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ color: "#0f172a" }}>
              🚇 Selected Route Details
            </h3>

            <p>
              <strong>From:</strong>{" "}
              {routeDetails.From_Station}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {routeDetails.To_Station}
            </p>

            <p>
              <strong>Distance:</strong>{" "}
              {routeDetails.Distance_km} km
            </p>

            <p>
              <strong>Fare:</strong> ₹{routeDetails.Fare}
            </p>

            <p>
              <strong>Cost per Passenger:</strong>{" "}
              ₹{routeDetails.Cost_per_passenger}
            </p>

            {routeDetails.travel_time && (
              <p>
                <strong>Travel Time:</strong>{" "}
                {routeDetails.travel_time}
              </p>
            )}
          </div>
        )}

        {/* PREDICT BUTTON */}
        <button
          onClick={handlePredict}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "25px",
            padding: "14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Predicting..."
            : "🔮 Predict Crowd"}
        </button>

        {/* ERROR */}
        {error && (
          <p
            style={{
              marginTop: "18px",
              color: "#dc2626",
              fontWeight: "600",
            }}
          >
            {error}
          </p>
        )}

        {/* PREDICTION */}
        {prediction !== null && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#eff6ff",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#1d4ed8" }}>
              🤖 AI Prediction
            </h3>

            <h1 style={{ color: "#0f172a" }}>
              {Number(prediction).toFixed(2)}
            </h1>

            <p style={{ color: "#475569" }}>
              Predicted passengers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prediction;