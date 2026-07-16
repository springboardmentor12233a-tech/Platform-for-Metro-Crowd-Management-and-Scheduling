import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Prediction() {
  const [formData, setFormData] = useState({
    Passenger_Count: "",
    Occupancy_Percent: "",
    Delay_Minutes: "",
    Number_of_Trips: "",
    Train_Frequency_Per_Hour: "",
    Train_Speed_kmph: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/predict", formData);

console.log("Prediction Response:", response.data);

setResult(response.data);
    } catch (error) {
      console.log(error);
      alert("Prediction Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">
          AI Crowd Prediction
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label>Passenger Count</label>
              <input
                type="number"
                className="form-control"
                name="Passenger_Count"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Occupancy (%)</label>
              <input
                type="number"
                className="form-control"
                name="Occupancy_Percent"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Delay (Minutes)</label>
              <input
                type="number"
                className="form-control"
                name="Delay_Minutes"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Number of Trips</label>
              <input
                type="number"
                className="form-control"
                name="Number_of_Trips"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Train Frequency / Hour</label>
              <input
                type="number"
                className="form-control"
                name="Train_Frequency_Per_Hour"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Train Speed (km/h)</label>
              <input
                type="number"
                className="form-control"
                name="Train_Speed_kmph"
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button className="btn btn-primary w-100">
            Predict Crowd Level
          </button>

        </form>

        {result && (

          <div className="card shadow mt-5 p-4">

            <h3>Prediction Result</h3>

            <h4>
              Crowd Level :
              <span className="text-danger">
                {" "}
                {result.Crowd_Level}
              </span>
            </h4>

            <h5>
              Recommendation :
            </h5>

            <p>{result.Recommendation}</p>

          </div>

        )}

      </div>
    </>
  );
}

export default Prediction;