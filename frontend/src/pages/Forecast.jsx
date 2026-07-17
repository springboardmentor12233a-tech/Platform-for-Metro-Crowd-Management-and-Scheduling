import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaChartLine,
  FaMapMarkerAlt,
  FaUsers,
  FaRobot,
  FaCheckCircle
} from "react-icons/fa";

function Forecast() {

  const [forecast, setForecast] = useState(null);

  useEffect(() => {

    api.get("/forecast")
      .then((res) => {

        console.log("Forecast:", res.data);

        setForecast(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

  if (!forecast) {

    return (

      <>
        <Navbar />

        <div className="container text-center mt-5">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Forecast...
          </h3>

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
          📈 Passenger Demand Forecast
        </h1>

        <p className="text-center text-muted">
          AI-Based Passenger Demand Forecasting using Machine Learning
        </p>

        <hr />

        <div className="row">

          {/* Station */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaMapMarkerAlt
                size={40}
                className="text-danger mx-auto"
              />

              <h5 className="mt-3">
                Station
              </h5>

              <h3>
                {forecast.Station}
              </h3>

            </div>

          </div>

          {/* Predicted Passengers */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaUsers
                size={40}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">
                Predicted Passenger Count
              </h5>

              <h2>
                {forecast.Predicted_Passenger_Count}
              </h2>

            </div>

          </div>

          {/* Recommendation */}

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaRobot
                size={40}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">
                AI Recommendation
              </h5>

              <h5>
                {forecast.Recommendation}
              </h5>

            </div>

          </div>

        </div>

        {/* Forecast Summary */}

        <div className="card shadow mt-4 p-4">

          <h3 className="text-center mb-3">
            <FaChartLine /> Forecast Summary
          </h3>

          <p>
            The AI forecasting model predicts that approximately
            <strong> {forecast.Predicted_Passenger_Count} </strong>
            passengers are expected at
            <strong> {forecast.Station}</strong>.
          </p>

          <p>
            Based on the prediction, the recommended action is:
          </p>

          <div className="alert alert-info">

            <strong>{forecast.Recommendation}</strong>

          </div>

        </div>

        {/* Status */}

        <div className="alert alert-success mt-4 text-center">

          <FaCheckCircle />

          {" "}

          Forecast generated successfully using the trained Machine Learning model.

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Forecast;