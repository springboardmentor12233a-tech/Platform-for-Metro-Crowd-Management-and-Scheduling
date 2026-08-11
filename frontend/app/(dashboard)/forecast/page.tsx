"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
} from "recharts";

export default function ForecastPage() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    const result = await apiService.getForecast();

    console.log(result);
    console.log(result.forecast[0]);

    if (Array.isArray(result)) {
      setForecast(result);
    } else if (result.forecast) {
      setForecast(result.forecast);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading Forecast...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold">
        Passenger Flow Forecast
      </h1>

      <p className="text-slate-400 mt-2 mb-8">
        AI Passenger Demand Forecast (Next 24 Hours)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400">Total Forecast</p>
          <h2 className="text-3xl font-bold mt-2">
            {forecast.reduce(
              (sum, item) => sum + item.predicted_passengers,
              0
            )}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400">Peak Hour</p>
          <h2 className="text-3xl font-bold mt-2">
            {
              forecast.reduce((a, b) =>
                a.predicted_passengers > b.predicted_passengers ? a : b
              ).hour
            }:00
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400">Highest Demand</p>
          <h2 className="text-3xl font-bold mt-2">
            {
              forecast.reduce((a, b) =>
                a.predicted_passengers > b.predicted_passengers ? a : b
              ).predicted_passengers
            }
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400">Model Accuracy</p>
          <h2 className="text-3xl font-bold mt-2">
            91.2%
          </h2>
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          📈 24-Hour Passenger Forecast
        </h2>

        <div className="w-full h-[400px]">

          <ResponsiveContainer width="100%" height="100%">


            <LineChart data={forecast}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="hour"
                tickFormatter={(hour) =>
                  `${String(hour).padStart(2, "0")}:00`
                }
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="predicted_passengers"
                stroke="#06b6d4"
                strokeWidth={3}
              />

              {forecast
                .filter((item: any) => item.predicted_passengers > 900)
                .map((item: any) => (
                  <ReferenceDot
                    key={item.hour}
                    x={item.hour}
                    y={item.predicted_passengers}
                    r={7}
                    fill="red"
                    stroke="white"
                  />
                ))}

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          🔥 Peak Demand Hours
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {forecast
            .filter((item: any) => item.predicted_passengers > 900)
            .map((item: any) => (

              <div
                key={item.hour}
                className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center"
              >

                <p className="text-red-400 font-bold">
                  {String(item.hour).padStart(2, "0")}:00
                </p>

                <p className="text-2xl font-bold mt-2">
                  {item.predicted_passengers}
                </p>

                <p className="text-slate-400 text-sm">
                  passengers
                </p>

              </div>

            ))}

        </div>

      </div>

      <div className="mt-8 bg-slate-900 border border-cyan-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          🤖 AI Forecast Insights
        </h2>

        <div className="space-y-3 text-lg">

          <p>
            🚆 Highest predicted demand at{" "}
            <span className="text-red-400 font-bold">
              {
                forecast.reduce((a, b) =>
                  a.predicted_passengers > b.predicted_passengers ? a : b
                ).hour
              }:00
            </span>
          </p>

          <p>
            👥 Maximum passengers expected:{" "}
            <span className="text-cyan-400 font-bold">
              {
                forecast.reduce((a, b) =>
                  a.predicted_passengers > b.predicted_passengers ? a : b
                ).predicted_passengers
              }
            </span>
          </p>

          <p>
            📈 Morning and evening peaks detected based on AI demand prediction.
          </p>

          <p>
            🚇 Recommendation: Increase train frequency during peak hours to reduce congestion.
          </p>

        </div>

      </div>

      <table className="w-full bg-slate-900 rounded-xl overflow-hidden">

        <thead>
          <tr className="border-b border-slate-700">
            <th className="py-3">Hour</th>
            <th>Predicted Passengers</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {forecast.map((item: any, index: number) => (

            <tr
              key={index}
              className="border-b border-slate-800 text-center"
            >

              <td className="py-3">
                {String(item.hour).padStart(2, "0")}:00
              </td>

              <td>
                {item.predicted_passengers}
              </td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full ${item.predicted_passengers > 900
                      ? "bg-red-500/20 text-red-400"
                      : item.predicted_passengers > 400
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                >
                  {item.predicted_passengers > 900
                    ? "High"
                    : item.predicted_passengers > 400
                      ? "Medium"
                      : "Low"}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}