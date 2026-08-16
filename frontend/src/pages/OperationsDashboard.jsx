import { useEffect, useState } from "react";

import {
    Train,
    Activity,
    Wrench,
    Clock,
    Users,
    AlertTriangle,
} from "lucide-react";

import operationsService from "../services/operationsService";
import trainService from "../services/trainStatusService";

import KPICard from "../components/operations/KPICard";
import CriticalStationCard from "../components/operations/CriticalStationCard";
import TrainStatusChart from "../components/operations/TrainStatusChart";
import DelayChart from "../components/operations/DelayChart";
import CrowdChart from "../components/operations/CrowdChart";
import LiveAlerts from "../components/operations/LiveAlerts";
import LiveTrainTable from "../components/operations/LiveTrainTable";


export default function OperationsDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);


    const loadDashboard = async () => {

        try {

            setError("");

            const [
                dashboardData,
                trainData,
            ] = await Promise.all([
                operationsService.getDashboard(),
                trainService.getAllTrains(),
            ]);

            setDashboard(
                dashboardData || null
            );

            setTrains(
                Array.isArray(trainData)
                    ? trainData
                    : []
            );

            setLastUpdated(
                new Date()
            );

        } catch (err) {

            console.error(
                "Failed to load operations dashboard:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Unable to load operations dashboard."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboard();

        const interval = setInterval(
            loadDashboard,
            30000
        );

        return () =>
            clearInterval(interval);

    }, []);


    if (loading && !dashboard) {

        return (
            <div className="flex items-center justify-center h-[70vh]">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />

                    <h2 className="text-white text-xl font-semibold">
                        Loading Operations Dashboard...
                    </h2>

                    <p className="text-slate-400 text-sm mt-2">
                        Fetching live operational data
                    </p>

                </div>

            </div>
        );

    }


    if (error && !dashboard) {

        return (
            <div className="flex items-center justify-center h-[70vh]">

                <div className="glass-card p-8 text-center">

                    <AlertTriangle className="mx-auto text-red-400 mb-4" size={40} />

                    <h2 className="text-red-400 text-xl font-semibold">
                        Failed to load dashboard
                    </h2>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="mt-5 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition"
                    >
                        Retry
                    </button>

                </div>

            </div>
        );

    }


    const totalTrains =
        Number(
            dashboard?.total_trains ?? 0
        );

    const runningTrains =
        Number(
            dashboard?.running_trains ?? 0
        );

    const idleTrains =
        Number(
            dashboard?.idle_trains ?? 0
        );

    const maintenanceTrains =
        Number(
            dashboard?.maintenance_trains ?? 0
        );

    const delayedTrains =
        Number(
            dashboard?.delayed_trains ?? 0
        );

    const averageDelay =
        Number(
            dashboard?.average_delay ?? 0
        );

    const highCrowdStations =
        Number(
            dashboard?.high_crowd_stations ?? 0
        );

    const criticalStations =
        Array.isArray(
            dashboard?.critical_stations
        )
            ? dashboard.critical_stations
            : [];


    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-bold text-white">
                    🚇 Metro Operations Dashboard
                </h1>

                <p className="text-slate-400 mt-2">
                    AI-powered metro control center
                </p>

                <div className="flex items-center gap-3 mt-4">

                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

                    <span className="text-green-400 font-medium">
                        Live Monitoring
                    </span>

                    {lastUpdated && (
                        <span className="text-slate-500">
                            Last Updated:{" "}
                            {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}

                </div>

            </div>


            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 shadow-xl flex justify-between items-center">

                <div>

                    <h2 className="text-2xl font-bold text-white">
                        🚇 Metro Network Status
                    </h2>

                    <p className="text-cyan-100 mt-2">
                        Live statistics from the operational system
                    </p>

                </div>

                <div className="text-right">

                    <h2 className="text-4xl font-bold text-white">
                        ONLINE
                    </h2>

                    <p className="text-cyan-100">
                        Backend Connected
                    </p>

                </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <KPICard
                    title="Total Trains"
                    value={totalTrains}
                    icon={<Train />}
                    color="text-cyan-400"
                />

                <KPICard
                    title="Running"
                    value={runningTrains}
                    icon={<Activity />}
                    color="text-green-400"
                />

                <KPICard
                    title="Maintenance"
                    value={maintenanceTrains}
                    icon={<Wrench />}
                    color="text-red-400"
                />

                <KPICard
                    title="Delayed"
                    value={delayedTrains}
                    icon={<Clock />}
                    color="text-yellow-400"
                />

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <KPICard
                    title="Average Delay"
                    value={`${averageDelay.toFixed(2)} min`}
                    icon={<Clock />}
                    color="text-orange-400"
                />

                <KPICard
                    title="High Crowd Stations"
                    value={highCrowdStations}
                    icon={<Users />}
                    color="text-purple-400"
                />

            </div>


            <div className="grid lg:grid-cols-2 gap-8">

                <div>

                    <h2 className="text-2xl font-bold text-white mb-5">
                        🚨 Critical Stations
                    </h2>

                    <div className="space-y-4">

                        {criticalStations.length > 0 ? (

                            criticalStations.map(
                                (station, index) => (

                                    <CriticalStationCard
                                        key={
                                            `${station.station_name}-${index}`
                                        }
                                        station={station}
                                    />

                                )
                            )

                        ) : (

                            <div className="glass-card p-6">

                                <p className="text-green-400 font-medium">
                                    ✓ No critical stations detected
                                </p>

                                <p className="text-slate-400 text-sm mt-1">
                                    No stations currently exceed the critical threshold.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                <div>

                    <h2 className="text-2xl font-bold text-white mb-5">
                        🤖 AI Operational Predictions
                    </h2>

                    <div className="space-y-4">

                        {criticalStations.length > 0 ? (

                            criticalStations.map(
                                (station, index) => (

                                    <div
                                        key={
                                            `prediction-${station.station_name}-${index}`
                                        }
                                        className="glass-card p-5"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h3 className="text-white font-semibold">
                                                    {station.station_name}
                                                </h3>

                                                <p className="text-slate-400 text-sm mt-1">
                                                    Crowd:{" "}
                                                    <span className="text-white">
                                                        {station.crowd_level}
                                                    </span>
                                                </p>

                                                <p className="text-slate-400 text-sm">
                                                    Predicted Delay:{" "}
                                                    <span className="text-yellow-400">
                                                        {station.predicted_delay} min
                                                    </span>
                                                </p>

                                            </div>

                                            <AlertTriangle
                                                size={22}
                                                className="text-yellow-400"
                                            />

                                        </div>

                                        <div className="mt-4 pt-3 border-t border-white/10">

                                            <p className="text-cyan-400 text-sm">
                                                {station.recommendation}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )

                        ) : (

                            <div className="glass-card p-6">

                                <p className="text-slate-300">
                                    No AI recommendations available.
                                </p>

                                <p className="text-slate-500 text-sm mt-1">
                                    Predictions will appear when critical-station data is available.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            <div className="grid lg:grid-cols-3 gap-8">

                <TrainStatusChart
                    dashboard={{
                        total_trains: totalTrains,
                        running_trains: runningTrains,
                        idle_trains: idleTrains,
                        maintenance_trains: maintenanceTrains,
                    }}
                />

                <DelayChart
                    dashboard={{
                        delayed_trains: delayedTrains,
                        average_delay: averageDelay,
                    }}
                />

                <CrowdChart
                    dashboard={{
                        high_crowd_stations:
                            highCrowdStations,
                        critical_stations:
                            criticalStations,
                    }}
                />

            </div>


            <div>

                <LiveTrainTable
                    trains={trains}
                />

            </div>


            <div>

                <LiveAlerts
                    dashboard={{
                        delayed_trains:
                            delayedTrains,

                        average_delay:
                            averageDelay,

                        high_crowd_stations:
                            highCrowdStations,

                        critical_stations:
                            criticalStations,
                    }}
                />

            </div>

        </div>

    );

}