import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {

  const barData = {
    labels: [
      "Airport",
      "Central",
      "University",
      "Market",
      "Tech Park"
    ],
    datasets: [
      {
        label: "Passenger Count",
        data: [4800,6200,3100,5200,4500],
        backgroundColor: [
          "#1565C0",
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#AB47BC"
        ]
      }
    ]
  };

  const pieData = {
    labels:["Low","Medium","High"],
    datasets:[
      {
        data:[25,45,30],
        backgroundColor:[
          "#66BB6A",
          "#FFA726",
          "#EF5350"
        ]
      }
    ]
  };

  const lineData = {
    labels:[
      "6AM",
      "8AM",
      "10AM",
      "12PM",
      "2PM",
      "4PM",
      "6PM"
    ],
    datasets:[
      {
        label:"Passenger Trend",
        data:[1200,5800,4200,3500,4000,6200,7100],
        borderColor:"#1565C0",
        fill:false
      }
    ]
  };

  return (
    <>
      <Navbar/>

      <div
        style={{
          padding:"30px",
          background:"#F4F8FF",
          minHeight:"100vh"
        }}
      >

        <h1 style={{color:"#1565C0"}}>
          📊 Analytics Dashboard
        </h1>

        <div style={{marginTop:"40px"}}>
          <h2>Passenger Count by Station</h2>
          <Bar data={barData}/>
        </div>

        <br/><br/>

        <div style={{width:"400px",margin:"auto"}}>
          <h2 style={{textAlign:"center"}}>
            Crowd Distribution
          </h2>
          <Pie data={pieData}/>
        </div>

        <br/><br/>

        <div>
          <h2>Hourly Passenger Trend</h2>
          <Line data={lineData}/>
        </div>

      </div>
    </>
  );

}

export default Analytics;