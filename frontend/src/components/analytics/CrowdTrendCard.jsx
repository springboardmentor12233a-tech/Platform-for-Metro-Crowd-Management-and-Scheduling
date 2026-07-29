import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "../../styles/Analytics.css";


function CrowdTrendCard(){

  const data = [
    {
      day:"Mon",
      passengers:120
    },
    {
      day:"Tue",
      passengers:150
    },
    {
      day:"Wed",
      passengers:180
    },
    {
      day:"Thu",
      passengers:140
    },
    {
      day:"Fri",
      passengers:200
    },
    {
      day:"Sat",
      passengers:130
    },
    {
      day:"Sun",
      passengers:100
    }
  ];


  return(

    <div className="analytics-card">

      <h2>
        📈 Crowd Trend Analysis
      </h2>

      <p>
        Passenger flow over last 7 days
      </p>


      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <CartesianGrid />

          <XAxis dataKey="day"/>

          <YAxis/>

          <Tooltip/>

          <Line
            type="monotone"
            dataKey="passengers"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>


    </div>

  );

}

export default CrowdTrendCard;