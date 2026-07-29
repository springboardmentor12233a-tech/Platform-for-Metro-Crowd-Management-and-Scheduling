import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "../../styles/Analytics.css";
import { Legend } from "recharts";


function CrowdDistributionCard(){

  const data = [
    {
      name:"High",
      value:30
    },
    {
      name:"Moderate",
      value:50
    },
    {
      name:"Low",
      value:20
    }
  ];
  const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e"
  ];


  return(

    <div className="analytics-card">

      <h2>
        📊 Crowd Distribution
      </h2>

      <p>
        Overall crowd level percentage
      </p>


      <ResponsiveContainer width="100%" height={250}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >

            {
              data.map((entry,index)=>(
                <Cell key={index}
                fill={COLORS[index]}
                />
              ))
            }

          </Pie>


          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>


    </div>

  );

}

export default CrowdDistributionCard;