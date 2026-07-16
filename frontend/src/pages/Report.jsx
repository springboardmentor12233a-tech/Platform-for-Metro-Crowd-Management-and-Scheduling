import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Report() {

    const [report, setReport] = useState(null);


    useEffect(() => {

        api.get("/report")
        .then((response)=>{

            console.log("Report Data:", response.data);

            setReport(response.data);

        })
        .catch((error)=>{

            console.log(error);

        });


    },[]);



    if(!report){

        return (

            <>
            <Navbar/>

            <h3 className="text-center mt-5">
                Loading Report...
            </h3>

            </>

        );

    }



    return (

        <>

        <Navbar/>


        <div className="container mt-5">


            <h2 className="text-center mb-4">
                Traffic Analysis Report
            </h2>



            <div className="row">


                <div className="col-md-4 mb-3">

                    <div className="card shadow p-4">

                        <h5>Total Passengers</h5>

                        <h2>
                            {report.Total_Passengers}
                        </h2>

                    </div>

                </div>



                <div className="col-md-4 mb-3">

                    <div className="card shadow p-4">

                        <h5>Average Passenger Count</h5>

                        <h2>
                            {report.Average_Passenger_Count}
                        </h2>

                    </div>

                </div>



                <div className="col-md-4 mb-3">

                    <div className="card shadow p-4">

                        <h5>Average Delay</h5>

                        <h2>
                            {report.Average_Delay} min
                        </h2>

                    </div>

                </div>



                <div className="col-md-4 mb-3">

                    <div className="card shadow p-4">

                        <h5>Maximum Occupancy</h5>

                        <h2>
                            {report.Maximum_Occupancy} %
                        </h2>

                    </div>

                </div>



                <div className="col-md-4 mb-3">

                    <div className="card shadow p-4">

                        <h5>Peak Hour</h5>

                        <h2>
                            {report.Peak_Hour}
                        </h2>

                    </div>

                </div>



                <div className="col-md-4 mb-3">

                    <div className="card shadow p-4">

                        <h5>Most Crowded Station</h5>

                        <h3>
                            {report.Most_Crowded_Station}
                        </h3>

                    </div>

                </div>


            </div>


        </div>


        </>

    );

}


export default Report;