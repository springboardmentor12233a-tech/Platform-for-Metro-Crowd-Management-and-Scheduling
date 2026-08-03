import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaUsers,
  FaClock,
  FaPercentage,
  FaChartLine,
  FaTrain,
  FaMapMarkerAlt,
  FaDownload,
  FaRobot,
  FaExclamationTriangle,
  FaServer,
  FaCheckCircle,
  FaChartBar
} from "react-icons/fa";

function Report() {

  const [report, setReport] = useState(null);

  useEffect(() => {

    api.get("/report")
      .then((response) => {

        console.log(response.data);

        setReport(response.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  if (!report) {

    return (

      <>
        <Navbar />

        <div className="container text-center mt-5">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Traffic Report...
          </h3>

        </div>

        <Footer />

      </>

    );

  }

  const performance =
    report.Average_Delay <= 2
      ? "Excellent"
      : report.Average_Delay <= 5
      ? "Good"
      : "Needs Improvement";

  return (

<>
<Navbar/>

<div className="container mt-5">

<h1 className="text-center fw-bold">

📊 AI Traffic Analysis Dashboard

</h1>

<p className="text-center text-muted">

MetroFlow Analytics & Operational Insights

</p>

<hr/>

<div className="row">

<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaUsers
size={40}
className="text-primary mx-auto"/>

<h5 className="mt-3">

Total Passengers

</h5>

<h2>

{report.Total_Passengers}

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaChartLine
size={40}
className="text-success mx-auto"/>

<h5 className="mt-3">

Average Passenger Count

</h5>

<h2>

{report.Average_Passenger_Count}

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaClock
size={40}
className="text-danger mx-auto"/>

<h5 className="mt-3">

Average Delay

</h5>

<h2>

{report.Average_Delay} min

</h2>

</div>

</div>

</div>



<div className="row">

<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaPercentage
size={40}
className="text-warning mx-auto"/>

<h5 className="mt-3">

Maximum Occupancy

</h5>

<h2>

{report.Maximum_Occupancy}%

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaTrain
size={40}
className="text-info mx-auto"/>

<h5 className="mt-3">

Peak Hour

</h5>

<h2>

{report.Peak_Hour}

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-4 h-100">

<FaMapMarkerAlt
size={40}
className="text-secondary mx-auto"/>

<h5 className="mt-3">

Most Crowded Station

</h5>

<h4>

{report.Most_Crowded_Station}

</h4>

</div>

</div>

</div>



<div className="card shadow mt-4 p-4">

<h3>

Occupancy Meter

</h3>

<div
className="progress mt-3"
style={{height:"35px"}}
>

<div

className={`progress-bar ${
report.Maximum_Occupancy>=80
?"bg-danger"
:report.Maximum_Occupancy>=60
?"bg-warning"
:"bg-success"
}`}

style={{

width:`${report.Maximum_Occupancy}%`

}}

>

{report.Maximum_Occupancy}%

</div>

</div>

</div>



<div className="row mt-4">

<div className="col-md-6">

<div className="card shadow text-center p-4">

<FaChartBar
size={40}
className="text-primary mx-auto"
/>

<h4 className="mt-3">

Metro Performance

</h4>

<h2>

{performance}

</h2>

</div>

</div>



<div className="col-md-6">

<div className="card shadow text-center p-4">

<FaRobot
size={40}
className="text-success mx-auto"
/>

<h4 className="mt-3">

AI Recommendation

</h4>

<h5>

{performance==="Excellent"
?"Maintain Current Schedule"
:performance==="Good"
?"Increase Monitoring"
:"Increase Train Frequency"}

</h5>

</div>

</div>

</div>



<div

className={`alert mt-4 ${
performance==="Excellent"
?"alert-success"
:performance==="Good"
?"alert-warning"
:"alert-danger"
}`}

>

<h4>

<FaExclamationTriangle/>

{" "}

Operational Alert

</h4>

<p>

{performance==="Excellent" &&
"Metro operations are performing efficiently."}

{performance==="Good" &&
"Moderate congestion observed. Continue monitoring."}

{performance==="Needs Improvement" &&
"Heavy traffic detected. Increase operational capacity."}

</p>

</div>
      {/* Statistics Table */}

      <div className="card shadow mt-4 p-4">

        <h3>Traffic Statistics</h3>

        <table className="table table-bordered table-striped mt-3">

          <thead className="table-primary">

            <tr>

              <th>Metric</th>

              <th>Value</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>Total Passengers</td>

              <td>{report.Total_Passengers}</td>

            </tr>

            <tr>

              <td>Average Passenger Count</td>

              <td>{report.Average_Passenger_Count}</td>

            </tr>

            <tr>

              <td>Average Delay</td>

              <td>{report.Average_Delay} min</td>

            </tr>

            <tr>

              <td>Maximum Occupancy</td>

              <td>{report.Maximum_Occupancy}%</td>

            </tr>

            <tr>

              <td>Peak Hour</td>

              <td>{report.Peak_Hour}</td>

            </tr>

            <tr>

              <td>Most Crowded Station</td>

              <td>{report.Most_Crowded_Station}</td>

            </tr>

          </tbody>

        </table>

      </div>



      {/* AI Insights */}

      <div className="card shadow mt-4 p-4">

        <h3>

          <FaRobot />

          {" "}

          AI Insights

        </h3>

        <ul className="list-group mt-3">

          <li className="list-group-item">
            Passenger traffic analyzed successfully.
          </li>

          <li className="list-group-item">
            Peak operational hours identified.
          </li>

          <li className="list-group-item">
            Occupancy trends calculated.
          </li>

          <li className="list-group-item">
            AI generated operational recommendations.
          </li>

          <li className="list-group-item">
            Traffic analysis completed successfully.
          </li>

        </ul>

      </div>



      {/* Report Summary */}

      <div className="card shadow mt-4 p-4">

        <h3>

          AI Generated Summary

        </h3>

        <p className="mt-3">

          The MetroFlow AI Traffic Analysis module processed passenger
          movement and operational statistics to evaluate metro
          performance.

        </p>

        <p>

          Total passengers travelled:
          <strong> {report.Total_Passengers}</strong>

        </p>

        <p>

          Average passenger count:
          <strong> {report.Average_Passenger_Count}</strong>

        </p>

        <p>

          Average delay:
          <strong> {report.Average_Delay} Minutes</strong>

        </p>

        <p>

          Most crowded station:
          <strong> {report.Most_Crowded_Station}</strong>

        </p>

        <p>

          Peak operational hour:
          <strong> {report.Peak_Hour}</strong>

        </p>

      </div>



      {/* System Status */}

      <div className="card shadow mt-4 p-4">

        <h3>

          <FaServer />

          {" "}

          System Status

        </h3>

        <ul className="list-group mt-3">

          <li className="list-group-item d-flex justify-content-between">

            Backend API

            <span className="badge bg-success">

              Running

            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            AI Analytics Engine

            <span className="badge bg-success">

              Active

            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            Report Generator

            <span className="badge bg-success">

              Completed

            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            Traffic Monitoring

            <span className="badge bg-success">

              Online

            </span>

          </li>

        </ul>

      </div>



      {/* Overall Performance */}

      <div className="card shadow mt-4 p-4">

        <h3>

          Overall Metro Performance

        </h3>

        <div className="row text-center mt-3">

          <div className="col-md-3">

            <h5>Passengers</h5>

            <h2>{report.Total_Passengers}</h2>

          </div>

          <div className="col-md-3">

            <h5>Occupancy</h5>

            <h2>{report.Maximum_Occupancy}%</h2>

          </div>

          <div className="col-md-3">

            <h5>Delay</h5>

            <h2>{report.Average_Delay} min</h2>

          </div>

          <div className="col-md-3">

            <h5>Status</h5>

            <h3 className="text-success">

              {performance}

            </h3>

          </div>

        </div>

      </div>



      {/* Report Generated */}

      <div className="alert alert-success mt-4">

        <FaCheckCircle />

        {" "}

        AI Traffic Analysis Report generated successfully.

      </div>



      {/* Download Button */}

      <div className="text-center mt-4 mb-5">

        <button

          className="btn btn-success btn-lg"

          onClick={() =>
            window.open(
              "http://127.0.0.1:5000/report/pdf",
              "_blank"
            )
          }

        >

          <FaDownload />

          {" "}

          Download Report

        </button>

      </div>

</div>

<Footer/>

</>

);

}

export default Report;
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import api from "../services/api";

// import {
//   FaUsers,
//   FaClock,
//   FaPercentage,
//   FaChartLine,
//   FaTrain,
//   FaMapMarkerAlt,
//   FaDownload,
//   FaRobot,
//   FaExclamationTriangle,
//   FaServer,
//   FaCheckCircle,
//   FaChartBar
// } from "react-icons/fa";

// function Report() {

//   const [report, setReport] = useState(null);

//   useEffect(() => {

//     api.get("/report")
//       .then((response) => {

//         setReport(response.data);

//       })
//       .catch((error) => {

//         console.log(error);

//       });

//   }, []);

//   if (!report) {

//     return (

//       <>
//         <Navbar />

//         <div className="container text-center mt-5">

//           <div className="spinner-border text-primary"></div>

//           <h3 className="mt-3">

//             Loading AI Traffic Report...

//           </h3>

//         </div>

//         <Footer />

//       </>

//     );

//   }

//   const performance =
//     report.Average_Delay <= 2
//       ? "Excellent"
//       : report.Average_Delay <= 5
//       ? "Good"
//       : "Needs Improvement";

//   return (

//     <>

//       <Navbar />

//       <div className="container mt-5">

//         <h1 className="text-center fw-bold">

//           📊 AI Traffic Analysis Dashboard

//         </h1>

//         <p className="text-center text-muted">

//           MetroFlow Analytics & Operational Insights

//         </p>

//         <p className="text-center text-secondary">

//           Generated on {new Date().toLocaleString()}

//         </p>

//         <hr />

//         <div className="row">

//   {/* Total Passengers */}

//   <div className="col-md-4 mb-4">

//     <div className="card shadow text-center p-4 h-100">

//       <FaUsers
//         size={40}
//         className="text-primary mx-auto"
//       />

//       <h5 className="mt-3">

//         Total Passengers

//       </h5>

//       <h2>

//         {report.Total_Passengers}

//       </h2>

//     </div>

//   </div>

//   {/* Average Passenger Count */}

//   <div className="col-md-4 mb-4">

//     <div className="card shadow text-center p-4 h-100">

//       <FaChartLine
//         size={40}
//         className="text-success mx-auto"
//       />

//       <h5 className="mt-3">

//         Average Passenger Count

//       </h5>

//       <h2>

//         {report.Average_Passenger_Count}

//       </h2>

//     </div>

//   </div>

//   {/* Average Delay */}

//   <div className="col-md-4 mb-4">

//     <div className="card shadow text-center p-4 h-100">

//       <FaClock
//         size={40}
//         className="text-danger mx-auto"
//       />

//       <h5 className="mt-3">

//         Average Delay

//       </h5>

//       <h2>

//         {report.Average_Delay} min

//       </h2>

//     </div>

//   </div>

// </div>

// <div className="row">

//   {/* Maximum Occupancy */}

//   <div className="col-md-4 mb-4">

//     <div className="card shadow text-center p-4 h-100">

//       <FaPercentage
//         size={40}
//         className="text-warning mx-auto"
//       />

//       <h5 className="mt-3">

//         Maximum Occupancy

//       </h5>

//       <h2>

//         {report.Maximum_Occupancy}%

//       </h2>

//     </div>

//   </div>

//   {/* Peak Hour */}

//   <div className="col-md-4 mb-4">

//     <div className="card shadow text-center p-4 h-100">

//       <FaTrain
//         size={40}
//         className="text-info mx-auto"
//       />

//       <h5 className="mt-3">

//         Peak Hour

//       </h5>

//       <h2>

//         {report.Peak_Hour}

//       </h2>

//     </div>

//   </div>

//   {/* Most Crowded Station */}

//   <div className="col-md-4 mb-4">

//     <div className="card shadow text-center p-4 h-100">

//       <FaMapMarkerAlt
//         size={40}
//         className="text-secondary mx-auto"
//       />

//       <h5 className="mt-3">

//         Most Crowded Station

//       </h5>

//       <h4>

//         {report.Most_Crowded_Station}

//       </h4>

//     </div>

//   </div>

// </div>

// {/* AI Confidence */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     🤖 AI Confidence Score

//   </h3>

//   <div
//     className="progress mt-3"
//     style={{ height: "35px" }}
//   >

//     <div
//       className="progress-bar bg-success"
//       style={{ width: "96%" }}
//     >

//       96%

//     </div>

//   </div>

//   <p className="mt-3">

//     The AI prediction engine has analyzed passenger movement,
//     occupancy, crowd level and delay patterns with an estimated
//     confidence score of <strong>96%</strong>.

//   </p>

// </div>

// {/* Executive Summary */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     📄 Executive Summary

//   </h3>

//   <p className="mt-3">

//     MetroFlow analyzed passenger traffic, train occupancy,
//     operational delays and station congestion using Machine
//     Learning models. The platform predicts future passenger
//     demand, identifies crowded stations, generates AI
//     recommendations and supports metro scheduling decisions.

//   </p>

// </div>
// {/* Occupancy Meter */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     Occupancy Meter

//   </h3>

//   <div
//     className="progress mt-3"
//     style={{ height: "35px" }}
//   >

//     <div
//       className={`progress-bar ${
//         report.Maximum_Occupancy >= 80
//           ? "bg-danger"
//           : report.Maximum_Occupancy >= 60
//           ? "bg-warning"
//           : "bg-success"
//       }`}
//       style={{
//         width: `${report.Maximum_Occupancy}%`
//       }}
//     >

//       {report.Maximum_Occupancy}%

//     </div>

//   </div>

// </div>


// {/* Metro Performance & AI Recommendation */}

// <div className="row mt-4">

//   <div className="col-md-6">

//     <div className="card shadow text-center p-4 h-100">

//       <FaChartBar
//         size={40}
//         className="text-primary mx-auto"
//       />

//       <h4 className="mt-3">

//         Metro Performance

//       </h4>

//       <h2
//         className={
//           performance === "Excellent"
//             ? "text-success"
//             : performance === "Good"
//             ? "text-warning"
//             : "text-danger"
//         }
//       >

//         {performance}

//       </h2>

//       <p className="text-muted">

//         Overall operational efficiency calculated using
//         delay, occupancy and passenger movement.

//       </p>

//     </div>

//   </div>


//   <div className="col-md-6">

//     <div className="card shadow text-center p-4 h-100">

//       <FaRobot
//         size={40}
//         className="text-success mx-auto"
//       />

//       <h4 className="mt-3">

//         AI Recommendation

//       </h4>

//       <h5>

//         {performance === "Excellent"
//           ? "Maintain Current Schedule"
//           : performance === "Good"
//           ? "Increase Monitoring"
//           : "Increase Train Frequency"}

//       </h5>

//       <p className="text-muted mt-3">

//         Recommendation generated using MetroFlow
//         Machine Learning analytics.

//       </p>

//     </div>

//   </div>

// </div>


// {/* Operational Alert */}

// <div
//   className={`alert mt-4 ${
//     performance === "Excellent"
//       ? "alert-success"
//       : performance === "Good"
//       ? "alert-warning"
//       : "alert-danger"
//   }`}
// >

//   <h4>

//     <FaExclamationTriangle />

//     {" "}

//     Operational Alert

//   </h4>

//   <p>

//     {performance === "Excellent" &&
//       "Metro operations are stable. Continue normal train scheduling."}

//     {performance === "Good" &&
//       "Moderate congestion detected. Continue monitoring passenger flow."}

//     {performance === "Needs Improvement" &&
//       "Heavy congestion detected. Increase train frequency and deploy additional staff immediately."}

//   </p>

// </div>


// {/* AI Modules Used */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     🤖 AI Modules Used

//   </h3>

//   <div className="row mt-3">

//     <div className="col-md-6">

//       <ul className="list-group">

//         <li className="list-group-item">

//           ✅ Crowd Prediction Model

//         </li>

//         <li className="list-group-item">

//           ✅ Passenger Forecasting

//         </li>

//         <li className="list-group-item">

//           ✅ AI Alert Generator

//         </li>

//       </ul>

//     </div>

//     <div className="col-md-6">

//       <ul className="list-group">

//         <li className="list-group-item">

//           ✅ AI Notification Generator

//         </li>

//         <li className="list-group-item">

//           ✅ AI Metro Assistant Chatbot

//         </li>

//         <li className="list-group-item">

//           ✅ Traffic Analysis Engine

//         </li>

//       </ul>

//     </div>

//   </div>

// </div>
// {/* Statistics Table */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     Traffic Statistics

//   </h3>

//   <table className="table table-bordered table-striped mt-3">

//     <thead className="table-primary">

//       <tr>

//         <th>Metric</th>

//         <th>Value</th>

//       </tr>

//     </thead>

//     <tbody>

//       <tr>

//         <td>Total Passengers</td>

//         <td>{report.Total_Passengers}</td>

//       </tr>

//       <tr>

//         <td>Average Passenger Count</td>

//         <td>{report.Average_Passenger_Count}</td>

//       </tr>

//       <tr>

//         <td>Average Delay</td>

//         <td>{report.Average_Delay} Minutes</td>

//       </tr>

//       <tr>

//         <td>Maximum Occupancy</td>

//         <td>{report.Maximum_Occupancy}%</td>

//       </tr>

//       <tr>

//         <td>Peak Hour</td>

//         <td>{report.Peak_Hour}</td>

//       </tr>

//       <tr>

//         <td>Most Crowded Station</td>

//         <td>{report.Most_Crowded_Station}</td>

//       </tr>

//     </tbody>

//   </table>

// </div>


// {/* AI Insights */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     🤖 AI Insights

//   </h3>

//   <ul className="list-group mt-3">

//     <li className="list-group-item">
//       Passenger traffic analyzed successfully.
//     </li>

//     <li className="list-group-item">
//       Peak operational hours identified.
//     </li>

//     <li className="list-group-item">
//       Occupancy trends calculated.
//     </li>

//     <li className="list-group-item">
//       AI generated operational recommendations.
//     </li>

//     <li className="list-group-item">
//       Crowd prediction model executed successfully.
//     </li>

//     <li className="list-group-item">
//       MetroFlow AI Assistant integrated.
//     </li>

//     <li className="list-group-item">
//       External Gemini LLM integrated for AI features.
//     </li>

//   </ul>

// </div>


// {/* AI Generated Summary */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     📄 AI Generated Summary

//   </h3>

//   <p className="mt-3">

//     MetroFlow processed passenger movement,
//     occupancy percentage, delay information and
//     station statistics using Machine Learning models.

//   </p>

//   <p>

//     Total passengers analysed:

//     <strong>

//       {" "}

//       {report.Total_Passengers}

//     </strong>

//   </p>

//   <p>

//     Average passenger count:

//     <strong>

//       {" "}

//       {report.Average_Passenger_Count}

//     </strong>

//   </p>

//   <p>

//     Average operational delay:

//     <strong>

//       {" "}

//       {report.Average_Delay} Minutes

//     </strong>

//   </p>

//   <p>

//     Peak operational hour:

//     <strong>

//       {" "}

//       {report.Peak_Hour}

//     </strong>

//   </p>

//   <p>

//     Most crowded station:

//     <strong>

//       {" "}

//       {report.Most_Crowded_Station}

//     </strong>

//   </p>

// </div>


// {/* System Status */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     <FaServer />

//     {" "}

//     System Status

//   </h3>

//   <ul className="list-group mt-3">

//     <li className="list-group-item d-flex justify-content-between">

//       Backend API

//       <span className="badge bg-success">

//         Running

//       </span>

//     </li>

//     <li className="list-group-item d-flex justify-content-between">

//       Machine Learning Model

//       <span className="badge bg-success">

//         Active

//       </span>

//     </li>

//     <li className="list-group-item d-flex justify-content-between">

//       Gemini AI Integration

//       <span className="badge bg-success">

//         Connected

//       </span>

//     </li>

//     <li className="list-group-item d-flex justify-content-between">

//       Metro AI Chatbot

//       <span className="badge bg-success">

//         Online

//       </span>

//     </li>

//     <li className="list-group-item d-flex justify-content-between">

//       Report Generator

//       <span className="badge bg-success">

//         Completed

//       </span>

//     </li>

//   </ul>

// </div>


// {/* Overall Performance */}

// <div className="card shadow mt-4 p-4">

//   <h3>

//     📈 Overall Metro Performance

//   </h3>

//   <div className="row text-center mt-4">

//     <div className="col-md-3">

//       <h5>Passengers</h5>

//       <h2>{report.Total_Passengers}</h2>

//     </div>

//     <div className="col-md-3">

//       <h5>Occupancy</h5>

//       <h2>{report.Maximum_Occupancy}%</h2>

//     </div>

//     <div className="col-md-3">

//       <h5>Delay</h5>

//       <h2>{report.Average_Delay} min</h2>

//     </div>

//     <div className="col-md-3">

//       <h5>Status</h5>

//       <h3 className="text-success">

//         {performance}

//       </h3>

//     </div>

//   </div>

// </div>


// <div className="alert alert-success mt-4">

//   <FaCheckCircle />

//   {" "}

//   AI Traffic Analysis Report generated successfully.

// </div>


// {/* Download Report */}

// <div className="text-center mt-5 mb-4">

//   <button

//     className="btn btn-success btn-lg"

//     onClick={() => window.print()}

//   >

//     <FaDownload />

//     {" "}

//     Save Report as PDF

//   </button>

// </div>


// <hr/>

// <div className="text-center text-muted mb-5">

//   <h5>

//     MetroFlow AI Platform

//   </h5>

//   <p>

//     Version 2.0

//   </p>

//   <p>

//     Built using React • Flask • Machine Learning • Gemini AI

//   </p>

//   <p>

//     © 2026 MetroFlow | AI-Based Metro Crowd Management & Scheduling Platform

//   </p>

// </div>

// </div>

// <Footer/>

// </>

// );

// }

// export default Report;