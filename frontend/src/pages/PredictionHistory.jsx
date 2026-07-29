import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    FaHistory,
    FaUsers,
    FaTrain,
    FaClock,
    FaSearch,
    FaDownload
} from "react-icons/fa";

function PredictionHistory() {

    const [history, setHistory] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        api.get("/prediction-history")

            .then((res) => {

                setHistory(res.data);

            })

            .catch(console.log);

    }, []);

    const filteredHistory = history.filter((item) =>

        item.Crowd_Level.toLowerCase().includes(search.toLowerCase()) ||

        item.Recommendation.toLowerCase().includes(search.toLowerCase())

    );
        return (

        <>

            <Navbar />

            <div className="container mt-5">

                <div className="text-center">

                    <FaHistory
                        size={60}
                        className="text-primary"
                    />

                    <h1 className="mt-3">

                        Prediction History

                    </h1>

                    <p className="text-muted">

                        AI Crowd Prediction Logs

                    </p>

                </div>

                <hr />

                {/* Statistics Cards */}

                <div className="row mb-4">

                    <div className="col-md-4">

                        <div className="card shadow text-center p-3">

                            <FaUsers
                                size={35}
                                className="text-primary mx-auto"
                            />

                            <h5 className="mt-3">

                                Total Predictions

                            </h5>

                            <h2>

                                {history.length}

                            </h2>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow text-center p-3">

                            <FaTrain
                                size={35}
                                className="text-success mx-auto"
                            />

                            <h5 className="mt-3">

                                Latest Crowd

                            </h5>

                            <h2>

                                {history.length > 0
                                    ? history[0].Crowd_Level
                                    : "-"}

                            </h2>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow text-center p-3">

                            <FaClock
                                size={35}
                                className="text-warning mx-auto"
                            />

                            <h5 className="mt-3">

                                Latest Prediction

                            </h5>

                            <h6>

                                {history.length > 0
                                    ? history[0].Timestamp
                                    : "-"}

                            </h6>

                        </div>

                    </div>

                </div>

                {/* Search Box */}

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <div className="input-group">

                            <span className="input-group-text">

                                <FaSearch />

                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Crowd Level or Recommendation..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>
                                {/* Prediction History Table */}

                <div className="card shadow">

                    <div className="card-header bg-primary text-white">

                        <h4 className="mb-0">

                            <FaHistory /> Prediction Records

                        </h4>

                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-hover table-bordered align-middle">

                                <thead className="table-dark">

                                    <tr>

                                        <th>#</th>
                                        <th>Date & Time</th>
                                        <th>Passengers</th>
                                        <th>Occupancy</th>
                                        <th>Delay</th>
                                        <th>Trips</th>
                                        <th>Frequency</th>
                                        <th>Speed</th>
                                        <th>Crowd Level</th>
                                        <th>Recommendation</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredHistory.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="10"
                                                className="text-center text-muted"
                                            >

                                                No Prediction History Found

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredHistory.map((item, index) => (

                                            <tr key={index}>

                                                <td>{index + 1}</td>

                                                <td>{item.Timestamp}</td>

                                                <td>{item.Passenger_Count}</td>

                                                <td>

                                                    {item.Occupancy_Percent}%

                                                </td>

                                                <td>

                                                    {item.Delay_Minutes} min

                                                </td>

                                                <td>

                                                    {item.Number_of_Trips}

                                                </td>

                                                <td>

                                                    {item.Train_Frequency_Per_Hour}

                                                </td>

                                                <td>

                                                    {item.Train_Speed_kmph} km/h

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            item.Crowd_Level === "High"
                                                                ? "badge bg-danger"
                                                                : item.Crowd_Level === "Medium"
                                                                ? "badge bg-warning text-dark"
                                                                : "badge bg-success"
                                                        }
                                                    >

                                                        {item.Crowd_Level}

                                                    </span>

                                                </td>

                                                <td>

                                                    {item.Recommendation}

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
                                {/* Export Button */}

                <div className="text-center mt-4">

                    <button
                        className="btn btn-success btn-lg"
                        onClick={() => {

                            const headers = [
                                "Timestamp",
                                "Passenger_Count",
                                "Occupancy_Percent",
                                "Delay_Minutes",
                                "Number_of_Trips",
                                "Train_Frequency_Per_Hour",
                                "Train_Speed_kmph",
                                "Crowd_Level",
                                "Recommendation"
                            ];

                            const csv = [

                                headers.join(","),

                                ...history.map(item => [

                                    item.Timestamp,
                                    item.Passenger_Count,
                                    item.Occupancy_Percent,
                                    item.Delay_Minutes,
                                    item.Number_of_Trips,
                                    item.Train_Frequency_Per_Hour,
                                    item.Train_Speed_kmph,
                                    item.Crowd_Level,
                                    item.Recommendation

                                ].join(","))

                            ].join("\n");

                            const blob = new Blob(
                                [csv],
                                { type: "text/csv" }
                            );

                            const url = window.URL.createObjectURL(blob);

                            const link = document.createElement("a");

                            link.href = url;

                            link.download = "Prediction_History.csv";

                            link.click();

                        }}
                    >

                        <FaDownload />

                        {" "}

                        Export Prediction History

                    </button>

                </div>

                <div className="alert alert-success mt-5">

                    <strong>MetroFlow AI</strong>

                    {" "}

                    Prediction history is stored automatically after every prediction and can be exported for further analysis.

                </div>

            </div>

            <Footer />

        </>

    );

}

export default PredictionHistory;