import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/aiPages.css";

function CongestionHeatmap() {

    const [stations, setStations] = useState([]);

    useEffect(() => {

        fetchStations();

    }, []);

    const fetchStations = async () => {

        try {

            const res = await api.get("/heatmap/stations");

            setStations(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const getColor = (level) => {

        switch(level){

            case "Low":
                return "#22c55e";

            case "Medium":
                return "#eab308";

            case "High":
                return "#f97316";

            case "Critical":
                return "#ef4444";

            default:
                return "#94a3b8";
        }

    };

    return (

<div className="ai-page">

<div className="ai-header">

<h2>🗺 Metro Congestion Heatmap</h2>

<p>

Real-time crowd status across metro stations.

</p>

</div>

<div className="heatmap-grid">

{stations.map((station,index)=>(

<div

key={index}

className="heatmap-card"

style={{

borderTop:`8px solid ${getColor(station.crowd_level)}`

}}

>

<h3>{station.station}</h3>

<p>

👥 Passengers: {station.passengers}

</p>

<p>

🏢 Capacity: {station.capacity}

</p>

<p>

Crowd Level

</p>

<span

className="heat-badge"

style={{

background:getColor(station.crowd_level)

}}

>

{station.crowd_level}

</span>

</div>

))}

</div>

</div>

);

}

export default CongestionHeatmap;