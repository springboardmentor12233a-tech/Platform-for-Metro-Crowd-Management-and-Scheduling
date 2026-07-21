import { useEffect, useState } from "react";
import { getPredictionHistory } from "../../api/predictionHistory";

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getPredictionHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredHistory = history.filter(
    (item) =>
      item.from_station.toLowerCase().includes(search.toLowerCase()) ||
      item.to_station.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📜 Prediction History
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

        <input
          type="text"
          placeholder="Search by station..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">

            <tr>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Passengers</th>
              <th className="p-4">Ticket</th>
              <th className="p-4">Remarks</th>
              <th className="p-4">Time</th>
            </tr>

          </thead>

          <tbody>

            {filteredHistory.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4">{item.from_station}</td>

                <td className="p-4">{item.to_station}</td>

                <td className="p-4 font-bold">
                  {Math.round(item.predicted_passengers)}
                </td>

                <td className="p-4">
                  {item.ticket_type}
                </td>

                <td className="p-4">
                  {item.remarks}
                </td>

                <td className="p-4">
                  {new Date(item.created_at).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}