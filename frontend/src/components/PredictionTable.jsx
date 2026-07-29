import "../styles/PredictionTable.css";


function PredictionTable({ predictions }) {


  if (!predictions) {
    return null;
  }


  return (

    <div className="prediction-table-card">


      <h3>📋 Recent Prediction History</h3>


      <table className="prediction-table">


        <thead>

          <tr>
            <th>From</th>
            <th>To</th>
            <th>Passengers</th>
            <th>Crowd</th>
            <th>Platform</th>
            <th>Time</th>
          </tr>

        </thead>


        <tbody>


          {predictions.map((prediction)=> (

            <tr key={prediction.id}>


              <td>{prediction.from_station}</td>

              <td>{prediction.to_station}</td>

              <td>{prediction.predicted_passengers}</td>


              <td>

                <span className={`badge ${prediction.crowd_level.toLowerCase()}`}>

                  {prediction.crowd_level}

                </span>

              </td>


              <td>{prediction.platform_status}</td>


              <td>

                {new Date(
                  prediction.prediction_time
                ).toLocaleString()}

              </td>


            </tr>

          ))}


        </tbody>


      </table>


    </div>

  );

}


export default PredictionTable;