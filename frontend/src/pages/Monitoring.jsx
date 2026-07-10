import Navbar from "../components/Navbar";

const stations = [
  {
    name: "Airport",
    crowd: "Medium",
    passengers: 4820,
    congestion: "55%"
  },
  {
    name: "Central",
    crowd: "High",
    passengers: 6200,
    congestion: "82%"
  },
  {
    name: "University",
    crowd: "Low",
    passengers: 2300,
    congestion: "28%"
  },
  {
    name: "Tech Park",
    crowd: "Medium",
    passengers: 4150,
    congestion: "60%"
  },
  {
    name: "City Center",
    crowd: "High",
    passengers: 7000,
    congestion: "90%"
  }
];

function Monitoring() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "#f5f7fa"
        }}
      >
        <h1 style={{ color: "#1565C0" }}>
          🚉 Station Monitoring
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "30px"
          }}
        >
          {stations.map((station, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0,0,0,.2)"
              }}
            >
              <h2>{station.name}</h2>

              <p>
                <b>Crowd :</b> {station.crowd}
              </p>

              <p>
                <b>Passengers :</b> {station.passengers}
              </p>

              <p>
                <b>Congestion :</b> {station.congestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Monitoring;