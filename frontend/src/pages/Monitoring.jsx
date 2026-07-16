import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Monitoring() {

    const [monitor, setMonitor] = useState(null);

    useEffect(() => {

        api.get("/monitor")
            .then((res) => {
                setMonitor(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);

    if (!monitor) {
        return (
            <>
                <Navbar />
                <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                    Loading Monitoring Data...
                </h2>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2 className="text-center mb-4">
                    🚇 Real-Time Operational Monitoring
                </h2>

                <table className="table table-bordered table-striped table-hover shadow">

                    <tbody>

                        <tr>
                            <th>Date</th>
                            <td>{monitor.Date}</td>
                        </tr>

                        <tr>
                            <th>Time</th>
                            <td>{monitor.Time}</td>
                        </tr>

                        <tr>
                            <th>Station</th>
                            <td>{monitor.Station}</td>
                        </tr>

                        <tr>
                            <th>Passenger Count</th>
                            <td>{monitor.Passenger_Count}</td>
                        </tr>

                        <tr>
                            <th>Passenger Entries</th>
                            <td>{monitor.Passenger_Entries}</td>
                        </tr>

                        <tr>
                            <th>Passenger Exits</th>
                            <td>{monitor.Passenger_Exits}</td>
                        </tr>

                        {/* Occupancy Progress Bar */}
                        <tr>
                            <th>Occupancy</th>

                            <td>

                                <div className="progress" style={{ height: "25px" }}>

                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{
                                            width: `${monitor.Occupancy_Percent}%`
                                        }}
                                    >
                                        {monitor.Occupancy_Percent}%
                                    </div>

                                </div>

                            </td>

                        </tr>

                        {/* Crowd Level Badge */}
                        <tr>
                            <th>Crowd Level</th>

                            <td>

                                {monitor.Crowd_Level === "High" && (
                                    <span className="badge bg-danger fs-6">
                                        High
                                    </span>
                                )}

                                {monitor.Crowd_Level === "Medium" && (
                                    <span className="badge bg-warning text-dark fs-6">
                                        Medium
                                    </span>
                                )}

                                {monitor.Crowd_Level === "Low" && (
                                    <span className="badge bg-success fs-6">
                                        Low
                                    </span>
                                )}

                            </td>

                        </tr>

                        <tr>
                            <th>Delay</th>
                            <td>{monitor.Delay_Minutes} Minutes</td>
                        </tr>

                        <tr>
                            <th>Trips</th>
                            <td>{monitor.Trips}</td>
                        </tr>

                    </tbody>

                </table>

            </div>
        </>
    );
}

export default Monitoring;