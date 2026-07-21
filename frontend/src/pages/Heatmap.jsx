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

  return (

    <>
      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center">
          🔥 Metro Congestion Heatmap
        </h1>

        <p className="text-center text-muted">
          Real-Time Crowd Density Across Metro Stations
        </p>

        <div className="row mt-4">

          {stations.map((station, index) => (

            <div
              className="col-md-4 mb-4"
              key={index}
            >

              <div
                className={`card text-center shadow p-4 ${
                  station.Crowd_Level === "High"
                    ? "bg-danger text-white"
                    : station.Crowd_Level === "Medium"
                    ? "bg-warning"
                    : "bg-success text-white"
                }`}
              >

                <h4>{station.Station}</h4>

                <h5>{station.Passenger_Count} Passengers</h5>

                <h5>{station.Crowd_Level} Crowd</h5>

                <p>
                  {station.Recommended_Frequency}
                </p>

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