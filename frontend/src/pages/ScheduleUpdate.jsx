import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function ScheduleUpdate() {

  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {

    const loadUpdate = () => {

      api.get("/schedule/update")
        .then((res) => {

          setData(res.data);

          setLastUpdated(
            new Date().toLocaleTimeString()
          );

        })
        .catch((err) => {
          console.log(err);
        });

    };

    loadUpdate();

    const interval = setInterval(loadUpdate, 5000);

    return () => clearInterval(interval);

  }, []);

  if (!data) {

    return (

      <>
        <Navbar />

        <div
          className="container text-center"
          style={{ marginTop: "120px" }}
        >

          <div
            className="spinner-border text-primary"
            style={{
              width: "5rem",
              height: "5rem"
            }}
          ></div>

          <h2 className="mt-4">
            Fetching Live Schedule...
          </h2>

          <p className="text-muted">
            Connecting to MetroFlow Server
          </p>

        </div>

        <Footer />
      </>

    );

  }

  const progress =
    data.Passenger_Count >= 800
      ? 95
      : data.Passenger_Count >= 600
      ? 75
      : data.Passenger_Count >= 400
      ? 55
      : 30;

  return (

    <>
      <Navbar />

      <div className="container-fluid bg-light py-5">

        {/* Header */}

        <div className="text-center mb-5">

          <h1
            className="fw-bold"
            style={{
              color: "#0d6efd"
            }}
          >
            🚆 Live Schedule Updates
          </h1>

          <p className="text-muted fs-5">

            AI Powered Real-Time Metro Schedule Monitoring

          </p>

          <span className="badge bg-success fs-6">

            🟢 Auto Refresh Every 5 Seconds

          </span>

        </div>

        {/* Status Cards */}

        <div className="row mb-5">

          <div className="col-md-4">

            <div className="card shadow border-0 text-center p-4">

              <h5>🚉 Current Station</h5>

              <h3 className="text-primary">

                {data.Station}

              </h3>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-0 text-center p-4">

              <h5>👥 Passenger Count</h5>

              <h3 className="text-success">

                {data.Passenger_Count}

              </h3>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-0 text-center p-4">

              <h5>🕒 Last Updated</h5>

              <h3 className="text-danger">

                {lastUpdated}

              </h3>

            </div>

          </div>

        </div>

        {/* Main Card */}

        <div
          className="card shadow-lg border-0 p-5"
          style={{
            borderRadius: "20px"
          }}
        >

          <h2 className="text-center mb-4">

            🚄 Updated Train Schedule

          </h2>

          <table className="table table-hover">

            <tbody>

              <tr>

                <th>🚉 Station</th>

                <td>{data.Station}</td>

              </tr>

              <tr>

                <th>👥 Passenger Count</th>

                <td>{data.Passenger_Count}</td>

              </tr>

              <tr>

                <th>🚆 Updated Frequency</th>

                <td>

                  <span className="badge bg-primary fs-6">

                    {data.Updated_Frequency}

                  </span>

                </td>

              </tr>

              <tr>

                <th>⚠ Reason</th>

                <td>

                  {data.Reason}

                </td>

              </tr>

            </tbody>

          </table>

          {/* Passenger Density */}

          <div className="mt-5">

            <h5>

              Passenger Density

            </h5>

            <div className="progress">

              <div
                className={`progress-bar ${
                  progress > 80
                    ? "bg-danger"
                    : progress > 60
                    ? "bg-warning"
                    : "bg-success"
                }`}
                style={{
                  width: progress + "%"
                }}
              >

                {progress}%

              </div>

            </div>

          </div>

          {/* AI Recommendation */}

          <div className="alert alert-info mt-5">

            <h5>

              🤖 AI Recommendation

            </h5>

            {data.Passenger_Count >= 800 && (
              <p>

                Increase train frequency immediately to reduce congestion.

              </p>
            )}

            {data.Passenger_Count >= 600 &&
              data.Passenger_Count < 800 && (
                <p>

                  Additional trains should be scheduled during peak hours.

                </p>
              )}

            {data.Passenger_Count >= 400 &&
              data.Passenger_Count < 600 && (
                <p>

                  Continue monitoring passenger flow.

                </p>
              )}

            {data.Passenger_Count < 400 && (
              <p>

                Metro operations are running normally.

              </p>
            )}

          </div>

          {/* Live Status */}

          <div className="alert alert-success text-center">

            ✅ Live schedule synchronized successfully.

          </div>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default ScheduleUpdate;