// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import api from "../services/api";

// import {
//   FaChartLine,
//   FaMapMarkerAlt,
//   FaUsers,
//   FaRobot,
//   FaCheckCircle
// } from "react-icons/fa";

// function Forecast() {

//   const [forecast, setForecast] = useState(null);

//   useEffect(() => {

//     api.get("/forecast")
//       .then((res) => {

//         console.log("Forecast:", res.data);

//         setForecast(res.data);

//       })
//       .catch((err) => {

//         console.log(err);

//       });

//   }, []);

//   if (!forecast) {

//     return (

//       <>
//         <Navbar />

//         <div className="container text-center mt-5">

//           <div className="spinner-border text-primary"></div>

//           <h3 className="mt-3">
//             Loading Forecast...
//           </h3>

//         </div>

//         <Footer />

//       </>

//     );

//   }

//   return (

//     <>

//       <Navbar />

//       <div className="container mt-5">

//         <h1 className="text-center">
//           📈 Passenger Demand Forecast
//         </h1>

//         <p className="text-center text-muted">
//           AI-Based Passenger Demand Forecasting using Machine Learning
//         </p>

//         <hr />

//         <div className="row">

//           {/* Station */}

//           <div className="col-md-4 mb-4">

//             <div className="card shadow text-center p-4 h-100">

//               <FaMapMarkerAlt
//                 size={40}
//                 className="text-danger mx-auto"
//               />

//               <h5 className="mt-3">
//                 Station
//               </h5>

//               <h3>
//                 {forecast.Station}
//               </h3>

//             </div>

//           </div>

//           {/* Predicted Passengers */}

//           <div className="col-md-4 mb-4">

//             <div className="card shadow text-center p-4 h-100">

//               <FaUsers
//                 size={40}
//                 className="text-primary mx-auto"
//               />

//               <h5 className="mt-3">
//                 Predicted Passenger Count
//               </h5>

//               <h2>
//                 {forecast.Predicted_Passenger_Count}
//               </h2>

//             </div>

//           </div>

//           {/* Recommendation */}

//           <div className="col-md-4 mb-4">

//             <div className="card shadow text-center p-4 h-100">

//               <FaRobot
//                 size={40}
//                 className="text-success mx-auto"
//               />

//               <h5 className="mt-3">
//                 AI Recommendation
//               </h5>

//               <h5>
//                 {forecast.Recommendation}
//               </h5>

//             </div>

//           </div>

//         </div>

//         {/* Forecast Summary */}

//         <div className="card shadow mt-4 p-4">

//           <h3 className="text-center mb-3">
//             <FaChartLine /> Forecast Summary
//           </h3>

//           <p>
//             The AI forecasting model predicts that approximately
//             <strong> {forecast.Predicted_Passenger_Count} </strong>
//             passengers are expected at
//             <strong> {forecast.Station}</strong>.
//           </p>

//           <p>
//             Based on the prediction, the recommended action is:
//           </p>

//           <div className="alert alert-info">

//             <strong>{forecast.Recommendation}</strong>

//           </div>

//         </div>

//         {/* Status */}

//         <div className="alert alert-success mt-4 text-center">

//           <FaCheckCircle />

//           {" "}

//           Forecast generated successfully using the trained Machine Learning model.

//         </div>

//       </div>

//       <Footer />

//     </>

//   );

// }

// export default Forecast;


