import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function Heatmap() {

  const [stations, setStations] = useState([]);

  useEffect(() => {
    api.get("/schedule")
      .then((res) => {
        setStations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getCardStyle = (level) => {
    switch (level) {
      case "High":
        return {
          background:
            "linear-gradient(135deg,#ff416c,#ff4b2b)",
          color: "white",
        };

      case "Medium":
        return {
          background:
            "linear-gradient(135deg,#f7971e,#ffd200)",
          color: "black",
        };

      default:
        return {
          background:
            "linear-gradient(135deg,#11998e,#38ef7d)",
          color: "white",
        };
    }
  };

  const getProgress = (level) => {
    if (level === "High") return 95;
    if (level === "Medium") return 65;
    return 30;
  };

  const high = stations.filter(
    (s) => s.Crowd_Level === "High"
  ).length;

  const medium = stations.filter(
    (s) => s.Crowd_Level === "Medium"
  ).length;

  const low = stations.filter(
    (s) => s.Crowd_Level === "Low"
  ).length;

  return (
    <>
      <Navbar />

      <div className="container-fluid p-5 bg-light">

        <div className="text-center mb-5">

          <h1 className="fw-bold text-danger">
            🔥 Metro Congestion Heatmap
          </h1>

          <p className="text-muted fs-5">
            AI-Based Real-Time Metro Crowd Monitoring
          </p>

        </div>

        {/* Summary Cards */}

        <div className="row mb-5">

          <div className="col-md-3">

            <div className="card shadow text-center p-4">

              <h5>Total Stations</h5>

              <h2 className="text-primary">
                {stations.length}
              </h2>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card shadow text-center p-4">

              <h5>🔴 High Crowd</h5>

              <h2 className="text-danger">
                {high}
              </h2>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card shadow text-center p-4">

              <h5>🟠 Medium Crowd</h5>

              <h2 className="text-warning">
                {medium}
              </h2>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card shadow text-center p-4">

              <h5>🟢 Low Crowd</h5>

              <h2 className="text-success">
                {low}
              </h2>

            </div>

          </div>

        </div>

        {/* Heatmap Cards */}

        <div className="row">

          {stations.map((station, index) => (

            <div
              className="col-lg-4 col-md-6 mb-4"
              key={index}
            >

              <div
                className="card shadow-lg border-0"
                style={{
                  ...getCardStyle(station.Crowd_Level),
                  borderRadius: "18px",
                  transition: "0.4s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                }}
              >

                <div className="card-body">

                  <h3 className="fw-bold">
                    🚉 {station.Station}
                  </h3>

                  <hr />

                  <h5>
                    👥 Passengers :
                    {" "}
                    {station.Passenger_Count}
                  </h5>

                  <h5>
                    Crowd :
                    {" "}

                    <span
                      className={`badge ${
                        station.Crowd_Level === "High"
                          ? "bg-danger"
                          : station.Crowd_Level === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {station.Crowd_Level}
                    </span>

                  </h5>

                  <h6 className="mt-3">

                    🚆 Recommended Frequency

                  </h6>

                  <p>

                    {station.Recommended_Frequency}

                  </p>

                  <div className="progress mt-3">

                    <div
                      className={`progress-bar ${
                        station.Crowd_Level === "High"
                          ? "bg-danger"
                          : station.Crowd_Level === "Medium"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      role="progressbar"
                      style={{
                        width:
                          getProgress(
                            station.Crowd_Level
                          ) + "%",
                      }}
                    >

                      {getProgress(
                        station.Crowd_Level
                      )}
                      %

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      <Footer />

    </>
  );
}

export default Heatmap;