import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Forecast() {

    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        api.get("/forecast")
            .then((res) => {
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
                <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                    Loading Forecast...
                </h2>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2>📈 Passenger Demand Forecast</h2>

                <table className="table table-bordered">

                    <tbody>

                        <tr>
                            <th>Station</th>
                            <td>{forecast.Station}</td>
                        </tr>

                        <tr>
                            <th>Predicted Passenger Count</th>
                            <td>{forecast.Predicted_Passenger_Count}</td>
                        </tr>

                        <tr>
                            <th>Recommendation</th>
                            <td>{forecast.Recommendation}</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </>
    );
}

export default Forecast;