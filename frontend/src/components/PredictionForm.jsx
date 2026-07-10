import { useState } from "react";
import API from "../services/api";
import ResultCard from "./ResultCard";
function PredictionForm() {
  const [recommendation, setRecommendation] = useState("");
  const [formData, setFormData] = useState({
    Date: "2026-01-01",
    Time: "05:00",
    Day: "Thursday",
    Is_Holiday: 0,
    Weather: "Sunny",
    Station: "Airport",
    From_Station: "Market",
    To_Station: "Airport",
    Passenger_Entries: 500,
    Passenger_Exits: 450,
    Passenger_Count: 950,
    Occupancy_Percent: 70,
    Train_Speed_kmph: 60,
    Number_of_Trips: 8,
    Delay_Minutes: 2,
    Peak_Hour: 1,
    Train_Frequency_Per_Hour: 6
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      const response = await API.post("/predict", formData);

      setResult(response.data.Crowd_Level);
      setRecommendation(response.data.Recommendation);

    }
    catch(error){

      console.log(error);

      alert("Prediction Failed");

    }

  };

  return (

    <div>

      <h2>Metro Crowd Prediction</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="date"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
        />

        <br/><br/>

        <input
          type="time"
          name="Time"
          value={formData.Time}
          onChange={handleChange}
        />

        <br/><br/>

        <select name="Day" value={formData.Day} onChange={handleChange}>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>

        <br/><br/>

        <select name="Weather" value={formData.Weather} onChange={handleChange}>
          <option>Sunny</option>
          <option>Cloudy</option>
          <option>Rainy</option>
        </select>

        <br/><br/>

        <select name="Station" value={formData.Station} onChange={handleChange}>

          <option>Airport</option>
          <option>University</option>
          <option>Central</option>
          <option>North Gate</option>
          <option>Stadium</option>
          <option>South Gate</option>
          <option>Market</option>
          <option>Rail Hub</option>
          <option>Tech Park</option>
          <option>City Center</option>

        </select>

        <br/><br/>

        <input
          type="number"
          name="Passenger_Count"
          placeholder="Passenger Count"
          value={formData.Passenger_Count}
          onChange={handleChange}
        />

        <br/><br/>

        <button type="submit">

          Predict Crowd

        </button>

      </form>

      <br/>

      <h2>

        Crowd Level : {result}

      </h2>
      <h3>
       AI Recommendation : {recommendation}
    </h3>

    </div>

  );

}

export default PredictionForm;