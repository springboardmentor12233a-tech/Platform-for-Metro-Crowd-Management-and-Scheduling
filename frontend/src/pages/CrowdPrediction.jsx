import React, { useEffect, useState } from 'react';
import api from '../services/api';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Brain, Calendar, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';

const CrowdPrediction = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [loading, setLoading] = useState(true);
  const [predLoading, setPredLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get('/stations');
        // If response format is paginated: { data: [...] }
        const list = response.data?.data || response.data || [];
        setStations(list);
        if (list.length > 0) {
          setSelectedStation(list[0].name);
        }
      } catch (err) {
        console.error("Error loading stations:", err);
        setError('Failed to load metro stations list.');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!selectedStation) return;
    setPredLoading(true);
    setError('');
    setPredictionResult(null);
    try {
      const response = await api.post('/predict-crowd', {
        station: selectedStation,
        date: selectedDate,
        time: selectedTime
      });
      setPredictionResult(response.data);
    } catch (err) {
      console.error("Error predicting crowd:", err);
      setError('Failed to compute crowd prediction. Ensure backend is running.');
    } finally {
      setPredLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading stations data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Brain className="text-violet-500" size={24} />
          <span>Crowd Congestion Prediction</span>
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          Query the Random Forest classification/regression models to predict passenger levels and overcrowding risk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prediction Request Form */}
        <div className="md:col-span-1">
          <GlassmorphicCard className="p-5 space-y-4" hoverEffect={false}>
            <h3 className="font-bold text-slate-200 border-b border-white/5 pb-2 text-sm flex items-center gap-2">
              <Brain size={16} className="text-violet-500" />
              <span>Model Inputs</span>
            </h3>

            <form onSubmit={handlePredict} className="space-y-4 text-xs font-semibold text-slate-300">
              <div className="space-y-1">
                <label className="text-slate-400">Station Name</label>
                <select 
                  value={selectedStation} 
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500"
                >
                  {stations.map((st) => (
                    <option key={st.id || st._id} value={st.name}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Target Date</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Target Time (HH:MM)</label>
                <input 
                  type="time"
                  value={selectedTime} 
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={predLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {predLoading ? (
                  <>
                    <Activity className="animate-spin" size={14} />
                    <span>Running Inference...</span>
                  </>
                ) : (
                  <>
                    <Brain size={14} />
                    <span>Run Inference</span>
                  </>
                )}
              </button>
            </form>
          </GlassmorphicCard>
        </div>

        {/* Prediction Results Display */}
        <div className="md:col-span-2 space-y-4">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-semibold rounded-xl flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>{error}</span>
            </div>
          )}

          {predictionResult ? (
            <div className="space-y-5">
              <h2 className="text-base font-black text-slate-200">Prediction Results</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Result 1: Passenger Count */}
                <GlassmorphicCard className="p-5 flex flex-col justify-between" hoverEffect={false}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Predicted Inflow Volume</span>
                    <div className="text-3xl font-black text-violet-400 mt-2">
                      {predictionResult.predicted_passenger_count} <span className="text-xs text-slate-500 font-semibold">passengers/hr</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 mt-4 leading-relaxed">
                    Based on time scheduling logs, station proximity variables, and day weight averages.
                  </p>
                </GlassmorphicCard>

                {/* Result 2: Crowd Level / Status */}
                <GlassmorphicCard 
                  className={`p-5 flex flex-col justify-between border-l-4 ${
                    predictionResult.crowd_level === 'Red' ? 'border-l-rose-500' :
                    predictionResult.crowd_level === 'Orange' ? 'border-l-orange-500' :
                    predictionResult.crowd_level === 'Yellow' ? 'border-l-amber-500' :
                    'border-l-emerald-500'
                  }`} 
                  hoverEffect={false}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Crowd Density Index</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className={`text-3xl font-black ${
                        predictionResult.crowd_level === 'Red' ? 'text-rose-500' :
                        predictionResult.crowd_level === 'Orange' ? 'text-orange-400' :
                        predictionResult.crowd_level === 'Yellow' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>{predictionResult.crowd_level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-slate-400">
                    <span>Congestion Risk Level:</span>
                    <span className={`uppercase font-black ${
                      predictionResult.congestion_risk === 'Critical' ? 'text-rose-500 animate-pulse' :
                      predictionResult.congestion_risk === 'High' ? 'text-orange-400' :
                      predictionResult.congestion_risk === 'Medium' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {predictionResult.congestion_risk}
                    </span>
                  </div>
                </GlassmorphicCard>
              </div>

              {/* Confidence Score Bar */}
              <GlassmorphicCard className="p-5 space-y-3" hoverEffect={false}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">Model Inference Confidence</span>
                  <span className="text-violet-400 font-black">{(predictionResult.confidence_score * 100).toFixed(0)}% Accuracy Probability</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#8b5cf6]" 
                    style={{ width: `${predictionResult.confidence_score * 100}%` }}
                  />
                </div>
                <p className="text-[9px] font-semibold text-slate-500 leading-relaxed pt-1">
                  *Confidence is dynamically calculated based on validation score splits and tree variance indexes of the RandomForest ensemble.
                </p>
              </GlassmorphicCard>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-950/20 rounded-3xl border border-white/5">
              <Brain size={48} className="text-slate-700 mb-4 animate-pulse" />
              <p className="text-sm font-black text-slate-400">No predictions generated.</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">Configure inputs on the left to calculate crowd forecast.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrowdPrediction;
