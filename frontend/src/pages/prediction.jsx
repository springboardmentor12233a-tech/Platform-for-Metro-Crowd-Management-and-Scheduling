import { useState } from "react";
import "../styles/Prediction.css";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";

function Prediction() {

   const role = localStorage.getItem("role");

  const Layout = role === "ADMIN" ? MainLayout : UserLayout;

  const [formData, setFormData] = useState({

    From_Station: "",
    To_Station: "",
    Distance_km: "",
    Fare: "",
    Cost_per_passenger: "",
    Ticket_Type: "",
    Remarks: "",
    Month: "",
    Weekday: "",
    Hour: "",
    Weather: "",
    Is_Holiday: 0,
    Is_Peak_Hour: 0,

  });


  const [prediction, setPrediction] = useState(null);

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);



  const stations = [
    "Rajiv Chowk",
    "AIIMS",
    "Kashmere Gate",
    "Central Secretariat",
    "Hauz Khas",
    "Noida Sector 18",
    "Dwarka Sector 21",
    "Botanical Garden"
  ];


  const ticketTypes = [
    "Token",
    "Smart Card",
    "QR Ticket"
  ];


  const remarks = [
    "Normal",
    "Festival",
    "Weekend",
    "Event"
  ];


  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];


  const weatherOptions = [
    "Sunny",
    "Cloudy",
    "Rainy"
  ];


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];



  const handleChange = (e)=>{
    const {name,value}=e.target;
    setFormData({

      ...formData,

      [name]:

      (
        name==="Month" ||
        name==="Hour" ||
        name==="Is_Holiday" ||
        name==="Is_Peak_Hour"
      )

      ?
      Number(value)
      :
      value
    });
  };



  const predictDemand = async()=>{
    try{
      setLoading(true);
      console.log("Sending data:",formData);
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
             "Authorization":`Bearer ${localStorage.getItem("token")}`
          },
          body:JSON.stringify(formData)
        }
      );
      const data = await response.json();
      console.log("Backend Response:",data);



      if(!response.ok){
        alert(JSON.stringify(data));
        return;
      }


      setPrediction(
        Number(data.predicted_passengers)
      );


      setAnalysis({
        from_station: data.from_station,
        to_station: data.to_station,
        crowd_level: data.crowd_level,
        platform_status: data.platform_status,
        recommended_train_interval: data.recommended_train_interval,
        extra_trains: data.extra_trains,
        recommendation: data.recommendation
    });

      console.log("Analysis Data:", data);

    }

    catch(error){

      console.log(error);

      alert("Prediction Failed");

    }


    finally{

      setLoading(false);

    }


  };

  return (
    <Layout>
    <div className="prediction-page">
      <div className="prediction-card">
        <h1>
          🚇 MetroFlow AI
        </h1>

        <h3>
          Passenger Demand Prediction
        </h3>
        <div className="stats">
          <div className="stat-card">
            <h4>
              Predicted Demand
            </h4>
            <h2>
              {
                prediction !== null
                ? prediction
                : "--"
              }

            </h2>
            <p>
              Passengers
            </p>
          </div>
          <div className="stat-card">
            <h4>
              Weather
            </h4>
            <h2>
              {
                formData.Weather || "--"
              }
            </h2>
          </div>
          <div className="stat-card">
            <h4>
              Peak Hour
            </h4>
            <h2>
              {
                formData.Is_Peak_Hour === 1
                ?
                "YES"
                :
                "NO"
              }

            </h2>


          </div>


        </div>





        <div className="grid">

          <select

            name="From_Station"

            value={formData.From_Station}

            onChange={handleChange}

          >

            <option value="">
              Select From Station
            </option>


            {
              stations.map((station)=>(

                <option
                  key={station}
                  value={station}
                >

                  {station}

                </option>

              ))
            }


          </select>





          <select

            name="To_Station"

            value={formData.To_Station}

            onChange={handleChange}

          >


            <option value="">
              Select To Station
            </option>


            {
              stations.map((station)=>(

                <option
                  key={station}
                  value={station}
                >

                  {station}

                </option>

              ))
            }


          </select>





          <input

            type="number"

            name="Distance_km"

            value={formData.Distance_km}

            placeholder="Distance (km)"

            onChange={handleChange}

          />





          <input

            type="number"

            name="Fare"

            value={formData.Fare}

            placeholder="Fare"

            onChange={handleChange}

          />





          <input

            type="number"

            name="Cost_per_passenger"

            value={formData.Cost_per_passenger}

            placeholder="Cost Per Passenger"

            onChange={handleChange}

          />





          <select

            name="Ticket_Type"

            value={formData.Ticket_Type}

            onChange={handleChange}

          >

            <option value="">
              Ticket Type
            </option>


            {
              ticketTypes.map((item)=>(

                <option
                  key={item}
                  value={item}
                >

                  {item}

                </option>

              ))
            }


          </select>





          <select

            name="Remarks"

            value={formData.Remarks}

            onChange={handleChange}

          >

            <option value="">
              Remarks
            </option>


            {
              remarks.map((item)=>(

                <option
                  key={item}
                  value={item}
                >

                  {item}

                </option>

              ))
            }


          </select>





          <select

            name="Month"

            value={formData.Month}

            onChange={handleChange}

          >

            <option value="">
              Month
            </option>


            {
              months.map((month,index)=>(

                <option

                  key={month}

                  value={index+1}

                >

                  {month}

                </option>

              ))
            }


          </select>





          <select

            name="Weekday"

            value={formData.Weekday}

            onChange={handleChange}

          >


            <option value="">
              Weekday
            </option>


            {
              weekdays.map((day)=>(

                <option
                  key={day}
                  value={day}
                >

                  {day}

                </option>

              ))
            }


          </select>


          <input

            type="number"

            name="Hour"

            value={formData.Hour}

            placeholder="Hour (0-23)"

            onChange={handleChange}

          />





          <select

            name="Weather"

            value={formData.Weather}

            onChange={handleChange}

          >

            <option value="">
              Weather
            </option>


            {
              weatherOptions.map((item)=>(

                <option

                  key={item}

                  value={item}

                >

                  {item}

                </option>

              ))
            }


          </select>





          <select

            name="Is_Holiday"

            value={formData.Is_Holiday}

            onChange={handleChange}

          >

            <option value={0}>
              No Holiday
            </option>


            <option value={1}>
              Holiday
            </option>


          </select>






          <select

            name="Is_Peak_Hour"

            value={formData.Is_Peak_Hour}

            onChange={handleChange}

          >

            <option value={0}>
              Non Peak Hour
            </option>


            <option value={1}>
              Peak Hour
            </option>


          </select>


        </div>





        <button

          className="predict-btn"

          onClick={predictDemand}

          disabled={loading}

        >

          {

            loading

            ?

            "Predicting..."

            :

            "Predict Passenger Demand"

          }


        </button>






        {

          prediction !== null && (


            <div className="result">


              <h2>
                Expected Passenger Demand
              </h2>


              <h1>
                {prediction}
              </h1>


              <h3>
                Passengers
              </h3>




              <hr />



              <h3>
                Route Analysis
              </h3>



              <p>

                <strong>
                  Origin Station:
                </strong>

                {" "}

                {analysis?.from_station}


              </p>




              <p>

                <strong>
                  Destination Station:
                </strong>

                {" "}

                {analysis?.to_station}


              </p>




              <hr />




              <h3>
                Crowd Level
              </h3>



              <div

                className={
                  analysis?.crowd_level === "HIGH"
                  ?
                  "status high"
                  :
                  analysis?.crowd_level === "MODERATE"
                  ?
                  "status medium"
                  :
                  "status low"
                }
              >
                {analysis?.crowd_level}
              </div>
            <div className="operations">
              <h3>🚆 Metro Operations</h3>
              <div className="operation-item">
                  <span>Platform Status: </span>
                  <strong>{analysis?.platform_status}</strong>
              </div>
              <div className="operation-item">
                  <span>Train Interval: </span>
                  <strong>{analysis?.recommended_train_interval}</strong>
              </div>
              <div className="operation-item">
                  <span>Extra Trains: </span>
                  <strong>{analysis?.extra_trains}</strong>
              </div>
          </div>
              <div className="recommendation">
                <h3>
                  🤖 AI Recommendation
                </h3>
                <p>
                  {analysis?.recommendation}
                </p>
              </div>
            </div>
          )
        }
      </div>
    </div>
    </Layout>
  );

}


export default Prediction;
