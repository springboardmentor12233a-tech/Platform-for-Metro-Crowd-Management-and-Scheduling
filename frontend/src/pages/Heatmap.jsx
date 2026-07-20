// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import api from "../services/api";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell
// } from "recharts";

// function Heatmap() {

//   const [stations, setStations] = useState([]);

//   useEffect(() => {

//     const loadData = () => {

//       api.get("/schedule")
//         .then((res) => {

//           setStations(res.data);

//         })
//         .catch((err) => {

//           console.log(err);

//         });

//     };

//     loadData();

//     const interval = setInterval(loadData, 5000);

//     return () => clearInterval(interval);

//   }, []);

//   const getColor = (crowd) => {

//     if (crowd === "High") return "#dc3545";

//     if (crowd === "Medium") return "#ffc107";

//     return "#28a745";

//   };

//   return (

//     <>
//       <Navbar />

//       <div className="container mt-5">

//         <h1 className="text-center">
//           🔥 Metro Congestion Heatmap
//         </h1>

//         <p className="text-center text-muted">
//           Live Passenger Density Across Stations
//         </p>

//         <ResponsiveContainer
//           width="100%"
//           height={500}
//         >

//           <BarChart data={stations}>

//             <XAxis dataKey="Station" />

//             <YAxis />

//             <Tooltip />

//             <Bar dataKey="Passenger_Count">

//               {stations.map((item, index) => (

//                 <Cell
//                   key={index}
//                   fill={getColor(item.Crowd_Level)}
//                 />

//               ))}

//             </Bar>

//           </BarChart>

//         </ResponsiveContainer>

//         <div className="row mt-4">

//           <div className="col-md-4">

//             <div className="alert alert-success">

//               🟢 Low Crowd

//             </div>

//           </div>

//           <div className="col-md-4">

//             <div className="alert alert-warning">

//               🟡 Medium Crowd

//             </div>

//           </div>

//           <div className="col-md-4">

//             <div className="alert alert-danger">

//               🔴 High Crowd

//             </div>

//           </div>

//         </div>

//       </div>

//       <Footer />

//     </>

//   );

// }

// export default Heatmap;
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

      });

  }, []);

  return (

    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">
          🗺 Metro Congestion Heatmap
        </h2>

        <div className="row">

          {

            stations.map((station, index) => (

              <div
                className="col-md-3 mb-3"
                key={index}
              >

                <div
                  className={`card text-white shadow ${
                    station.Crowd_Level === "High"
                      ? "bg-danger"
                      : station.Crowd_Level === "Medium"
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                >

                  <div className="card-body">

                    <h5>{station.Station}</h5>

                    <p>
                      {station.Passenger_Count} Passengers
                    </p>

                    <h6>
                      {station.Crowd_Level}
                    </h6>

                  </div>

                </div>

              </div>

            ))

          }

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Heatmap;