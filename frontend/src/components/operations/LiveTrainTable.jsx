import { Train } from "lucide-react";

export default function LiveTrainTable({ trains }) {

    return (

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-2xl font-bold text-white mb-5">

                🚆 Live Train Monitoring

            </h2>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="text-slate-400 border-b border-slate-700">

                            <th className="py-3 text-left">

                                Train

                            </th>

                            <th className="text-left">

                                Line

                            </th>

                            <th className="text-left">

                                Station

                            </th>

                            <th className="text-left">

                                Status

                            </th>

                            <th className="text-left">

                                Speed

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            trains.map(train => (

                                <tr

                                    key={train.train_number}

                                    className="border-b border-slate-700 hover:bg-slate-700"

                                >

                                    <td className="py-4">

                                        <div className="flex items-center gap-2">

                                            <Train
                                                size={18}
                                            />

                                            {train.train_number}

                                        </div>

                                    </td>

                                    <td>

                                        {train.line}

                                    </td>

                                    <td>

                                        {train.current_station}

                                    </td>

                                    <td>

                                        <span

                                            className={`px-3 py-1 rounded-full text-sm text-white ${
                                                train.status === "Running"
                                                    ? "bg-green-500"
                                                    : train.status === "Idle"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }`}

                                        >

                                            {train.status}

                                        </span>

                                    </td>

                                    <td>

                                        {train.speed_limit_kmh} km/h

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}