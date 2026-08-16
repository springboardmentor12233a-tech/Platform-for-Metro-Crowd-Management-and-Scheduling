import {
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

export default function LiveAlerts({ dashboard }) {

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold text-white mb-5">
                🔔 Live Alerts
            </h2>

            <div className="space-y-4">

                {dashboard.critical_stations.map(
                    (station, index) => (

                        <div
                            key={`${station.station_name}-${index}`}
                            className="flex justify-between items-center border-b border-slate-700 pb-3"
                        >

                            {/* Station Information */}

                            <div>

                                <h3 className="text-white">
                                    {station.station_name}
                                </h3>

                                <p className="text-slate-400">
                                    {station.crowd_level}
                                </p>

                            </div>

                            {/* Alert Status */}

                            {station.predicted_delay > 8 ? (

                                <AlertTriangle
                                    className="text-red-500"
                                />

                            ) : (

                                <CheckCircle
                                    className="text-green-500"
                                />

                            )}

                        </div>

                    )
                )}

            </div>

        </div>
    );
}