"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import {
  Brain,
  Users,
  Activity,
  Gauge,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AIPredictionPage() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {

    const predictionResult =
      await apiService.getSchedulingDashboard(8);

    setPrediction(predictionResult);

    const forecastResult =
      await apiService.getForecast();

    if (forecastResult.forecast) {
      setForecastData(forecastResult.forecast);
    }

  };

  const askAI = async () => {

    if (!question.trim()) return;

    setLoading(true);

    const result = await apiService.chatWithAI(question);

    const aiAnswer = result.answer || "No response from AI.";

    setAnswer(aiAnswer);

    setHistory((prev) => [
      ...prev,
      {
        question,
        answer: aiAnswer,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setLoading(false);
  };

  const askPresetQuestion = async (text: string) => {

    setQuestion(text);

    setLoading(true);

    const result = await apiService.chatWithAI(text);

    const aiAnswer = result.answer || "No response from AI.";

    setAnswer(aiAnswer);

    setHistory((prev) => [
      ...prev,
      {
        question: text,
        answer: aiAnswer,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold">
        🤖 AI Metro Assistant
      </h1>

      <p className="text-slate-400 mt-2 mb-8">
        Ask AI anything about your Metro Crowd Management System.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">

        {[
          "Which station is most crowded?",
          "Should I increase train frequency?",
          "Show peak hour prediction",
          "How can congestion be reduced?"
        ].map((item) => (

          <button
            key={item}
            onClick={() => setQuestion(item)}
            className="bg-slate-800 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm"
          >
            {item}
          </button>

        ))}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <Users className="text-cyan-400 mb-3" />
          <p className="text-slate-400">Predicted Passengers</p>
          <h2 className="text-3xl font-bold">
            {prediction?.predicted_passengers ?? "--"}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <Brain className="text-purple-400 mb-3" />
          <p className="text-slate-400">AI Confidence</p>
          <h2 className="text-3xl font-bold">
            91.2%
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <Activity className="text-red-400 mb-3" />
          <p className="text-slate-400">Peak Status</p>
          <h2 className="text-3xl font-bold">
            {prediction?.peak_hour?.priority === "HIGH"
              ? "🔴 Peak"
              : "🟢 Normal"}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <Gauge className="text-green-400 mb-3" />
          <p className="text-slate-400">Recommended Frequency</p>
          <h2 className="text-3xl font-bold">
            {prediction?.recommended_frequency ?? "--"} min
          </h2>
        </div>

      </div>

      <div className="bg-slate-900 border border-cyan-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          🧠 AI Prediction Summary
        </h2>

        <div className="space-y-4 text-lg">

          <p>
            👥 Predicted Passengers:
            <span className="text-cyan-400 font-bold ml-2">
              {prediction?.predicted_passengers}
            </span>
          </p>

          <p>
            🚆 Recommended Frequency:
            <span className="text-green-400 font-bold ml-2">
              {prediction?.recommended_frequency} min
            </span>
          </p>

          <p>
            🚉 Required Trains:
            <span className="text-yellow-400 font-bold ml-2">
              {prediction?.required_trains}
            </span>
          </p>

          <p>
            📊 Platform Load:
            <span className="text-purple-400 font-bold ml-2">
              {prediction?.platform_load}
            </span>
          </p>

          <p>
            ⚠️ Peak Hour:
            <span className="font-bold ml-2">
              {prediction?.peak_hour?.priority === "HIGH"
                ? "🔴 Peak Hour"
                : "🟢 Normal"}
            </span>
          </p>

        </div>

      </div>

      <div className="bg-slate-900 border border-green-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          🚦 AI Recommended Actions
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-green-500/10 border border-green-500 rounded-lg p-5">
            <h3 className="font-bold text-green-400">
              🚆 Train Frequency
            </h3>

            <p className="mt-2">
              Increase train frequency to{" "}
              <span className="font-bold">
                {prediction?.recommended_frequency} min
              </span>
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-5">
            <h3 className="font-bold text-yellow-400">
              👮 Staff Deployment
            </h3>

            <p className="mt-2">
              Deploy additional platform staff during peak periods.
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500 rounded-lg p-5">
            <h3 className="font-bold text-cyan-400">
              📊 Passenger Monitoring
            </h3>

            <p className="mt-2">
              Continuously monitor passenger density using AI prediction.
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500 rounded-lg p-5">
            <h3 className="font-bold text-red-400">
              🚨 Crowd Control
            </h3>

            <p className="mt-2">
              Prepare crowd management if passenger demand increases further.
            </p>
          </div>

        </div>

      </div>

      <div className="bg-slate-900 border border-cyan-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          📈 AI Prediction Trend
        </h2>

        <div className="w-full h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart
              data={forecastData}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="hour" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="predicted_passengers"
                stroke="#06b6d4"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          📋 AI Prediction History
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-slate-400">

              <th className="text-left py-3">Time</th>
              <th className="text-center py-3">Prediction</th>
              <th className="text-center py-3">Confidence</th>
              <th className="text-center py-3">Crowd Level</th>
              <th className="text-center py-3">Status</th>

            </tr>

          </thead>

          <tbody>

            {forecastData.map((item: any, index: number) => {

              const level =
                item.predicted_passengers > 3000
                  ? "Critical"
                  : item.predicted_passengers > 2000
                    ? "High"
                    : item.predicted_passengers > 1000
                      ? "Medium"
                      : "Low";

              return (

                <tr
                  key={index}
                  className="border-b border-slate-800 hover:bg-slate-800"
                >

                  <td className="py-3">
                    {String(item.hour).padStart(2, "0")}:00
                  </td>

                  <td className="text-center">
                    {item.predicted_passengers}
                  </td>

                  <td className="text-center">
                    91.2%
                  </td>

                  <td className="text-center">
                    {level}
                  </td>

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${level === "Critical"
                        ? "bg-red-500/20 text-red-400"
                        : level === "High"
                          ? "bg-orange-500/20 text-orange-400"
                          : level === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                    >

                      {level}

                    </span>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <button
          onClick={() => askPresetQuestion("Which station is most crowded?")}
          className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:bg-cyan-700 transition"
        >
          🚉 Most Crowded Station
        </button>

        <button
          onClick={() => askPresetQuestion("Optimize today's train frequency")}
          className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:bg-cyan-700 transition"
        >
          🚆 Optimize Frequency
        </button>

        <button
          onClick={() => askPresetQuestion("Show today's peak hour analysis")}
          className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:bg-cyan-700 transition"
        >
          📈 Peak Hour
        </button>

        <button
          onClick={() => askPresetQuestion("Give a passenger demand summary")}
          className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:bg-cyan-700 transition"
        >
          👥 Demand Summary
        </button>

      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Example: Which station is most crowded?"
        className="w-full h-36 bg-slate-900 border border-slate-700 rounded-lg p-4"
      />

      <button
        onClick={askAI}
        className="mt-5 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <button
        onClick={() => {
          setQuestion("");
          setAnswer("");
        }}
        className="mt-5 ml-3 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg"
      >
        Clear
      </button>

      {answer && (

        <div className="mt-8 bg-slate-900 border border-cyan-600 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            AI Response
          </h2>

          <div className="bg-slate-800 rounded-lg p-5">

            <p className="text-cyan-400 font-semibold mb-3">
              MetroFlow AI
            </p>

            <p className="leading-8 whitespace-pre-wrap text-slate-200">
              {answer}
            </p>

          </div>

        </div>

      )}

      {history.length > 0 && (

        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              📝 Conversation History
            </h2>

            <button
              onClick={() => setHistory([])}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Clear History
            </button>

          </div>

          <div className="space-y-5">

            {history
              .slice()
              .reverse()
              .map((item, index) => (

                <div
                  key={index}
                  className="border border-slate-700 rounded-lg p-4"
                >

                  <p className="text-cyan-400 font-semibold">
                    🙋 {item.question}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap">
                    🤖 {item.answer}
                  </p>

                  <p className="text-xs text-slate-500 mt-3">
                    {item.time}
                  </p>

                </div>

              ))}

          </div>

        </div>

      )}

    </div>

  );

}