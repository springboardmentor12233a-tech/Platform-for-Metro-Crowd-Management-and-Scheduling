"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { Cpu, ShieldAlert, Zap, MessageCircle, Info } from "lucide-react";

export default function PredictionsPage() {
  const router = useRouter();
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [hour, setHour] = useState("9");
  const [dayName, setDayName] = useState("Monday");
  const [month, setMonth] = useState("7");
  const [isHoliday, setIsHoliday] = useState(false);
  const [weather, setWeather] = useState("Clear");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [ticketType, setTicketType] = useState("Smart Card");
  const [isInterchange, setIsInterchange] = useState(false);
  const [distance, setDistance] = useState("4.5");

  // Output prediction
  const [result, setResult] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await api.stations.list();
        setStations(data);
        if (data.length > 0) {
          setFromStation(data[0].station_name);
          setToStation(data[1]?.station_name || data[0].station_name);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    setErrorMsg("");
    setResult(null);

    const payload = {
      hour: parseInt(hour),
      day_name: dayName,
      month: parseInt(month),
      is_holiday: isHoliday,
      weather: weather,
      from_station: fromStation,
      to_station: toStation,
      distance_km: parseFloat(distance),
      ticket_type: ticketType,
      is_interchange: isInterchange
    };

    try {
      const data = await api.predict.run(payload);
      setResult(data);
      setPredicting(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to query crowd model prediction.");
      setPredicting(false);
    }
  };

  const handleAskGrokExplanation = () => {
    if (!result) return;
    const prompt = `Explain this crowd prediction: We expect ${result.predicted_passengers} passengers (${result.crowd_level} crowd) travelling from ${fromStation} to ${toStation} at ${hour}:00 on a ${dayName} in ${weather} conditions. Congestion status is classified as ${result.congestion_status}. Recommended dispatch adjustments: ${result.scheduling_recommendation?.explanation}. What does this mean and what should I do?`;
    sessionStorage.setItem("metroflow_assistant_query", prompt);
    router.push("/assistant");
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case "Very High": return "text-red-400 bg-red-950/20 border-red-900/35 shadow-[0_0_15px_rgba(239,68,68,0.05)]";
      case "High": return "text-orange-400 bg-orange-950/20 border-orange-900/35 shadow-[0_0_15px_rgba(249,115,22,0.05)]";
      case "Medium": return "text-yellow-400 bg-yellow-950/20 border-yellow-900/35";
      default: return "text-green-400 bg-green-950/20 border-green-900/35";
    }
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">MOUNTING INFERENCE ENGINE...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-slate-850 pb-5">
          <h1 className="text-lg font-black tracking-widest text-cyan-400 text-glow-cyan uppercase">
            AI INFERENCE WORKBENCH
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Run simulated trips to compute passenger loads, peak advisories, and timetable optimizations</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Inputs Panel */}
          <div className="rounded-2xl border border-slate-850 bg-[#060a16] p-6 shadow-md">
            <h3 className="text-xs font-black tracking-widest text-slate-350 uppercase mb-5 border-b border-slate-850 pb-3 flex items-center space-x-2">
              <Cpu size={14} className="text-cyan-400" />
              <span>Configure Scenario Parameters</span>
            </h3>

            <form onSubmit={handlePredict} className="space-y-4 text-xs font-bold font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Departure Interval</label>
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none focus:border-cyan-500/60 transition-all cursor-pointer"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}:00 HRS</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Day Type</label>
                  <select
                    value={dayName}
                    onChange={(e) => setDayName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none focus:border-cyan-500/60 transition-all cursor-pointer"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                      <option key={day} value={day}>{day.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Month Range</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none focus:border-cyan-500/60 transition-all cursor-pointer"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i+1} value={i+1}>{(i+1).toString().padStart(2, '0')} (MONTH)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Weather Advisory</label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none"
                  >
                    {["Clear", "Rain", "Heavy Rain", "Fog"].map(w => (
                      <option key={w} value={w}>{w.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Origin Station Stop</label>
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none focus:border-cyan-500/60 transition-all"
                  >
                    {stations.map(s => (
                      <option key={s.station_id} value={s.station_name}>{s.station_name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Destination Station Stop</label>
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none focus:border-cyan-500/60 transition-all"
                  >
                    {stations.map(s => (
                      <option key={s.station_id} value={s.station_name}>{s.station_name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Segment distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-slate-500 uppercase mb-1.5">Fare Media Class</label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3 text-slate-300 focus:outline-none"
                  >
                    {["Smart Card", "Token", "QR Ticket"].map(t => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="holidayCheck"
                    checked={isHoliday}
                    onChange={(e) => setIsHoliday(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="holidayCheck" className="text-[9px] text-slate-400 uppercase cursor-pointer select-none">Holiday Schedule</label>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="interchangeCheck"
                    checked={isInterchange}
                    onChange={(e) => setIsInterchange(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="interchangeCheck" className="text-[9px] text-slate-400 uppercase cursor-pointer select-none">Interchange Hub</label>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 rounded-xl bg-red-950/20 border border-red-900/30 p-3 text-red-400">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={predicting}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3.5 font-mono text-[9px] font-black uppercase tracking-widest text-slate-950 hover:from-cyan-400 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {predicting ? "RESOLVING INFERENCE NODES..." : "RUN MODEL PREDICTION"}
              </button>
            </form>
          </div>

          {/* Output Display Panel */}
          <div className="flex flex-col space-y-6">
            {result ? (
              <>
                {/* Predictions Panel */}
                <div className="rounded-2xl border border-slate-850 bg-[#060a16] p-6 shadow-md space-y-5">
                  <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase border-b border-slate-850 pb-3 flex items-center space-x-2">
                    <Info size={14} className="text-cyan-400" />
                    <span>trip density matrix</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850/60 text-center">
                      <span className="block text-[8px] font-black tracking-widest text-slate-500 uppercase">Predicted Segment Load</span>
                      <span className="block text-3xl font-black text-cyan-400 font-mono mt-1.5">{result.predicted_passengers}</span>
                      <span className="block text-[8px] text-slate-500 uppercase tracking-widest mt-1">Passengers / Trip</span>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850/60 text-center">
                      <span className="block text-[8px] font-black tracking-widest text-slate-500 uppercase">Sector classification</span>
                      <span className="block text-3xl font-black text-violet-400 font-mono mt-1.5 uppercase">{result.congestion_status}</span>
                      <span className="block text-[8px] text-slate-500 uppercase tracking-widest mt-1">Congestion Status</span>
                    </div>
                  </div>

                  <div className={`rounded-xl border p-4 flex items-center justify-between transition-all duration-300 ${getCrowdLevelColor(result.crowd_level)}`}>
                    <div>
                      <span className="block text-[8px] font-black uppercase tracking-widest opacity-80">Line Capacity Category</span>
                      <span className="block text-base font-black font-mono uppercase mt-0.5">{result.crowd_level} DENSITY LOAD</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/20 rounded-xl">
                      <Cpu size={20} />
                    </div>
                  </div>
                </div>

                {/* Recommendations Panel */}
                <div className="rounded-2xl border border-slate-850 bg-[#090f20] p-6 shadow-md space-y-4 border-l-4 border-l-cyan-400">
                  <div className="flex items-center space-x-2">
                    <Zap size={14} className="text-cyan-400" />
                    <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">Scheduling Optimizations</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-850/80">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Optimal Headway</span>
                      <span className="block text-sm font-black text-cyan-400 mt-1">{result.scheduling_recommendation?.recommended_headway_minutes} MIN</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-850/80">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Line frequency</span>
                      <span className="block text-sm font-black text-violet-400 mt-1">{result.scheduling_recommendation?.recommended_frequency_trains_per_hour}/HR</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-850/80">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Rolling stock</span>
                      <span className="block text-[11px] font-black text-green-400 mt-1.5 uppercase truncate">{result.scheduling_recommendation?.train_allocation_adjustment}</span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-300 italic leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-850/40">
                    "{result.scheduling_recommendation?.explanation}"
                  </p>

                  <button
                    onClick={handleAskGrokExplanation}
                    className="flex items-center space-x-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 py-3 font-mono text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all w-full justify-center cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                  >
                    <MessageCircle size={14} />
                    <span>ANALYZE WITH METROMIND AI</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-605 border border-dashed border-slate-850/80 rounded-2xl bg-slate-950/10 p-8 text-center min-h-[300px]">
                <Cpu size={30} className="text-cyan-500/30 mb-2 animate-bounce" />
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Awaiting Simulation Configuration</h4>
                <p className="text-[10px] text-slate-600 max-w-xs leading-normal">Configure the trip parameters on the left and trigger prediction to model station passenger loads and schedule optimization headway advice.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
