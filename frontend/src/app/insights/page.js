"use client";
import { useEffect, useState } from "react";

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/ai-insights")
      .then((res) => res.json())
      .then((data) => {
        setInsights(data.insights || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error connecting to server");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">AI Insights</h1>
        <p className="text-slate-500 mt-1 mb-8">
          AI-generated observations from station data
        </p>

        {loading && <p className="text-slate-500">Loading insights...</p>}

        {error && (
          <p className="text-red-700 bg-red-100 rounded-lg py-2 px-3 text-sm">
            {error}
          </p>
        )}

        {!loading && !error && insights.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No insights available.
          </div>
        )}

        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <p className="text-slate-800">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}