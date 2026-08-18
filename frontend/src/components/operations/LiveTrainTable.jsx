import { Train } from "lucide-react";

export default function LiveTrainTable({ trains }) {
    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                🚆 Live Train Monitoring
            </h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-slate-200">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-700 text-sm uppercase tracking-wider">
                            <th className="py-3 text-left">Train</th>
                            <th className="text-left">Line</th>
                            <th className="text-left">Station</th>
                            <th className="text-left">Status</th>
                            <th className="text-left">Speed</th>
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-slate-700">
                        {trains.map((train) => (
                            <tr
                                key={train.train_number}
                                className="hover:bg-slate-700/50 transition-colors"
                            >
                                <td className="py-4 font-medium text-white">
                                    <div className="flex items-center gap-2">
                                        <Train size={18} className="text-blue-400" />
                                        {train.train_number}
                                    </div>
                                </td>
                                
                                <td>{train.line}</td>
                                
                                <td className="text-slate-300">{train.current_station}</td>
                                
                                <td>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm inline-block ${
                                            train.status === "Running"
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                : train.status === "Idle" || train.status === "Maintenance"
                                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                        }`}
                                    >
                                        {train.status}
                                    </span>
                                </td>
                                
                                <td className="font-mono text-slate-300">
                                    {train.speed_limit_kmh} km/h
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}