import { useEffect, useState } from "react";

import {
    Search,
    RefreshCw,
    MapPin,
    Navigation,
    Gauge,
    Clock,
    Radio,
} from "lucide-react";

import trainService from "../services/trainStatusService";
import trainLocationService from "../services/trainLocationService";

import StatsCard from "../components/trainStatus/StatsCard";
import TrainCard from "../components/trainStatus/TrainCard";


export default function TrainStatus() {

    // ============================================================
    // Train Status State
    // ============================================================

    const [trains, setTrains] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ============================================================
    // Train Location State
    // ============================================================

    const [trainLocations, setTrainLocations] =
        useState([]);

    const [locationLoading, setLocationLoading] =
        useState(true);


    // ============================================================
    // Filters
    // ============================================================

    const [search, setSearch] = useState("");

    const [lineFilter, setLineFilter] =
        useState("All");

    const [statusFilter, setStatusFilter] =
        useState("All");


    // ============================================================
    // Last Updated
    // ============================================================

    const [lastUpdated, setLastUpdated] =
        useState("");


    // ============================================================
    // Load Train Status + Location
    // ============================================================

    async function loadTrains() {

        try {

            setLoading(true);

            setLocationLoading(true);

            setError("");


            const [
                trainResponse,
                locationResponse,
            ] = await Promise.all([

                trainService.getAllTrains(),

                trainLocationService
                    .getTrainLocations(),

            ]);


            // =====================================================
            // TRAIN STATUS RESPONSE
            // =====================================================

            console.log(
                "========== TRAIN STATUS RESPONSE =========="
            );

            console.log(trainResponse);


            let trainData = [];


            if (Array.isArray(trainResponse)) {

                trainData = trainResponse;

            }

            else if (
                Array.isArray(
                    trainResponse?.data
                )
            ) {

                trainData =
                    trainResponse.data;

            }

            else if (
                Array.isArray(
                    trainResponse?.trains
                )
            ) {

                trainData =
                    trainResponse.trains;

            }


            // =====================================================
            // TRAIN LOCATION RESPONSE
            // =====================================================

            console.log(
                "========== TRAIN LOCATION RESPONSE =========="
            );

            console.log(locationResponse);


            let locationData = [];


            if (
                Array.isArray(
                    locationResponse
                )
            ) {

                locationData =
                    locationResponse;

            }

            else if (
                Array.isArray(
                    locationResponse?.data
                        ?.trains
                )
            ) {

                locationData =
                    locationResponse.data.trains;

            }

            else if (
                Array.isArray(
                    locationResponse?.trains
                )
            ) {

                locationData =
                    locationResponse.trains;

            }


            // =====================================================
            // Processed Data
            // =====================================================

            console.log(
                "========== PROCESSED DATA =========="
            );

            console.log(
                "Train Data:",
                trainData
            );

            console.log(
                "Train Count:",
                trainData.length
            );

            console.log(
                "Location Data:",
                locationData
            );

            console.log(
                "Location Count:",
                locationData.length
            );


            setTrains(trainData);

            setTrainLocations(locationData);


            setLastUpdated(
                new Date().toLocaleTimeString()
            );


        }

        catch (err) {

            console.error(
                "Failed to load train information:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );


            setError(
                "Unable to load train status or train location data."
            );

        }

        finally {

            setLoading(false);

            setLocationLoading(false);

        }

    }


    // ============================================================
    // Initial Load + Auto Refresh
    // ============================================================

    useEffect(() => {

        loadTrains();


        const interval = setInterval(() => {

            loadTrains();

        }, 30000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    // ============================================================
    // Safe Train Search
    // ============================================================

    const filtered = trains.filter(
        (train) => {

            const trainNumber =
                String(
                    train.train_number || ""
                ).toLowerCase();


            const trainName =
                String(
                    train.train_name || ""
                ).toLowerCase();


            const currentStation =
                String(
                    train.current_station || ""
                ).toLowerCase();


            const searchValue =
                search.toLowerCase();


            const searchMatch =
                trainNumber.includes(
                    searchValue
                ) ||
                trainName.includes(
                    searchValue
                ) ||
                currentStation.includes(
                    searchValue
                );


            const lineMatch =
                lineFilter === "All" ||
                train.line === lineFilter;


            // IMPORTANT:
            // Database uses:
            // ACTIVE
            // MAINTENANCE
            // OUT_OF_SERVICE

            const trainStatus =
                String(
                    train.status || ""
                ).toUpperCase();


            const statusMatch =
                statusFilter === "All" ||
                trainStatus === statusFilter;


            return (
                searchMatch &&
                lineMatch &&
                statusMatch
            );

        }
    );


    // ============================================================
    // Statistics
    // ============================================================

    const active =
        trains.filter(
            (train) =>
                String(
                    train.status || ""
                ).toUpperCase() === "ACTIVE"
        ).length;


    const maintenance =
        trains.filter(
            (train) =>
                String(
                    train.status || ""
                ).toUpperCase() ===
                "MAINTENANCE"
        ).length;


    const outOfService =
        trains.filter(
            (train) =>
                String(
                    train.status || ""
                ).toUpperCase() ===
                "OUT_OF_SERVICE"
        ).length;


    // ============================================================
    // Lines
    // ============================================================

    const lines = [

        "All",

        ...new Set(

            trains
                .map(
                    (train) =>
                        train.line
                )
                .filter(Boolean)

        ),

    ];


    // ============================================================
    // Location Lookup
    // ============================================================

    const getLocationForTrain =
        (train) => {

            return trainLocations.find(
                (location) => {

                    const locationTrainId =
                        String(
                            location.train_id ||
                            ""
                        ).toLowerCase();


                    const trainNumber =
                        String(
                            train.train_number ||
                            ""
                        ).toLowerCase();


                    const trainId =
                        String(
                            train.train_id ||
                            ""
                        ).toLowerCase();


                    return (

                        locationTrainId ===
                        trainNumber

                    ) || (

                        locationTrainId ===
                        trainId

                    );

                }
            );

        };


    // ============================================================
    // Location Status Styling
    // ============================================================

    const getLocationStatusStyle =
        (status) => {

            switch (status) {

                case "Running":

                    return {

                        text:
                            "text-green-400",

                        bg:
                            "bg-green-500/10",

                        border:
                            "border-green-500/30",

                    };


                case "At Station":

                    return {

                        text:
                            "text-yellow-400",

                        bg:
                            "bg-yellow-500/10",

                        border:
                            "border-yellow-500/30",

                    };


                case "Completed":

                    return {

                        text:
                            "text-slate-400",

                        bg:
                            "bg-slate-500/10",

                        border:
                            "border-slate-500/30",

                    };


                case "Not Started":

                    return {

                        text:
                            "text-blue-400",

                        bg:
                            "bg-blue-500/10",

                        border:
                            "border-blue-500/30",

                    };


                default:

                    return {

                        text:
                            "text-slate-300",

                        bg:
                            "bg-slate-700/30",

                        border:
                            "border-slate-600",

                    };

            }

        };


    // ============================================================
    // Render
    // ============================================================

    return (

        <div className="space-y-8">


            {/* ====================================================
               Header
            ==================================================== */}

            <div>

                <h1 className="text-4xl font-bold text-white">

                    🚆 Train Status

                </h1>


                <p className="text-slate-400 mt-2">

                    Train monitoring dashboard

                </p>


                <div className="flex items-center gap-3 mt-2">

                    <div
                        className="
                            w-2.5
                            h-2.5
                            rounded-full
                            bg-green-500
                            animate-pulse
                        "
                    />


                    <p className="text-slate-500 text-sm">

                        Last Updated:

                        <span className="text-slate-300 ml-1">

                            {lastUpdated ||
                                "Loading..."}

                        </span>

                    </p>

                </div>

            </div>


            {/* ====================================================
               Error
            ==================================================== */}

            {error && (

                <div
                    className="
                        bg-red-500/10
                        border
                        border-red-500/30
                        rounded-xl
                        p-4
                    "
                >

                    <p className="text-red-400 font-medium">

                        ⚠️ {error}

                    </p>

                </div>

            )}


            {/* ====================================================
               Summary Cards
            ==================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                "
            >

                <StatsCard
                    title="Total Trains"
                    value={trains.length}
                    color="cyan"
                />


                <StatsCard
                    title="Active"
                    value={active}
                    color="green"
                />


                <StatsCard
                    title="Maintenance"
                    value={maintenance}
                    color="yellow"
                />


                <StatsCard
                    title="Out of Service"
                    value={outOfService}
                    color="red"
                />

            </div>


            {/* ====================================================
               Operational Status
            ==================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-5
                "
            >


                {/* Active */}

                <div
                    className="
                        bg-green-500/10
                        border
                        border-green-500/30
                        rounded-xl
                        p-5
                    "
                >

                    <h3 className="text-green-400 font-bold text-lg">

                        🟢 Active

                    </h3>


                    <p className="text-3xl font-bold text-white mt-2">

                        {active}

                    </p>


                    <p className="text-slate-300 mt-2">

                        Trains currently available
                        for operation.

                    </p>

                </div>


                {/* Maintenance */}

                <div
                    className="
                        bg-yellow-500/10
                        border
                        border-yellow-500/30
                        rounded-xl
                        p-5
                    "
                >

                    <h3 className="text-yellow-400 font-bold text-lg">

                        🟡 Maintenance

                    </h3>


                    <p className="text-3xl font-bold text-white mt-2">

                        {maintenance}

                    </p>


                    <p className="text-slate-300 mt-2">

                        Trains currently under
                        maintenance.

                    </p>

                </div>


                {/* Out of Service */}

                <div
                    className="
                        bg-red-500/10
                        border
                        border-red-500/30
                        rounded-xl
                        p-5
                    "
                >

                    <h3 className="text-red-400 font-bold text-lg">

                        🔴 Out of Service

                    </h3>


                    <p className="text-3xl font-bold text-white mt-2">

                        {outOfService}

                    </p>


                    <p className="text-slate-300 mt-2">

                        Trains unavailable for
                        operation.

                    </p>

                </div>

            </div>


            {/* ====================================================
               Search
            ==================================================== */}

            <div className="flex flex-col md:flex-row gap-4">


                <div className="relative flex-1">

                    <Search
                        className="
                            absolute
                            left-3
                            top-3
                            text-slate-400
                        "
                        size={18}
                    />


                    <input
                        placeholder="Search train..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            pl-10
                            pr-4
                            py-3
                            rounded-xl
                            bg-slate-800
                            text-white
                            border
                            border-slate-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/40
                        "
                    />

                </div>


                <button
                    onClick={loadTrains}
                    disabled={loading}
                    className="
                        bg-cyan-600
                        hover:bg-cyan-500
                        disabled:opacity-50
                        rounded-xl
                        px-5
                        py-3
                        flex
                        items-center
                        justify-center
                        transition-colors
                    "
                >

                    <RefreshCw
                        className={
                            loading
                                ? "text-white animate-spin"
                                : "text-white"
                        }
                    />

                </button>

            </div>


            {/* ====================================================
               Filters
            ==================================================== */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-4
                "
            >


                {/* Line Filter */}

                <select
                    value={lineFilter}
                    onChange={(e) =>
                        setLineFilter(
                            e.target.value
                        )
                    }
                    className="
                        bg-slate-800
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        border
                        border-slate-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-cyan-500/40
                    "
                >

                    {lines.map(
                        (line) => (

                            <option
                                key={line}
                                value={line}
                            >
                                {line}
                            </option>

                        )
                    )}

                </select>


                {/* Status Filter */}

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    className="
                        bg-slate-800
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        border
                        border-slate-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-cyan-500/40
                    "
                >

                    <option value="All">
                        All Statuses
                    </option>

                    <option value="ACTIVE">
                        Active
                    </option>

                    <option value="MAINTENANCE">
                        Maintenance
                    </option>

                    <option value="OUT_OF_SERVICE">
                        Out of Service
                    </option>

                </select>

            </div>


            {/* ====================================================
               Train Cards
            ==================================================== */}

            {loading ? (

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        py-20
                    "
                >

                    <div className="text-center">

                        <RefreshCw
                            className="
                                w-10
                                h-10
                                text-cyan-400
                                animate-spin
                                mx-auto
                                mb-4
                            "
                        />

                        <h2 className="text-white text-lg">

                            Loading train information...

                        </h2>

                    </div>

                </div>

            ) : filtered.length === 0 ? (

                <div
                    className="
                        bg-slate-800
                        rounded-2xl
                        border
                        border-slate-700
                        p-10
                        text-center
                    "
                >

                    <TrainIcon />

                    <h2
                        className="
                            text-white
                            text-xl
                            font-semibold
                            mt-4
                        "
                    >
                        No trains found
                    </h2>


                    <p className="text-slate-400 mt-2">

                        Try changing your search
                        or filters.

                    </p>

                </div>

            ) : (

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-6
                    "
                >

                    {filtered.map(
                        (train, index) => (

                            <TrainCard
                                key={
                                    `${
                                        train.train_number ||
                                        train.train_id
                                    }-${index}`
                                }
                                train={train}
                            />

                        )
                    )}

                </div>

            )}


            {/* ====================================================
               Current Train Locations
            ==================================================== */}

            <div className="pt-4">


                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-3
                        mb-5
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-white
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <MapPin
                                className="
                                    w-6
                                    h-6
                                    text-cyan-400
                                "
                            />

                            Current Train Locations

                        </h2>


                        <p className="text-slate-400 mt-1">

                            Estimated train positions
                            based on schedules and
                            station GPS.

                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                        "
                    >

                        <Radio
                            className="
                                w-4
                                h-4
                                text-green-400
                                animate-pulse
                            "
                        />

                        <span className="text-green-400">

                            Location Tracking

                        </span>

                        <span className="text-slate-500">

                            • {trainLocations.length}
                            {" "}trains

                        </span>

                    </div>

                </div>


                {/* Location Loading */}

                {locationLoading ? (

                    <div
                        className="
                            bg-slate-800
                            rounded-2xl
                            border
                            border-slate-700
                            p-10
                            text-center
                        "
                    >

                        <RefreshCw
                            className="
                                w-8
                                h-8
                                text-cyan-400
                                animate-spin
                                mx-auto
                                mb-3
                            "
                        />

                        <p className="text-slate-400">

                            Loading train locations...

                        </p>

                    </div>

                ) : trainLocations.length === 0 ? (

                    <div
                        className="
                            bg-slate-800
                            rounded-2xl
                            border
                            border-slate-700
                            p-10
                            text-center
                        "
                    >

                        <MapPin
                            className="
                                w-10
                                h-10
                                text-slate-600
                                mx-auto
                                mb-3
                            "
                        />

                        <p className="text-slate-400">

                            No train location data
                            available.

                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-6
                        "
                    >

                        {trainLocations.map(
                            (location, index) => {

                                const style =
                                    getLocationStatusStyle(
                                        location.status
                                    );


                                return (

                                    <div
                                        key={
                                            `${location.train_id}-${index}`
                                        }
                                        className="
                                            bg-slate-800/70
                                            border
                                            border-slate-700
                                            rounded-2xl
                                            p-6
                                            shadow-xl
                                            hover:border-slate-600
                                            transition-all
                                        "
                                    >

                                        {/* Header */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                mb-5
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        p-2.5
                                                        bg-cyan-500/10
                                                        rounded-xl
                                                    "
                                                >

                                                    <Navigation
                                                        className="
                                                            w-5
                                                            h-5
                                                            text-cyan-400
                                                        "
                                                    />

                                                </div>


                                                <div>

                                                    <h3 className="text-white font-bold">

                                                        {location.train_id}

                                                    </h3>


                                                    <p className="text-slate-500 text-sm">

                                                        {
                                                            location.line ||
                                                            "Line unavailable"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            <span
                                                className={`
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    border
                                                    text-xs
                                                    font-semibold
                                                    ${style.text}
                                                    ${style.bg}
                                                    ${style.border}
                                                `}
                                            >

                                                {location.status}

                                            </span>

                                        </div>


                                        {/* Location Details */}

                                        <div className="space-y-4">


                                            {/* Current Station */}

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >

                                                <MapPin
                                                    className="
                                                        w-5
                                                        h-5
                                                        text-cyan-400
                                                        mt-0.5
                                                        shrink-0
                                                    "
                                                />

                                                <div>

                                                    <p
                                                        className="
                                                            text-slate-500
                                                            text-xs
                                                            uppercase
                                                            tracking-wide
                                                        "
                                                    >
                                                        Current Location
                                                    </p>


                                                    <p
                                                        className="
                                                            text-white
                                                            font-semibold
                                                            mt-1
                                                        "
                                                    >

                                                        {
                                                            location.current_station ||
                                                            "Unknown"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Next Station */}

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >

                                                <Navigation
                                                    className="
                                                        w-5
                                                        h-5
                                                        text-purple-400
                                                        mt-0.5
                                                        shrink-0
                                                    "
                                                />


                                                <div>

                                                    <p
                                                        className="
                                                            text-slate-500
                                                            text-xs
                                                            uppercase
                                                            tracking-wide
                                                        "
                                                    >
                                                        Next Station
                                                    </p>


                                                    <p
                                                        className="
                                                            text-white
                                                            font-semibold
                                                            mt-1
                                                        "
                                                    >

                                                        {
                                                            location.next_station ||
                                                            "—"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Speed + Sensor */}

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-2
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        bg-slate-900/60
                                                        rounded-xl
                                                        p-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            mb-2
                                                        "
                                                    >

                                                        <Gauge
                                                            className="
                                                                w-4
                                                                h-4
                                                                text-green-400
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                text-slate-500
                                                                text-xs
                                                            "
                                                        >
                                                            Est. Speed
                                                        </span>

                                                    </div>


                                                    <p className="text-white font-bold">

                                                        {
                                                            location.speed_kmh != null
                                                                ? `${location.speed_kmh} km/h`
                                                                : "N/A"
                                                        }

                                                    </p>

                                                </div>


                                                <div
                                                    className="
                                                        bg-slate-900/60
                                                        rounded-xl
                                                        p-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            mb-2
                                                        "
                                                    >

                                                        <Radio
                                                            className="
                                                                w-4
                                                                h-4
                                                                text-blue-400
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                text-slate-500
                                                                text-xs
                                                            "
                                                        >
                                                            Sensor
                                                        </span>

                                                    </div>


                                                    <p
                                                        className={`
                                                            font-bold
                                                            ${
                                                                location.sensor_available
                                                                    ? "text-green-400"
                                                                    : "text-slate-500"
                                                            }
                                                        `}
                                                    >

                                                        {
                                                            location.sensor_available
                                                                ? "Available"
                                                                : "Unavailable"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Coordinates */}

                                            <div
                                                className="
                                                    bg-slate-900/60
                                                    rounded-xl
                                                    p-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        mb-2
                                                    "
                                                >

                                                    <MapPin
                                                        className="
                                                            w-4
                                                            h-4
                                                            text-cyan-400
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            text-slate-500
                                                            text-xs
                                                            uppercase
                                                            tracking-wide
                                                        "
                                                    >
                                                        Coordinates
                                                    </span>

                                                </div>


                                                <p
                                                    className="
                                                        text-white
                                                        font-mono
                                                        text-sm
                                                    "
                                                >

                                                    {
                                                        location.latitude != null
                                                            ? Number(
                                                                location.latitude
                                                            ).toFixed(6)
                                                            : "N/A"
                                                    }

                                                    {" , "}

                                                    {
                                                        location.longitude != null
                                                            ? Number(
                                                                location.longitude
                                                            ).toFixed(6)
                                                            : "N/A"
                                                    }

                                                </p>

                                            </div>


                                            {/* Platform Crowd */}

                                            {location.platform_crowd != null && (

                                                <div
                                                    className="
                                                        bg-slate-900/60
                                                        rounded-xl
                                                        p-4
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-slate-500
                                                            text-xs
                                                            uppercase
                                                            tracking-wide
                                                        "
                                                    >
                                                        Platform Crowd
                                                    </p>


                                                    <p
                                                        className="
                                                            text-white
                                                            font-bold
                                                            text-lg
                                                            mt-1
                                                        "
                                                    >

                                                        {
                                                            location.platform_crowd
                                                        }

                                                    </p>

                                                </div>

                                            )}


                                            {/* Location Source */}

                                            <div
                                                className="
                                                    border-t
                                                    border-slate-700
                                                    pt-4
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-slate-500
                                                        text-xs
                                                    "
                                                >
                                                    Location Source
                                                </p>


                                                <p
                                                    className="
                                                        text-slate-300
                                                        text-sm
                                                        mt-1
                                                    "
                                                >

                                                    {
                                                        location.location_source ||
                                                        "Unknown"
                                                    }

                                                </p>

                                            </div>


                                            {/* Timestamp */}

                                            {location.timestamp && (

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-slate-500
                                                        text-xs
                                                    "
                                                >

                                                    <Clock
                                                        className="
                                                            w-3.5
                                                            h-3.5
                                                        "
                                                    />

                                                    <span>
                                                        Sensor update:
                                                    </span>


                                                    <span
                                                        className="
                                                            text-slate-400
                                                        "
                                                    >

                                                        {
                                                            location.timestamp
                                                        }

                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


// ================================================================
// Empty Train Icon
// ================================================================

function TrainIcon() {

    return (

        <div className="flex justify-center">

            <div
                className="
                    w-14
                    h-14
                    rounded-full
                    bg-slate-700/50
                    flex
                    items-center
                    justify-center
                "
            >

                <Navigation
                    className="
                        w-7
                        h-7
                        text-slate-500
                    "
                />

            </div>

        </div>

    );

}