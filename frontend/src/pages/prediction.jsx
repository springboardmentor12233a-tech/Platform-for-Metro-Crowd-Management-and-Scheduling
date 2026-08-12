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
import api from "../services/api";
import Footer from "../components/Footer";


function Prediction() {

    // =====================================================
    // AVAILABLE STATIONS
    // =====================================================

    const stations = [
        "Airport",
        "University",
        "Central",
        "North Gate",
        "Stadium",
        "South Gate",
        "Market",
        "Rail Hub",
        "Tech Park",
        "City Center"
    ];


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        From_Station: "",

        To_Station: "",

        Passenger_Count: "",

        Occupancy_Percent: "",

        Delay_Minutes: "",

        Number_of_Trips: "",

        Train_Frequency_Per_Hour: "",

        Train_Speed_kmph: ""

    });


    // =====================================================
    // RESULT
    // =====================================================

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({

            ...formData,

            [name]:
                name === "From_Station" ||
                name === "To_Station"
                    ? value
                    : value === ""
                    ? ""
                    : Number(value)

        });

    };


    // =====================================================
    // PREDICT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // -------------------------------------------------
        // VALIDATE ROUTE
        // -------------------------------------------------

        if (!formData.From_Station) {

            alert("Please select From Station.");

            return;

        }


        if (!formData.To_Station) {

            alert("Please select To Station.");

            return;

        }


        if (
            formData.From_Station ===
            formData.To_Station
        ) {

            alert(
                "From Station and To Station cannot be the same."
            );

            return;

        }


        try {

            setLoading(true);

            setResult(null);


            console.log(
                "Sending Prediction:",
                formData
            );


            const response = await api.post(
                "/predict",
                formData
            );


            console.log(
                "Prediction Response:",
                response.data
            );


            if (response.data.Error) {

                alert(response.data.Error);

                return;

            }


            setResult(
                response.data
            );


        } catch (error) {

            console.error(
                "Prediction Error:",
                error
            );


            if (
                error.response &&
                error.response.data &&
                error.response.data.Error
            ) {

                alert(
                    error.response.data.Error
                );

            } else {

                alert(
                    "Prediction Failed. Check whether Flask backend is running."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RESET
    // =====================================================

    const resetForm = () => {

        setFormData({

            From_Station: "",

            To_Station: "",

            Passenger_Count: "",

            Occupancy_Percent: "",

            Delay_Minutes: "",

            Number_of_Trips: "",

            Train_Frequency_Per_Hour: "",

            Train_Speed_kmph: ""

        });

        setResult(null);

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <>

            <Navbar />


            <div className="container mt-5 mb-5">

                <div className="text-center mb-4">

                    <h2 className="fw-bold">

                        🚇 AI Route-Based Crowd Prediction

                    </h2>

                    <p className="text-muted">

                        Predict metro crowd levels for a
                        specific route using AI.

                    </p>

                </div>


                {/* =========================================
                    PREDICTION FORM
                ========================================== */}

                <div className="card shadow p-4">


                    <h4 className="mb-4">

                        🛤️ Select Metro Route

                    </h4>


                    <form onSubmit={handleSubmit}>


                        <div className="row">


                            {/* FROM STATION */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">

                                    From Station

                                </label>


                                <select

                                    className="form-select"

                                    name="From_Station"

                                    value={
                                        formData.From_Station
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required

                                >

                                    <option value="">

                                        Select From Station

                                    </option>


                                    {stations.map(
                                        (station) => (

                                            <option
                                                key={station}
                                                value={station}
                                            >

                                                {station}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* TO STATION */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">

                                    To Station

                                </label>


                                <select

                                    className="form-select"

                                    name="To_Station"

                                    value={
                                        formData.To_Station
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required

                                >

                                    <option value="">

                                        Select To Station

                                    </option>


                                    {stations.map(
                                        (station) => (

                                            <option
                                                key={station}
                                                value={station}
                                            >

                                                {station}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PASSENGERS */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Passenger Count

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    className="form-control"

                                    name="Passenger_Count"

                                    value={
                                        formData.Passenger_Count
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Example: 750"

                                    required

                                />

                            </div>


                            {/* OCCUPANCY */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Occupancy (%)

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    max="100"

                                    step="0.1"

                                    className="form-control"

                                    name="Occupancy_Percent"

                                    value={
                                        formData.Occupancy_Percent
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Example: 80"

                                    required

                                />

                            </div>


                            {/* DELAY */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Delay (Minutes)

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    className="form-control"

                                    name="Delay_Minutes"

                                    value={
                                        formData.Delay_Minutes
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Example: 5"

                                    required

                                />

                            </div>


                            {/* TRIPS */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Number of Trips

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    className="form-control"

                                    name="Number_of_Trips"

                                    value={
                                        formData.Number_of_Trips
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Example: 20"

                                    required

                                />

                            </div>


                            {/* FREQUENCY */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Train Frequency / Hour

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    className="form-control"

                                    name="Train_Frequency_Per_Hour"

                                    value={
                                        formData.Train_Frequency_Per_Hour
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Example: 8"

                                    required

                                />

                            </div>


                            {/* SPEED */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Train Speed (km/h)

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    className="form-control"

                                    name="Train_Speed_kmph"

                                    value={
                                        formData.Train_Speed_kmph
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Example: 45"

                                    required

                                />

                            </div>


                        </div>


                        {/* BUTTONS */}

                        <div className="d-flex gap-2 mt-3">


                            <button

                                type="submit"

                                className="btn btn-primary w-100"

                                disabled={loading}

                            >

                                {loading

                                    ? "🤖 Predicting..."

                                    : "🤖 Predict Crowd Level"

                                }

                            </button>


                            <button

                                type="button"

                                className="btn btn-secondary"

                                onClick={resetForm}

                            >

                                Reset

                            </button>


                        </div>


                    </form>

                </div>


                {/* =========================================
                    RESULT
                ========================================== */}

                {result && (

                    <div className="card shadow mt-5 p-4">


                        <h3 className="text-center fw-bold">

                            🤖 AI Prediction Result

                        </h3>


                        <hr />


                        {/* ROUTE */}

                        <div className="alert alert-primary text-center">

                            <h4 className="mb-0">

                                🚇 {result.From_Station}

                                {" → "}

                                {result.To_Station}

                            </h4>

                        </div>


                        <div className="row text-center">


                            {/* CROWD */}

                            <div className="col-md-4 mb-3">

                                <div className="card p-3 h-100">

                                    <h6>

                                        Crowd Level

                                    </h6>


                                    <span

                                        className={

                                            result.Crowd_Level ===
                                            "High"

                                                ? "badge bg-danger fs-5"

                                                : result.Crowd_Level ===
                                                  "Medium"

                                                ? "badge bg-warning text-dark fs-5"

                                                : "badge bg-success fs-5"

                                        }

                                    >

                                        {result.Crowd_Level}

                                    </span>

                                </div>

                            </div>


                            {/* PASSENGERS */}

                            <div className="col-md-4 mb-3">

                                <div className="card p-3 h-100">

                                    <h6>

                                        Passenger Count

                                    </h6>

                                    <h3>

                                        {result.Passenger_Count}

                                    </h3>

                                </div>

                            </div>


                            {/* OCCUPANCY */}

                            <div className="col-md-4 mb-3">

                                <div className="card p-3 h-100">

                                    <h6>

                                        Occupancy

                                    </h6>

                                    <h3>

                                        {result.Occupancy_Percent}%

                                    </h3>

                                </div>

                            </div>


                        </div>


                        {/* OTHER DETAILS */}

                        <div className="row mt-3">


                            <div className="col-md-4">

                                <strong>

                                    Delay:

                                </strong>{" "}

                                {result.Delay_Minutes}

                                {" minutes"}

                            </div>


                            <div className="col-md-4">

                                <strong>

                                    Trips:

                                </strong>{" "}

                                {result.Number_of_Trips}

                            </div>


                            <div className="col-md-4">

                                <strong>

                                    Train Frequency:

                                </strong>{" "}

                                {result.Train_Frequency_Per_Hour}

                                {" / hour"}

                            </div>


                        </div>


                        <hr />


                        {/* RECOMMENDATION */}

                        <h5>

                            💡 AI Recommendation

                        </h5>


                        <div className="alert alert-info">

                            {result.Recommendation}

                        </div>


                        <div className="alert alert-success">

                            ✅ Route-based AI prediction
                            completed successfully.

                        </div>


                    </div>

                )}

            </div>


            <Footer />

        </>

    );

}


export default Prediction;