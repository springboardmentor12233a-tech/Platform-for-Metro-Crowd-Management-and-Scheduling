"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle } from "lucide-react";

export default function LiveMonitoring() {

    const [stations, setStations] = useState<any[]>([]);
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");


    const fetchLiveData = async () => {
        try {

            const response = await fetch(
                "http://localhost:8000/api/crowd/all-stations"
            );

            const result = await response.json();

            setStations(result.stations || []);

            const alertResponse = await fetch(
                "http://localhost:8000/api/alerts/active"
            );

            const alertData = await alertResponse.json();

            setAlerts(alertData.alerts || []);

            setLastUpdated(
                new Date().toLocaleTimeString()
            );

            setLoading(false);

        } catch (error) {

            console.error(
                "Live monitoring error:",
                error
            );

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchLiveData();


        const interval = setInterval(() => {
            fetchLiveData();
        }, 10000);


        return () => clearInterval(interval);

    }, []);



    if (loading) {

        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading Live Monitoring...
            </div>
        );

    }
    const filteredStations = stations.filter((station: any) => {

        const matchesSearch =
            station.station_name
                ?.toLowerCase()
                .includes(search.toLowerCase());


        const matchesStatus =
            filterStatus === "All"
            ||
            station.status === filterStatus;


        return matchesSearch && matchesStatus;

    });


    return (

        <div className="min-h-screen bg-slate-950 text-white p-8">


            {/* HEADER */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">
                        🚇 Live Monitoring
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Real-time Metro Crowd Status
                    </p>

                </div>


                <div className="flex items-center gap-3 text-green-400">

                    <Activity size={22} />

                    <span>
                        Live
                    </span>

                </div>


            </div>



            {/* STATUS CARD */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">


                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <p className="text-slate-400">
                        Active Stations
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {stations.length}
                    </h2>

                </div>



                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <p className="text-slate-400">
                        Last Updated
                    </p>

                    <h2 className="text-xl font-bold mt-2">
                        {lastUpdated}
                    </h2>

                </div>



                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <p className="text-slate-400">
                        Refresh Rate
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        10 sec
                    </h2>

                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <p className="text-slate-400">
                        Active Alerts
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-red-400">
                        {alerts.length}
                    </h2>

                </div>


            </div>




            {/* STATION TABLE */}

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">


                <h2 className="text-xl font-bold mb-6">
                    Station Live Status
                </h2>

                <div className="flex flex-col md:flex-row gap-4 mb-6">


                    <input
                        type="text"
                        placeholder="Search station..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
                    />


                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
                    >

                        <option value="All">
                            All
                        </option>

                        <option value="Normal">
                            Normal
                        </option>

                        <option value="Warning">
                            Warning
                        </option>

                        <option value="Critical">
                            Critical
                        </option>

                    </select>


                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b border-slate-700 text-slate-400">

                                <th className="text-left p-3">
                                    Station
                                </th>

                                <th className="text-left p-3">
                                    Passengers
                                </th>

                                <th className="text-left p-3">
                                    Capacity
                                </th>

                                <th className="text-left p-3">
                                    Status
                                </th>


                            </tr>

                        </thead>


                        <tbody>

                            {
                                filteredStations.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center p-6 text-slate-400"
                                        >
                                            No stations found
                                        </td>
                                    </tr>

                                ) : (

                                    filteredStations.map((station) => (

                                        <tr
                                            key={station.station_id}
                                            className="border-b border-slate-800"
                                        >

                                            <td className="p-3">
                                                {station.station_name}
                                            </td>


                                            <td className="p-3">
                                                {station.passengers}
                                            </td>


                                            <td className="p-3">
                                                {station.capacity.toFixed(1)}%
                                            </td>


                                            <td className="p-3">

                                                <span
                                                    className={
                                                        station.status === "Normal"
                                                            ? "text-green-400"
                                                            : station.status === "Warning"
                                                                ? "text-yellow-400"
                                                                : "text-red-400"
                                                    }
                                                >
                                                    {station.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )

                            }

                        </tbody>


                    </table>

                </div>


            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mt-8">

                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertCircle className="text-red-400" />
                    Active Alerts
                </h2>


                {
                    alerts.length === 0 ?

                        (
                            <p className="text-green-400">
                                ✓ No active alerts. System normal.
                            </p>
                        )

                        :

                        (
                            <div className="space-y-3">

                                {
                                    alerts.map((alert: any, index: number) => (

                                        <div
                                            key={index}
                                            className="bg-slate-800 rounded-lg p-4 flex justify-between"
                                        >

                                            <div>

                                                <p className="font-semibold">
                                                    {alert.station_name || "Station"}
                                                </p>

                                                <p className="text-sm text-slate-400">
                                                    {alert.message}
                                                </p>

                                            </div>


                                            <span className="text-red-400 font-bold">
                                                {alert.severity || "Alert"}
                                            </span>


                                        </div>

                                    ))

                                }

                            </div>
                        )

                }

            </div>

        </div>

    );

}