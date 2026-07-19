// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import api from "../services/api";

// import {
//   FaMapMarkerAlt,
//   FaUsers,
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaClock,
//   FaTrain,
//   FaCalendarAlt
// } from "react-icons/fa";

// function Monitoring() {
//   const [monitor, setMonitor] = useState(null);

//   useEffect(() => {
//     const loadMonitoring = () => {
//       api
//         .get("/monitor")
//         .then((res) => {
//           console.log("Monitoring:", res.data);
//           setMonitor(res.data);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     };

//     // Load immediately
//     loadMonitoring();

//     // Refresh every 5 seconds
//     const interval = setInterval(loadMonitoring, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!monitor) {
//     return (
//       <>
//         <Navbar />

//         <div className="container text-center mt-5">
//           <div className="spinner-border text-primary"></div>

//           <h3 className="mt-3">
//             Loading Monitoring Data...
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
//           🚇 Real-Time Metro Monitoring
//         </h1>

//         <p className="text-center text-muted">
//           Live operational status of the metro system
//         </p>

//         <hr />

//         <div className="row">

//           {/* Date */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaCalendarAlt
//                 size={35}
//                 className="text-primary mx-auto"
//               />

//               <h5 className="mt-3">
//                 Date
//               </h5>

//               <h4>{monitor.Date}</h4>

//             </div>
//           </div>

//           {/* Time */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaClock
//                 size={35}
//                 className="text-success mx-auto"
//               />

//               <h5 className="mt-3">
//                 Time
//               </h5>

//               <h4>{monitor.Time}</h4>

//             </div>
//           </div>

//           {/* Station */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaMapMarkerAlt
//                 size={35}
//                 className="text-danger mx-auto"
//               />

//               <h5 className="mt-3">
//                 Station
//               </h5>

//               <h4>{monitor.Station}</h4>

//             </div>
//           </div>

//           {/* Passenger Count */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaUsers
//                 size={35}
//                 className="text-info mx-auto"
//               />

//               <h5 className="mt-3">
//                 Passenger Count
//               </h5>

//               <h2>{monitor.Passenger_Count}</h2>

//             </div>
//           </div>

//           {/* Entries */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaSignInAlt
//                 size={35}
//                 className="text-success mx-auto"
//               />

//               <h5 className="mt-3">
//                 Passenger Entries
//               </h5>

//               <h2>{monitor.Passenger_Entries}</h2>

//             </div>
//           </div>

//           {/* Exits */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaSignOutAlt
//                 size={35}
//                 className="text-warning mx-auto"
//               />

//               <h5 className="mt-3">
//                 Passenger Exits
//               </h5>

//               <h2>{monitor.Passenger_Exits}</h2>

//             </div>
//           </div>

//           {/* Delay */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaClock
//                 size={35}
//                 className="text-danger mx-auto"
//               />

//               <h5 className="mt-3">
//                 Delay
//               </h5>

//               <h2>{monitor.Delay_Minutes} min</h2>

//             </div>
//           </div>

//           {/* Trips */}

//           <div className="col-md-3 mb-4">
//             <div className="card shadow text-center p-3 h-100">

//               <FaTrain
//                 size={35}
//                 className="text-primary mx-auto"
//               />

//               <h5 className="mt-3">
//                 Trips
//               </h5>

//               <h2>{monitor.Trips}</h2>

//             </div>
//           </div>

//         </div>

//         {/* Occupancy */}

//         <div className="card shadow mt-4 p-4">

//           <h3>
//             Occupancy Percentage
//           </h3>

//           <div
//             className="progress"
//             style={{ height: "30px" }}
//           >

//             <div
//               className="progress-bar bg-success"
//               style={{
//                 width: `${monitor.Occupancy_Percent}%`
//               }}
//             >
//               {monitor.Occupancy_Percent}%
//             </div>

//           </div>

//         </div>

//         {/* Crowd Level */}

//         <div className="card shadow mt-4 p-4">

//           <h3>
//             Crowd Status
//           </h3>

//           <h2 className="text-center mt-3">

//             {monitor.Crowd_Level === "High" && (
//               <span className="badge bg-danger fs-3">
//                 HIGH
//               </span>
//             )}

//             {monitor.Crowd_Level === "Medium" && (
//               <span className="badge bg-warning text-dark fs-3">
//                 MEDIUM
//               </span>
//             )}

//             {monitor.Crowd_Level === "Low" && (
//               <span className="badge bg-success fs-3">
//                 LOW
//               </span>
//             )}

//           </h2>

