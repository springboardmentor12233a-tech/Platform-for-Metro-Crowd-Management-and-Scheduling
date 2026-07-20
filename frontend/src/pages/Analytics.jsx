import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  BarChart,
  Bar,
 XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Analytics() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const loadAnalytics = () => {

      api.get("/dashboard")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

    };

    loadAnalytics();

    const interval = setInterval(loadAnalytics, 5000);

    return () => clearInterval(interval);

  }, []);

  if (!data) {

    return (
      <>
        <Navbar />

        <div className="container text-center mt-5">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">
            Loading Analytics...
          </h3>

        </div>

        <Footer />
      </>
    );

  }

  const COLORS = [
    "#28a745",
    "#ffc107",
    "#dc3545"
  ];

  return (

    <>

      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center">
          📊 MetroFlow Analytics Dashboard
        </h1>

        <p className="text-center text-muted">
          AI Powered Operational Analytics
        </p>

        <hr />

        {/* Summary Cards */}

        <div className="row mb-4">

          <div className="col-md-4">

            <div className="card shadow text-center p-3">

              <h5>Total Passengers</h5>

              <h2>{data.Traffic_Report.Total_Passengers}</h2>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow text-center p-3">

              <h5>Average Delay</h5>

              <h2>{data.Traffic_Report.Average_Delay} min</h2>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow text-center p-3">

              <h5>Predicted Passengers</h5>

              <h2>{data.Forecast.Predicted_Passenger_Count}</h2>

            </div>

          </div>

        </div>

        {/* Charts */}

        <div className="row">

          <div className="col-md-6 mb-4">

            <div className="card shadow p-3">

              <h4 className="text-center">
                Crowd Distribution
              </h4>

              <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                  <Pie
                    data={data.Analytics.Crowd_Distribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {data.Analytics.Crowd_Distribution.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          <div className="col-md-6 mb-4">

            <div className="card shadow p-3">

              <h4 className="text-center">
                Top Busy Stations
              </h4>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart
                  data={data.Analytics.Top_Stations}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="station" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="passengers"
                    fill="#0d6efd"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Peak Hour Chart */}

        <div className="card shadow p-4 mt-4">

          <h3 className="text-center mb-4">
            Peak Hour Analysis
          </h3>

          <ResponsiveContainer width="100%" height={350}>

            <BarChart
              data={data.Analytics.Peak_Hour}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="hour" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="passengers"
                fill="#198754"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Operational Insights */}

        <div className="card shadow p-4 mt-5">

          <h3 className="mb-4">
            🚦 Operational Insights
          </h3>

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th>Current Station</th>
                <td>{data.Current_Status.Station}</td>
              </tr>

              <tr>
                <th>Current Crowd Level</th>
                <td>{data.Current_Status.Crowd_Level}</td>
              </tr>

              <tr>
                <th>Current Passenger Count</th>
                <td>{data.Current_Status.Passenger_Count}</td>
              </tr>

              <tr>
                <th>Current Delay</th>
                <td>{data.Current_Status.Delay_Minutes} Minutes</td>
              </tr>

              <tr>
                <th>Predicted Passenger Count</th>
                <td>{data.Forecast.Predicted_Passenger_Count}</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Analytics;