import Navbar from "../components/Navbar";

const alerts = [
  {
    station: "Central",
    level: "High",
    message: "Increase train frequency immediately."
  },
  {
    station: "Airport",
    level: "Medium",
    message: "Deploy additional staff."
  },
  {
    station: "Tech Park",
    level: "Low",
    message: "Normal operation."
  }
];

function Alerts() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "#f4f8ff"
        }}
      >
        <h1 style={{ color: "#1565C0" }}>
          🚨 Metro Alerts
        </h1>

        {alerts.map((alert, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              marginTop: "20px",
              borderLeft: "8px solid red",
              borderRadius: "10px",
              boxShadow: "0px 5px 10px rgba(0,0,0,.2)"
            }}
          >
            <h2>{alert.station}</h2>

            <p>
              <strong>Crowd Level:</strong> {alert.level}
            </p>

            <p>
              <strong>Recommendation:</strong> {alert.message}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Alerts;