//         </div>

//       </div>

//       <Footer />
//     </>
//   );
// }

// export default Monitoring;



import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaMapMarkerAlt,
  FaUsers,
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaTrain,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaServer,
  FaRobot,
  FaCheckCircle,
  FaTachometerAlt
} from "react-icons/fa";

function Monitoring() {

  const [monitor, setMonitor] = useState(null);

  useEffect(() => {

    const loadMonitoring = () => {

      api.get("/monitor")
      .then((res)=>{
        console.log(res.data);
        setMonitor(res.data);
      })
      .catch((err)=>{
        console.log(err);
      });

    };

    loadMonitoring();

    const interval = setInterval(loadMonitoring,5000);

    return ()=>clearInterval(interval);

  },[]);


  if(!monitor){

    return(

      <>
      <Navbar/>

      <div className="container text-center mt-5">

        <div className="spinner-border text-primary"></div>

        <h3 className="mt-3">
          Loading Monitoring Data...
        </h3>

      </div>

      <Footer/>
      </>

    );

  }


  return(

<>
<Navbar/>

<div className="container mt-4">

<h1 className="text-center fw-bold">
🚇 Metro Operations Monitoring Dashboard
</h1>

<p className="text-center text-muted">
Real-Time Metro Monitoring System
</p>

<hr/>

<div className="row">

<div className="col-md-3 mb-4">
<div className="card shadow text-center p-3 h-100">

<FaCalendarAlt size={35} className="text-primary mx-auto"/>

<h5 className="mt-3">Date</h5>

<h4>{monitor.Date}</h4>

</div>
</div>


<div className="col-md-3 mb-4">
<div className="card shadow text-center p-3 h-100">

<FaClock size={35} className="text-success mx-auto"/>

<h5 className="mt-3">Time</h5>

<h4>{monitor.Time}</h4>

</div>
</div>



<div className="col-md-3 mb-4">
<div className="card shadow text-center p-3 h-100">

<FaMapMarkerAlt size={35} className="text-danger mx-auto"/>

<h5 className="mt-3">Station</h5>

<h4>{monitor.Station}</h4>

</div>
</div>



<div className="col-md-3 mb-4">
<div className="card shadow text-center p-3 h-100">

<FaUsers size={35} className="text-info mx-auto"/>

<h5 className="mt-3">Passengers</h5>

<h2>{monitor.Passenger_Count}</h2>

</div>
</div>

</div>


<div className="row">

<div className="col-md-3 mb-4">

<div className="card shadow text-center p-3 h-100">

<FaSignInAlt size={35} className="text-success"/>

<h5 className="mt-3">Entries</h5>

<h2>{monitor.Passenger_Entries}</h2>

</div>

</div>



<div className="col-md-3 mb-4">

<div className="card shadow text-center p-3 h-100">

<FaSignOutAlt size={35} className="text-warning"/>

<h5 className="mt-3">Exits</h5>

<h2>{monitor.Passenger_Exits}</h2>

</div>

</div>



<div className="col-md-3 mb-4">

<div className="card shadow text-center p-3 h-100">

<FaClock size={35} className="text-danger"/>

<h5 className="mt-3">Delay</h5>

<h2>{monitor.Delay_Minutes} min</h2>

</div>

</div>



<div className="col-md-3 mb-4">

<div className="card shadow text-center p-3 h-100">

<FaTrain size={35} className="text-primary"/>

<h5 className="mt-3">Trips</h5>

<h2>{monitor.Trips}</h2>

</div>

</div>

</div>


<div className="row">

<div className="col-md-4 mb-4">

<div className="card shadow text-center p-3">

<FaTachometerAlt
size={40}
className="text-primary mx-auto"
/>

<h5 className="mt-3">

Train Speed

</h5>

<h2>

{monitor.Train_Speed || 60} km/h

</h2>

</div>

</div>


<div className="col-md-4 mb-4">

<div className="card shadow text-center p-3">

<FaCheckCircle
size={40}
className="text-success mx-auto"
/>

<h5 className="mt-3">

Metro Status

</h5>

<h2 className="text-success">

Running

</h2>

</div>

</div>



<div className="col-md-4 mb-4">

<div className="card shadow text-center p-3">

<FaServer
size={40}
className="text-info mx-auto"
/>

<h5 className="mt-3">

Backend Status

</h5>

<h2 className="text-primary">

Online

</h2>

</div>

</div>

</div>



<div className="card shadow p-4 mt-3">

<h3>

Occupancy Percentage

</h3>

<div className="progress mt-3"
style={{height:"35px"}}
>

<div

className="progress-bar bg-success"

style={{

width:`${monitor.Occupancy_Percent}%`

}}

>

{monitor.Occupancy_Percent}%

</div>

</div>

</div>
      {/* Crowd Status */}

      <div className="card shadow mt-4 p-4">

        <h3>Crowd Status</h3>

        <div className="text-center mt-3">

          {monitor.Crowd_Level === "High" && (
            <span className="badge bg-danger fs-2 p-3">
              HIGH CROWD
            </span>
          )}

          {monitor.Crowd_Level === "Medium" && (
            <span className="badge bg-warning text-dark fs-2 p-3">
              MEDIUM CROWD
            </span>
          )}

          {monitor.Crowd_Level === "Low" && (
            <span className="badge bg-success fs-2 p-3">
              LOW CROWD
            </span>
          )}

        </div>

      </div>



      {/* Passenger Statistics */}

      <div className="card shadow mt-4 p-4">

        <h3>Passenger Statistics</h3>

        <table className="table table-striped table-bordered mt-3">

          <thead className="table-primary">

            <tr>

              <th>Metric</th>

              <th>Value</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>Total Passenger Count</td>

              <td>{monitor.Passenger_Count}</td>

            </tr>

            <tr>

              <td>Passenger Entries</td>

              <td>{monitor.Passenger_Entries}</td>

            </tr>

            <tr>

              <td>Passenger Exits</td>

              <td>{monitor.Passenger_Exits}</td>

            </tr>

            <tr>

              <td>Total Trips</td>

              <td>{monitor.Trips}</td>

            </tr>

            <tr>

              <td>Delay</td>

              <td>{monitor.Delay_Minutes} Minutes</td>

            </tr>

          </tbody>

        </table>

      </div>



      {/* Operational Alert */}

      <div
        className={`alert mt-4 ${
          monitor.Crowd_Level === "High"
            ? "alert-danger"
            : monitor.Crowd_Level === "Medium"
            ? "alert-warning"
            : "alert-success"
        }`}
      >

        <h3>

          <FaExclamationTriangle />

          {" "}

          System Alert

        </h3>

        <h5>

          {monitor.Crowd_Level === "High" &&
            "Heavy crowd detected. Increase train frequency immediately."}

          {monitor.Crowd_Level === "Medium" &&
            "Moderate crowd detected. Monitor station regularly."}

          {monitor.Crowd_Level === "Low" &&
            "Metro is operating normally."}

        </h5>

      </div>



      {/* AI Recommendation */}

      <div className="card shadow mt-4 p-4">

        <h3>

          <FaRobot />

          {" "}

          AI Recommendation

        </h3>

        <h4 className="mt-3">

          {monitor.Crowd_Level === "High" &&
            "Increase Train Frequency • Deploy Extra Staff • Open Additional Gates"}

          {monitor.Crowd_Level === "Medium" &&
            "Increase Monitoring • Prepare Standby Train"}

          {monitor.Crowd_Level === "Low" &&
            "Normal Operations"}

        </h4>

      </div>



      {/* System Status */}

      <div className="card shadow mt-4 p-4">

        <h3>System Status</h3>

        <ul className="list-group mt-3">

          <li className="list-group-item d-flex justify-content-between">

            Backend Server

            <span className="badge bg-success">
              Running
            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            Monitoring Service

            <span className="badge bg-success">
              Live
            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            AI Prediction Model

            <span className="badge bg-success">
              Active
            </span>

          </li>

          <li className="list-group-item d-flex justify-content-between">

            Auto Refresh

            <span className="badge bg-primary">
              Every 5 Seconds
            </span>

          </li>

        </ul>

      </div>



      {/* Today's Summary */}

      <div className="card shadow mt-4 mb-5 p-4">

        <h3>Today's Summary</h3>

        <div className="row text-center mt-3">

          <div className="col-md-3">

            <h5>Passengers</h5>

            <h2>{monitor.Passenger_Count}</h2>

          </div>

          <div className="col-md-3">

            <h5>Occupancy</h5>

            <h2>{monitor.Occupancy_Percent}%</h2>

          </div>

          <div className="col-md-3">

            <h5>Trips</h5>

            <h2>{monitor.Trips}</h2>

          </div>

          <div className="col-md-3">

            <h5>Delay</h5>

            <h2>{monitor.Delay_Minutes} min</h2>

          </div>

        </div>

      </div>

    </div>

    <Footer />

    </>

  );

}

export default Monitoring;