import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaChartLine,
  FaMapMarkerAlt,
  FaUsers,
  FaRobot,
  FaCheckCircle,
  FaTrain,
  FaExclamationTriangle,
  FaChartBar,
  FaLightbulb,
  FaClock
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
            Loading AI Forecast...
          </h3>

        </div>

        <Footer />

      </>

    );

  }

  const crowdLevel =
    forecast.Predicted_Passenger_Count >= 800
      ? "High"
      : forecast.Predicted_Passenger_Count >= 500
      ? "Medium"
      : "Low";

  const frequency =
    forecast.Predicted_Passenger_Count >= 800
      ? "Every 3 Minutes"
      : forecast.Predicted_Passenger_Count >= 500
      ? "Every 5 Minutes"
      : "Every 10 Minutes";

  return (

<>
<Navbar/>

<div className="container mt-5">

<h1 className="text-center fw-bold">
📈 AI Passenger Demand Forecast
</h1>

<p className="text-center text-muted">
Machine Learning Based Passenger Demand Forecasting System
</p>

<hr/>

<div className="row">

<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaMapMarkerAlt
size={40}
className="text-danger mx-auto"/>

<h5 className="mt-3">
Station
</h5>

<h3>
{forecast.Station}
</h3>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaUsers
size={40}
className="text-primary mx-auto"/>

<h5 className="mt-3">

Predicted Passengers

</h5>

<h2>

{forecast.Predicted_Passenger_Count}

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaRobot
size={40}
className="text-success mx-auto"/>

<h5 className="mt-3">

AI Recommendation

</h5>

<h5>

{forecast.Recommendation}

</h5>

</div>

</div>

</div>



<div className="row">

<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4">

<FaChartBar
size={40}
className="text-info mx-auto"/>

<h5 className="mt-3">

Expected Crowd

</h5>

<h2>

{crowdLevel}

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4">

<FaTrain
size={40}
className="text-primary mx-auto"/>

<h5 className="mt-3">

Train Frequency

</h5>

<h4>

{frequency}

</h4>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4">

<FaClock
size={40}
className="text-warning mx-auto"/>

<h5 className="mt-3">

Forecast Status

</h5>

<h4 className="text-success">

Generated

</h4>

</div>

</div>

</div>



<div className="card shadow p-4 mt-4">

<h3>

Prediction Meter

</h3>

<div
className="progress mt-3"
style={{height:"35px"}}
>

<div

className={`progress-bar ${
crowdLevel==="High"
?"bg-danger"
:crowdLevel==="Medium"
?"bg-warning"
:"bg-success"
}`}

style={{
width:`${Math.min(forecast.Predicted_Passenger_Count/10,100)}%`
}}

>

{forecast.Predicted_Passenger_Count}

</div>

</div>

</div>
      {/* Forecast Summary */}

      <div className="card shadow mt-4 p-4">

        <h3>
          <FaChartLine /> Forecast Summary
        </h3>

        <p className="mt-3">
          Based on the trained Machine Learning model,
          approximately
          <strong> {forecast.Predicted_Passenger_Count} </strong>
          passengers are expected at
          <strong> {forecast.Station}</strong>.
        </p>

        <p>
          The AI system predicts a
          <strong> {crowdLevel} </strong>
          crowd level and recommends:
        </p>

        <div className="alert alert-info">
          <strong>{forecast.Recommendation}</strong>
        </div>

      </div>



      {/* Operational Alert */}

      <div
        className={`alert mt-4 ${
          crowdLevel === "High"
            ? "alert-danger"
            : crowdLevel === "Medium"
            ? "alert-warning"
            : "alert-success"
        }`}
      >

        <h3>
          <FaExclamationTriangle />
          {" "}
          Operational Alert
        </h3>

        <h5>

          {crowdLevel === "High" &&
            "Heavy passenger demand expected. Increase train frequency immediately."}

          {crowdLevel === "Medium" &&
            "Moderate passenger demand expected. Monitor operations continuously."}

          {crowdLevel === "Low" &&
            "Passenger demand is normal. Continue regular operations."}

        </h5>

      </div>



      {/* AI Insights */}

      <div className="card shadow mt-4 p-4">

        <h3>

          <FaLightbulb />

          {" "}

          AI Insights

        </h3>

        <ul className="list-group mt-3">

          <li className="list-group-item">
            Forecast generated using trained Random Forest model.
          </li>

          <li className="list-group-item">
            Passenger demand analyzed using historical metro data.
          </li>

          <li className="list-group-item">
            AI recommendation automatically generated.
          </li>

          <li className="list-group-item">
            Future passenger traffic estimated successfully.
          </li>

        </ul>

      </div>



      {/* Forecast Statistics */}

      <div className="card shadow mt-4 p-4">

        <h3>Forecast Statistics</h3>

        <table className="table table-bordered table-striped mt-3">

          <thead className="table-primary">

            <tr>

              <th>Metric</th>

              <th>Value</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>Station</td>

              <td>{forecast.Station}</td>

            </tr>

            <tr>

              <td>Predicted Passengers</td>

              <td>{forecast.Predicted_Passenger_Count}</td>

            </tr>

            <tr>

              <td>Expected Crowd</td>

              <td>{crowdLevel}</td>

            </tr>

            <tr>

              <td>Train Frequency</td>

              <td>{frequency}</td>

            </tr>

            <tr>

              <td>Recommendation</td>

              <td>{forecast.Recommendation}</td>

            </tr>

          </tbody>

        </table>

      </div>



      {/* AI Recommendation */}

      <div className="card shadow mt-4 p-4">

        <h3>
          <FaRobot />
          {" "}
          AI Recommendation Panel
        </h3>

        <h4 className="mt-3">

          {crowdLevel === "High" &&
            "Increase Train Frequency • Deploy Additional Staff • Open Extra Gates"}

          {crowdLevel === "Medium" &&
            "Increase Monitoring • Keep Standby Train Ready"}

          {crowdLevel === "Low" &&
            "Normal Metro Operations"}

        </h4>

      </div>



      {/* Model Status */}

      <div className="card shadow mt-4 p-4">

        <h3>Machine Learning Model Status</h3>

        <ul className="list-group mt-3">

          <li className="list-group-item d-flex justify-content-between">

            Forecast Model

            <span className="badge bg-success">

              Active

            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            Prediction API

            <span className="badge bg-success">

              Running

            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            AI Engine

            <span className="badge bg-success">

              Connected

            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            Forecast Status

            <span className="badge bg-primary">

              Updated

            </span>

          </li>

        </ul>

      </div>



      {/* Today's Forecast Summary */}

      <div className="card shadow mt-4 mb-5 p-4">

        <h3>Today's Forecast Summary</h3>

        <div className="row text-center mt-4">

          <div className="col-md-3">

            <h5>Station</h5>

            <h3>{forecast.Station}</h3>

          </div>

          <div className="col-md-3">

            <h5>Passengers</h5>

            <h3>{forecast.Predicted_Passenger_Count}</h3>

          </div>

          <div className="col-md-3">

            <h5>Crowd</h5>

            <h3>{crowdLevel}</h3>

          </div>

          <div className="col-md-3">

            <h5>Frequency</h5>

            <h4>{frequency}</h4>

          </div>

        </div>

      </div>



      {/* Success */}

      <div className="alert alert-success text-center mb-5">

        <FaCheckCircle />

        {" "}

        Forecast generated successfully using the trained Machine Learning model.

      </div>

</div>

<Footer/>

</>

);

}

export default Forecast;