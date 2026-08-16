import { AlertTriangle, Clock } from "lucide-react";

export default function CriticalStationCard({ station }) {

    const color = {

        "Very High": "bg-red-500",

        "High": "bg-yellow-500",

        "Medium": "bg-green-500",

        "Low": "bg-blue-500",

    };

    return (

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-red-500 transition">

            <div className="flex justify-between">

                <div>

                    <h3 className="text-white font-bold text-lg">

                        {station.station_name}

                    </h3>

                    <p className="text-slate-400">

                        Crowd Level

                    </p>

                </div>

                <AlertTriangle

                    className="text-red-400"

                    size={26}

                />

            </div>

            <span

                className={`inline-block mt-4 px-3 py-1 rounded-full text-white text-sm font-semibold ${color[station.crowd_level]}`}

            >

                {station.crowd_level}

            </span>

            <div className="mt-5 flex justify-between">

                <div>

                    <p className="text-slate-400 text-sm">

                        Delay

                    </p>

                    <h2 className="text-white text-2xl font-bold">

                        {station.predicted_delay} min

                    </h2>

                </div>

                <Clock

                    className="text-yellow-400"

                />

            </div>

            <div className="mt-5">

                <p className="text-cyan-400 font-semibold">

                    {station.recommendation}

                </p>

            </div>

        </div>

    );

}