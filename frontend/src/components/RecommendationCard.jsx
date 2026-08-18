export default function RecommendationCard({ result }) {
    return (
      <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl p-8 mt-8 border border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          🚆 Frequency Recommendation
        </h2>
        
        <div className="space-y-4 text-base">
          <p>
            <strong className="text-slate-300">Current Frequency:</strong>{" "}
            <span className="text-blue-400 font-semibold">{result.current_frequency} min</span>
          </p>
          
          <p>
            <strong className="text-slate-300">Recommended Frequency:</strong>{" "}
            <span className="text-emerald-400 font-bold text-lg">
              {result.recommended_frequency} min
            </span>
          </p>
          
          <p>
            <strong className="text-slate-300">Additional Trains:</strong>{" "}
            <span className="text-amber-400 font-semibold">{result.additional_trains_required}</span>
          </p>
          
          <p>
            <strong className="text-slate-300">Reason:</strong>{" "}
            <span className="text-slate-300">{result.reason}</span>
          </p>
        </div>
      </div>
    );
  }