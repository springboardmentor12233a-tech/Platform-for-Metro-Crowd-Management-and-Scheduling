import { useEffect, useState } from "react";

import UserLayout from "../layouts/UserLayout";

import "../styles/MyPrediction.css";


function MyPredictions(){

  const [predictions,setPredictions] = useState([]);

  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    const token = localStorage.getItem("token");

    fetch(
      "http://127.0.0.1:8000/user/my-prediction",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    .then(response=>response.json())

    .then(data=>{

      setPredictions(data);

    })

    .catch(error=>{

      console.error(
        "Prediction History Error:",
        error
      );

    })

    .finally(()=>{

      setLoading(false);

    });


  },[]);



  if(loading){

    return(

      <UserLayout>

        <h2>
          Loading Predictions...
        </h2>

      </UserLayout>

    );

  }


  return(

    <UserLayout>

      <div className="my-predictions">

        <h1>
          📊 My Predictions
        </h1>


        {
          predictions.length === 0 ? (

            <p>
              No predictions available.
            </p>

          ) : (

            predictions.map((prediction)=>(

              <div
                className="prediction-history-card"
                key={prediction.id}
              >

                <h3>
                  {prediction.from_station} → {prediction.to_station}
                </h3>


                <p>
                  Passengers:
                  {prediction.predicted_passengers}
                </p>


                <p>
                  Crowd Level:
                  {prediction.crowd_level}
                </p>


                <p>
                  Date:
                  {new Date(
                    prediction.prediction_time
                  ).toLocaleString()}
                </p>


              </div>

            ))

          )

        }


      </div>

    </UserLayout>

  );

}

export default MyPredictions;