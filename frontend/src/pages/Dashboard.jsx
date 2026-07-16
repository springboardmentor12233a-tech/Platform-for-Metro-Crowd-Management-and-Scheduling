import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import api from "../services/api";
import Charts from "../components/Charts";

import {
    FaUsers,
    FaTrain,
    FaClock,
    FaChartLine,
    FaDownload
} from "react-icons/fa";


function Dashboard() {


    const [data, setData] = useState(null);


    useEffect(() => {

    const loadDashboard = () => {

        api.get("/dashboard")

            .then(res => {

                console.log("Dashboard Data:", res.data);

                setData(res.data);

            })

            .catch(err => {

                console.log("Dashboard Error:", err);

            });

    };

    // Load immediately
    loadDashboard();

    // Refresh every 5 seconds
    const interval = setInterval(loadDashboard, 5000);

    // Cleanup when leaving page
    return () => clearInterval(interval);

}, []);

    if (!data)

    return (

        <>

        <Navbar/>

        <h2 className="page-title">
            Loading Dashboard...
        </h2>

        </>

    );



    return (

        <>


        <Navbar/>


        <div className="container mt-5">


            <h1 className="page-title">
                🚇 MetroFlow Dashboard
            </h1>
            



            {/* METRIC CARDS */}

            <div className="row">



                {/* Passenger Count */}

                <div className="col-md-4 mb-4">

                    <div className="metric-card">

                        <FaUsers className="metric-icon"/>

                        <div className="metric-title">
                            Passenger Count
                        </div>


                        <div className="metric-value">

                            {data.Current_Status.Passenger_Count}

                        </div>


                    </div>

                </div>





                {/* Crowd Level */}

                <div className="col-md-4 mb-4">

                    <div className="metric-card">

                        <FaTrain className="metric-icon"/>


                        <div className="metric-title">
                            Crowd Level
                        </div>


                        <div
                        className={
                            "metric-value " +
                            data.Current_Status.Crowd_Level.toLowerCase()
                        }
                        >

                        {data.Current_Status.Crowd_Level}

                        </div>


                    </div>

                </div>





                {/* Forecast */}

                <div className="col-md-4 mb-4">

                    <div className="metric-card">

                        <FaChartLine className="metric-icon"/>


                        <div className="metric-title">
                            Predicted Passengers
                        </div>


                        <div className="metric-value">

                            {data.Forecast.Predicted_Passenger_Count}

                        </div>


                    </div>


                </div>





                {/* Station */}

                <div className="col-md-4 mb-4">

                    <div className="metric-card">


                        <div className="metric-title">
                            Current Station
                        </div>


                        <div className="metric-value">

                            {data.Current_Status.Station}

                        </div>


                    </div>


                </div>






                {/* Delay */}

                <div className="col-md-4 mb-4">


                    <div className="metric-card">


                        <FaClock className="metric-icon"/>


                        <div className="metric-title">
                            Delay
                        </div>


                        <div className="metric-value">

                            {data.Current_Status.Delay_Minutes} min

                        </div>


                    </div>


                </div>





                {/* Total */}

                <div className="col-md-4 mb-4">


                    <div className="metric-card">


                        <div className="metric-title">
                            Total Passengers
                        </div>


                        <div className="metric-value">

                            {data.Traffic_Report.Total_Passengers}

                        </div>


                    </div>


                </div>



            </div>





            {/* ANALYTICS SECTION */}

            <div className="mt-5">

                <h2 className="page-title">

                    📊 Advanced Analytics

                </h2>


                <Charts data={data}/>


            </div>






            {/* DOWNLOAD REPORT */}

            <div className="text-center mt-5 mb-5">


                <button

                className="btn btn-success btn-lg"

                onClick={() =>
                    window.open(
                        "http://127.0.0.1:5000/report",
                        "_blank"
                    )
                }

                >

                <FaDownload/>

                &nbsp;

                Download Report

                </button>


            </div>




        </div>


        </>

    );

}


export default Dashboard;