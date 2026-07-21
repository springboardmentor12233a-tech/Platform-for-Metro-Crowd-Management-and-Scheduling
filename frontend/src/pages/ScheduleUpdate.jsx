import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function ScheduleUpdate() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const loadUpdate = () => {

      api.get("/schedule/update")
        .then((res) => {
          setData(res.data);
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

        <div className="container text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <h3>Loading Schedule Updates...</h3>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center">
          🚆 Live Schedule Updates
        </h1>

        <div className="card shadow p-4 mt-4">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th>Station</th>
                <td>{data.Station}</td>
              </tr>

              <tr>
                <th>Passenger Count</th>
                <td>{data.Passenger_Count}</td>
              </tr>

              <tr>
                <th>Updated Frequency</th>
                <td>{data.Updated_Frequency}</td>
              </tr>

              <tr>
                <th>Reason</th>
                <td>{data.Reason}</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default ScheduleUpdate;