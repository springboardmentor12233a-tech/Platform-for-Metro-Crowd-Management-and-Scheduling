import "../styles/HeatmapSection.css";

function HeatmapSection({ heatmapData }) {


  if (!heatmapData) {
    return null;
  }


  return (
    <div className="heatmap-card">

      <h3>🔥 Congestion Overview</h3>


      <table className="heatmap-table">


        <thead>
          <tr>
            <th>Route</th>
            <th>Crowd Level</th>
            <th>Passengers</th>
            <th>Status</th>
          </tr>
        </thead>


        <tbody>


          {heatmapData.map((route,index)=>(


            <tr key={index}>


              <td>
                {route.from_station} → {route.to_station}
              </td>


              <td>

                <span
                  className={`badge ${route.crowd_level.toLowerCase()}`}
                >

                  {route.crowd_level}

                </span>

              </td>


              <td>
                {route.predicted_passengers}
              </td>


              <td>
                {route.platform_status}
              </td>


            </tr>


          ))}


        </tbody>


      </table>


    </div>
  );
}

export default HeatmapSection;