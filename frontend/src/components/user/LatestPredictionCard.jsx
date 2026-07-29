import { useEffect, useState } from "react";
import "../../styles/User/LatestPredictionCardUser.css";


function LastPredictionCard(){
    const [prediction,setPrediction] = useState(null);
    useEffect(()=>{
        const token = localStorage.getItem("token");
        fetch(
            "http://127.0.0.1:8000/user/latest-prediction",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )
        .then(res=>res.json())
        .then(data=>{
            setPrediction(data);
        })
        .catch(error=>{
            console.log(error);
        })
    },[]);
    if(!prediction){
        return null;
    }
    return (
        <div className="last-prediction-card">
            <h2>
                🚆 Your Last Prediction
            </h2>
            <div className="route">

                {prediction.from_station}

                <span>
                    →
                </span>

                {prediction.to_station}

            </div>
            <div className="prediction-details">
                <div>
                    <span>
                        Passengers
                    </span>

                    <h3>
                        {prediction.predicted_passengers}
                    </h3>
                </div>
                <div>
                    <span>
                        Crowd Level
                    </span>

                    <h3>
                        {prediction.crowd_level}
                    </h3>
                </div>
                <div>
                    <span>
                        Platform
                    </span>
                    <h3>
                        {prediction.platform_status}
                    </h3>
                </div>
            </div>
            <button>
                See Crowd
            </button>
        </div>

    );
}


export default LastPredictionCard;