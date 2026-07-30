// import { useState } from "react";
// import Navbar from "../components/Navbar";
// import api from "../services/api";
// import Footer from "../components/Footer";
// function Prediction() {
//   const [formData, setFormData] = useState({
//     Passenger_Count: "",
//     Occupancy_Percent: "",
//     Delay_Minutes: "",
//     Number_of_Trips: "",
//     Train_Frequency_Per_Hour: "",
//     Train_Speed_kmph: ""
//   });

//   const [result, setResult] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: Number(e.target.value)
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await api.post("/predict", formData);

// console.log("Prediction Response:", response.data);

// setResult(response.data);
//     } catch (error) {
//       console.log(error);
//       alert("Prediction Failed");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="container mt-5">

//         <h2 className="text-center mb-4">
//           AI Crowd Prediction
//         </h2>

//         <form onSubmit={handleSubmit}>

//           <div className="row">

//             <div className="col-md-6 mb-3">
//               <label>Passenger Count</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="Passenger_Count"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Occupancy (%)</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="Occupancy_Percent"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Delay (Minutes)</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="Delay_Minutes"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Number of Trips</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="Number_of_Trips"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Train Frequency / Hour</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="Train_Frequency_Per_Hour"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Train Speed (km/h)</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="Train_Speed_kmph"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//           </div>

//           <button className="btn btn-primary w-100">
//             Predict Crowd Level
//           </button>

//         </form>
//         {result && (

//   <div className="card shadow mt-5 p-4">

//     <h2 className="text-center mb-4">
//       🤖 AI Prediction Result
//     </h2>

//     <hr />

//     <h4>
//       Crowd Level :
//       {" "}

//       <span
//         className={
//           result.Crowd_Level === "High"
//             ? "badge bg-danger fs-6"
//             : result.Crowd_Level === "Medium"
//             ? "badge bg-warning text-dark fs-6"
//             : "badge bg-success fs-6"
//         }
//       >
//         {result.Crowd_Level}
//       </span>

//     </h4>

//     <br />

//     <h4>Recommendation</h4>

//     <div className="alert alert-info">
//       {result.Recommendation}
//     </div>

//     <div className="alert alert-success">
//       ✅ Prediction completed successfully.
//     </div>

//   </div>

// )}

//       </div>
//       <Footer />
//     </>
//   );
// }

// export default Prediction;
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

      setResult(response.data);

    } catch (error) {

      console.log(error);

      alert("Prediction Failed");

    }

  };

  const getProgress = () => {

    if (!result) return 0;

    if (result.Crowd_Level === "High") return 95;

    if (result.Crowd_Level === "Medium") return 65;

    return 30;

  };

  return (

    <>
      <Navbar />

      <div className="container-fluid bg-light py-5">

        <div className="text-center mb-5">

          <h1 className="fw-bold text-primary">
            🤖 AI Crowd Prediction
          </h1>

          <p className="text-muted fs-5">
            Predict Metro Crowd Levels using Machine Learning
          </p>

        </div>

        {/* Top Statistics */}

        <div className="row mb-5">

          <div className="col-md-4">

            <div className="card shadow border-0 text-center p-4">

              <h5>🚇 AI Model</h5>

              <h3 className="text-primary">
                Random Forest
              </h3>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-0 text-center p-4">

              <h5>🎯 Accuracy</h5>

              <h3 className="text-success">
                96%
              </h3>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-0 text-center p-4">

              <h5>⚡ Prediction Time</h5>

              <h3 className="text-warning">
                &lt; 1 sec
              </h3>

            </div>

          </div>

        </div>

        {/* Prediction Form */}

        <div
          className="card shadow-lg border-0 p-5"
          style={{
            borderRadius: "20px"
          }}
        >

          <h3 className="text-center mb-4">
            Enter Metro Information
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  👥 Passenger Count
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="Passenger_Count"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🚉 Occupancy (%)
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="Occupancy_Percent"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  ⏱ Delay (Minutes)
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="Delay_Minutes"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🚆 Number of Trips
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="Number_of_Trips"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🚄 Train Frequency / Hour
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="Train_Frequency_Per_Hour"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  ⚡ Train Speed (km/h)
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="Train_Speed_kmph"
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <button className="btn btn-primary btn-lg w-100">

              🚀 Predict Crowd Level

            </button>

          </form>

        </div>

        {/* Result */}

        {result && (

          <div
            className="card shadow-lg border-0 mt-5 p-5"
            style={{
              borderRadius: "20px"
            }}
          >

            <h2 className="text-center mb-4">

              🤖 AI Prediction Result

            </h2>

            <div className="text-center">

              <h3>

                Crowd Level

              </h3>

              <span
                className={`badge fs-5 p-3 ${
                  result.Crowd_Level === "High"
                    ? "bg-danger"
                    : result.Crowd_Level === "Medium"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >

                {result.Crowd_Level}

              </span>

            </div>

            <div className="mt-4">

              <h5>
                Crowd Density
              </h5>

              <div className="progress">

                <div
                  className={`progress-bar ${
                    result.Crowd_Level === "High"
                      ? "bg-danger"
                      : result.Crowd_Level === "Medium"
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                  style={{
                    width: getProgress() + "%"
                  }}
                >

                  {getProgress()}%

                </div>

              </div>

            </div>

            <div className="alert alert-info mt-4">

              <h5>
                💡 AI Recommendation
              </h5>

              {result.Recommendation}

            </div>

            <div className="alert alert-success text-center">

              ✅ Crowd Prediction Completed Successfully

            </div>

          </div>

        )}

      </div>

      <Footer />

    </>
  );

}

export default Prediction;