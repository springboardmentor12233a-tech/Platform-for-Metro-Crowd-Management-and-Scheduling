import { useState } from "react";
import { predictDelay } from "../services/predictionService";

import {
    MapPin,
    Train,
    CloudRain,
    Clock,
    Gauge,
    Calendar,
    Users,
    Navigation,
    Thermometer,
    Wind,
    Droplets,
    Activity,
    Info,
} from "lucide-react";

/* ============================================================
   Reusable Input Field
   ============================================================ */

const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    icon: Icon,
    min,
    max,
    step,
    placeholder,
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-slate-500" />}
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-600"
        />
    </div>
);

/* ============================================================
   Reusable Select Field
   ============================================================ */

const SelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    icon: Icon,
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-slate-500" />}
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-600 appearance-none"
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

/* ============================================================
   Section Card
   ============================================================ */

const SectionCard = ({
    title,
    icon: Icon,
    children,
}) => (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all hover:bg-slate-800/80">

        <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">

            <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-blue-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-100 tracking-wide">
                {title}
            </h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {children}
        </div>

    </div>
);

/* ============================================================
   Main Delay Prediction Page
   ============================================================ */

export default function DelayPrediction() {

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    /* ========================================================
       Form Data
       Matches DelayPredictionRequest backend schema
       ======================================================== */

       const [formData, setFormData] = useState({
        /* Train / Journey */
        train_id: "TR001",
        origin_station: "Station_15",
        destination_station: "Station_20",
        transport_type: "Metro",
        route_id: "Route_4",
    
        scheduled_departure_min: 540,
        scheduled_arrival_min: 585,
    
        /* These are derived automatically */
        travel_duration: 45,
        departure_hour: 9,
    
        /* Weather */
        weather_condition: "Rain",
        temperature_c: 28,
        humidity_percent: 80,
        wind_speed_kmh: 15,
        precipitation_mm: 8,
    
        /* Weather derived features */
        weather_severity: 0,
        is_extreme_weather: 0,
    
        /* Events */
        event_type: "Festival",
        event_attendance_est: 5000,
        event_severity: 0,
        event_impact: 0,
    
        /* Traffic */
        traffic_congestion_index: 75,
        traffic_severity: 0,
        traffic_weather_score: 0,
    
        /* Time derived feature */
        rush_hour_score: 0,
    
        /* Calendar */
        holiday: 0,
        peak_hour: 1,
        weekday: 1,
        season: "Summer",
        month: 8,
        day_of_week: 2,
        is_weekend: 0,
    });

    /* ========================================================
       Handle Input Change
       ======================================================== */

       const handleInputChange = (event) => {
        const { name, value, type } = event.target;
    
        const newValue =
            type === "number"
                ? Number(value)
                : value;
    
        setFormData((previous) => {
    
            const updated = {
                ...previous,
                [name]: newValue,
            };
    
            /*
             * Calculate travel duration
             */
            if (
                name === "scheduled_departure_min" ||
                name === "scheduled_arrival_min"
            ) {
                const departure =
                    name === "scheduled_departure_min"
                        ? newValue
                        : previous.scheduled_departure_min;
    
                const arrival =
                    name === "scheduled_arrival_min"
                        ? newValue
                        : previous.scheduled_arrival_min;
    
                updated.travel_duration =
                    Math.max(0, arrival - departure);
            }
    
            /*
             * Calculate departure hour
             */
            if (name === "scheduled_departure_min") {
                updated.departure_hour =
                    Math.floor(newValue / 60);
            }
    
            /*
             * Day of week automatically controls
             * weekday/weekend
             */
            if (name === "day_of_week") {
                updated.weekday = newValue;
    
                updated.is_weekend =
                    newValue === 5 || newValue === 6
                        ? 1
                        : 0;
            }
    
            /*
             * Clear previous error
             */
            if (error) {
                setError("");
            }
    
            return updated;
        });
    };
    /* ========================================================
       Validation
       ======================================================== */

    const validateForm = () => {

        if (!formData.train_id.trim()) {
            return "Please enter a Train ID.";
        }

        if (!formData.origin_station.trim()) {
            return "Please enter the origin station.";
        }

        if (!formData.destination_station.trim()) {
            return "Please enter the destination station.";
        }

        if (!formData.route_id.trim()) {
            return "Please enter the Route ID.";
        }

        if (
            formData.scheduled_arrival_min <=
            formData.scheduled_departure_min
        ) {
            return "Arrival time must be greater than departure time.";
        }

        if (
            formData.temperature_c < -50 ||
            formData.temperature_c > 60
        ) {
            return "Please enter a valid temperature.";
        }

        if (
            formData.humidity_percent < 0 ||
            formData.humidity_percent > 100
        ) {
            return "Humidity must be between 0 and 100%.";
        }

        if (formData.wind_speed_kmh < 0) {
            return "Wind speed cannot be negative.";
        }

        if (formData.precipitation_mm < 0) {
            return "Precipitation cannot be negative.";
        }

        if (formData.event_attendance_est < 0) {
            return "Event attendance cannot be negative.";
        }

        if (
            formData.traffic_congestion_index < 0 ||
            formData.traffic_congestion_index > 100
        ) {
            return "Traffic congestion index must be between 0 and 100.";
        }

        if (
            formData.month < 1 ||
            formData.month > 12
        ) {
            return "Month must be between 1 and 12.";
        }

        if (
            formData.day_of_week < 0 ||
            formData.day_of_week > 6
        ) {
            return "Day of week must be between 0 and 6.";
        }

        return "";
    };

    /* ========================================================
       Predict Delay
       ======================================================== */

       const handlePredict = async () => {
        setError("");
        setResult(null);
    
        const validationError = validateForm();
    
        if (validationError) {
            setError(validationError);
            return;
        }
    
        setLoading(true);
    
        try {
            const departure =
                Number(formData.scheduled_departure_min);
    
            const arrival =
                Number(formData.scheduled_arrival_min);
    
            const departureHour =
                Math.floor(departure / 60);
    
            const travelDuration =
                arrival - departure;
    
            const calculatedPeakHour =
                (
                    departureHour >= 7 &&
                    departureHour <= 10
                ) ||
                (
                    departureHour >= 17 &&
                    departureHour <= 20
                )
                    ? 1
                    : 0;
    
            const calculatedWeekend =
                (
                    Number(formData.day_of_week) === 5 ||
                    Number(formData.day_of_week) === 6
                )
                    ? 1
                    : 0;
    
            const payload = {
    
                transport_type:
                    formData.transport_type,
    
                route_id:
                    formData.route_id,
    
                origin_station:
                    formData.origin_station,
    
                destination_station:
                    formData.destination_station,
    
                scheduled_departure_min:
                    departure,
    
                scheduled_arrival_min:
                    arrival,
    
                travel_duration:
                    travelDuration,
    
                departure_hour:
                    departureHour,
    
                weather_condition:
                    formData.weather_condition,
    
                temperature_c:
                    Number(formData.temperature_c),
    
                humidity_percent:
                    Number(formData.humidity_percent),
    
                wind_speed_kmh:
                    Number(formData.wind_speed_kmh),
    
                precipitation_mm:
                    Number(formData.precipitation_mm),
    
                weather_severity:
                    Number(formData.weather_severity),
    
                event_type:
                    formData.event_type,
    
                event_attendance_est:
                    Number(formData.event_attendance_est),
    
                event_severity:
                    Number(formData.event_severity),
    
                event_impact:
                    Number(formData.event_impact),
    
                traffic_congestion_index:
                    Number(formData.traffic_congestion_index),
    
                traffic_severity:
                    Number(formData.traffic_severity),
    
                traffic_weather_score:
                    Number(formData.traffic_weather_score),
    
                rush_hour_score:
                    Number(formData.rush_hour_score),
    
                holiday:
                    Number(formData.holiday),
    
                peak_hour:
                    calculatedPeakHour,
    
                weekday:
                    Number(formData.day_of_week),
    
                season:
                    formData.season,
    
                month:
                    Number(formData.month),
    
                day_of_week:
                    Number(formData.day_of_week),
    
                is_weekend:
                    calculatedWeekend,
    
                is_extreme_weather:
                    Number(formData.is_extreme_weather),
            };
    
            console.log(
                "Sending delay prediction request:",
                payload
            );
    
            const prediction =
                await predictDelay(payload);
    
            console.log(
                "Delay prediction response:",
                prediction
            );
    
            setResult(prediction);
    
        } catch (err) {
    
            console.error(
                "Delay prediction failed:",
                err
            );
    
            const backendError =
                err.response?.data?.detail;
    
            if (typeof backendError === "string") {
    
                setError(backendError);
    
            } else if (Array.isArray(backendError)) {
    
                setError(
                    backendError
                        .map((item) => item.msg)
                        .join(", ")
                );
    
            } else {
    
                setError(
                    "Unable to predict train delay. Please check the backend server and try again."
                );
            }
    
        } finally {
    
            setLoading(false);
        }
    };

    /* ========================================================
       Delay Level Styling
       ======================================================== */

    const getDelayStyle = (level) => {

        switch (level) {

            case "On Time":

                return {
                    text:
                        "text-emerald-400",

                    bg:
                        "bg-emerald-500/10",

                    border:
                        "border-emerald-500/30",

                    badge:
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",

                    icon:
                        "🟢",
                };

            case "Minor Delay":

                return {
                    text:
                        "text-yellow-400",

                    bg:
                        "bg-yellow-500/10",

                    border:
                        "border-yellow-500/30",

                    badge:
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",

                    icon:
                        "🟡",
                };

            case "Moderate Delay":

                return {
                    text:
                        "text-orange-400",

                    bg:
                        "bg-orange-500/10",

                    border:
                        "border-orange-500/30",

                    badge:
                        "bg-orange-500/10 text-orange-400 border-orange-500/30",

                    icon:
                        "🟠",
                };

            case "Major Delay":

                return {
                    text:
                        "text-red-400",

                    bg:
                        "bg-red-500/10",

                    border:
                        "border-red-500/30",

                    badge:
                        "bg-red-500/10 text-red-400 border-red-500/30",

                    icon:
                        "🔴",
                };

            default:

                return {
                    text:
                        "text-blue-400",

                    bg:
                        "bg-blue-500/10",

                    border:
                        "border-blue-500/30",

                    badge:
                        "bg-blue-500/10 text-blue-400 border-blue-500/30",

                    icon:
                        "ℹ️",
                };
        }
    };

    /* ========================================================
       Render
       ======================================================== */

    return (

        <div className="w-full text-slate-200 p-6 md:p-10 font-sans selection:bg-blue-500/30">

            <div className="max-w-7xl mx-auto space-y-8">

                {/* ==================================================
                   Header
                   ================================================== */}

                <div className="space-y-2">

                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">

                        <Activity className="w-8 h-8 text-blue-500" />

                        Delay Prediction

                    </h1>

                    <p className="text-slate-400 text-lg">

                        Predict train delays using XGBoost and operational conditions.

                    </p>

                </div>


                {/* ==================================================
                   Error Message
                   ================================================== */}

                {error && (

                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">

                        <div className="flex items-start gap-3">

                            <div className="text-red-400 text-xl">
                                ⚠️
                            </div>

                            <div>

                                <p className="font-semibold text-red-400">
                                    Prediction Error
                                </p>

                                <p className="text-red-300/80 mt-1">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* ==================================================
                   Forms
                   ================================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                    {/* ==================================================
                       Journey Information
                       ================================================== */}

                    <SectionCard
                        title="Journey Information"
                        icon={Navigation}
                    >

                        <InputField
                            label="Train ID"
                            name="train_id"
                            value={formData.train_id}
                            onChange={handleInputChange}
                            icon={Train}
                            placeholder="e.g. TR001"
                        />

                        <InputField
                            label="Origin Station"
                            name="origin_station"
                            value={formData.origin_station}
                            onChange={handleInputChange}
                            icon={MapPin}
                            placeholder="e.g. Station_15"
                        />

                        <InputField
                            label="Destination Station"
                            name="destination_station"
                            value={formData.destination_station}
                            onChange={handleInputChange}
                            icon={MapPin}
                            placeholder="e.g. Station_20"
                        />

                        <InputField
                            label="Transport Type"
                            name="transport_type"
                            value={formData.transport_type}
                            onChange={handleInputChange}
                            icon={Train}
                            placeholder="e.g. Metro"
                        />

                        <InputField
                            label="Route ID"
                            name="route_id"
                            value={formData.route_id}
                            onChange={handleInputChange}
                            icon={Navigation}
                            placeholder="e.g. Route_4"
                        />

                        <InputField
                            label="Departure Time (min)"
                            name="scheduled_departure_min"
                            type="number"
                            value={formData.scheduled_departure_min}
                            onChange={handleInputChange}
                            icon={Clock}
                            min={0}
                        />

                        <InputField
                            label="Arrival Time (min)"
                            name="scheduled_arrival_min"
                            type="number"
                            value={formData.scheduled_arrival_min}
                            onChange={handleInputChange}
                            icon={Clock}
                            min={0}
                        />

                    </SectionCard>


                    {/* ==================================================
                       Weather Information
                       ================================================== */}

                    <SectionCard
                        title="Weather Information"
                        icon={CloudRain}
                    >

                        <SelectField
                            label="Weather Condition"
                            name="weather_condition"
                            value={formData.weather_condition}
                            onChange={handleInputChange}
                            icon={CloudRain}
                            options={[
                                {
                                    label: "Clear",
                                    value: "Clear",
                                },
                                {
                                    label: "Rain",
                                    value: "Rain",
                                },
                                {
                                    label: "Cloudy",
                                    value: "Cloudy",
                                },
                                {
                                    label: "Snow",
                                    value: "Snow",
                                },
                                {
                                    label: "Storm",
                                    value: "Storm",
                                },
                            ]}
                        />

                        <InputField
                            label="Temperature (°C)"
                            name="temperature_c"
                            type="number"
                            value={formData.temperature_c}
                            onChange={handleInputChange}
                            icon={Thermometer}
                            step="0.1"
                        />

                        <InputField
                            label="Humidity (%)"
                            name="humidity_percent"
                            type="number"
                            value={formData.humidity_percent}
                            onChange={handleInputChange}
                            icon={Droplets}
                            min={0}
                            max={100}
                            step="0.1"
                        />

                        <InputField
                            label="Wind Speed (km/h)"
                            name="wind_speed_kmh"
                            type="number"
                            value={formData.wind_speed_kmh}
                            onChange={handleInputChange}
                            icon={Wind}
                            min={0}
                            step="0.1"
                        />

                        <InputField
                            label="Precipitation (mm)"
                            name="precipitation_mm"
                            type="number"
                            value={formData.precipitation_mm}
                            onChange={handleInputChange}
                            icon={CloudRain}
                            min={0}
                            step="0.1"
                        />

                    </SectionCard>


                    {/* ==================================================
                       Schedule & Events
                       ================================================== */}

                    <div className="lg:col-span-2">

                        <SectionCard
                            title="Schedule & Events"
                            icon={Calendar}
                        >

                            <InputField
                                label="Event Type"
                                name="event_type"
                                value={formData.event_type}
                                onChange={handleInputChange}
                                icon={Users}
                                placeholder="e.g. Festival"
                            />

                            <InputField
                                label="Expected Attendance"
                                name="event_attendance_est"
                                type="number"
                                value={formData.event_attendance_est}
                                onChange={handleInputChange}
                                icon={Users}
                                min={0}
                            />

                            <InputField
                                label="Traffic Congestion Index"
                                name="traffic_congestion_index"
                                type="number"
                                value={formData.traffic_congestion_index}
                                onChange={handleInputChange}
                                icon={Gauge}
                                min={0}
                                max={100}
                                step="0.1"
                            />

                         

                            <SelectField
                                label="Holiday"
                                name="holiday"
                                value={formData.holiday}
                                onChange={handleInputChange}
                                icon={Calendar}
                                options={[
                                    {
                                        label: "Yes",
                                        value: 1,
                                    },
                                    {
                                        label: "No",
                                        value: 0,
                                    },
                                ]}
                            />

<SelectField
    label="Day of Week"
    name="day_of_week"
    value={formData.day_of_week}
    onChange={handleInputChange}
    icon={Calendar}
    options={[
        { label: "Monday", value: 0 },
        { label: "Tuesday", value: 1 },
        { label: "Wednesday", value: 2 },
        { label: "Thursday", value: 3 },
        { label: "Friday", value: 4 },
        { label: "Saturday", value: 5 },
        { label: "Sunday", value: 6 },
    ]}
/>

                            <SelectField
                                label="Season"
                                name="season"
                                value={formData.season}
                                onChange={handleInputChange}
                                icon={Calendar}
                                options={[
                                    {
                                        label: "Spring",
                                        value: "Spring",
                                    },
                                    {
                                        label: "Summer",
                                        value: "Summer",
                                    },
                                    {
                                        label: "Autumn",
                                        value: "Autumn",
                                    },
                                    {
                                        label: "Winter",
                                        value: "Winter",
                                    },
                                ]}
                            />

                            <InputField
                                label="Month"
                                name="month"
                                type="number"
                                value={formData.month}
                                onChange={handleInputChange}
                                icon={Calendar}
                                min={1}
                                max={12}
                            />

                           
                            <SelectField
                                label="Weekend"
                                name="is_weekend"
                                value={formData.is_weekend}
                                onChange={handleInputChange}
                                icon={Calendar}
                                options={[
                                    {
                                        label: "Yes",
                                        value: 1,
                                    },
                                    {
                                        label: "No",
                                        value: 0,
                                    },
                                ]}
                            />

                        </SectionCard>

                    </div>

                </div>


                {/* ==================================================
                   Predict Button
                   ================================================== */}

                <div className="flex justify-center pt-4">

                    <button
                        onClick={handlePredict}
                        disabled={loading}
                        className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full md:w-auto min-w-[240px]"
                    >

                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                        <span className="relative flex items-center justify-center gap-2">

                            {loading ? (
                                <>
                                    <Activity className="w-6 h-6 animate-spin" />

                                    Predicting...
                                </>
                            ) : (
                                <>
                                    <Gauge className="w-6 h-6" />

                                    Predict Delay
                                </>
                            )}

                        </span>

                    </button>

                </div>


                {/* ==================================================
                   Prediction Result
                   ================================================== */}

                {result != null && (

                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {(() => {

                            const style =
                                getDelayStyle(
                                    result.delay_level
                                );

                            return (

                                <div
                                    className={`rounded-2xl border p-8 shadow-2xl backdrop-blur-sm ${style.bg} ${style.border}`}
                                >

                                    {/* Result Header */}

                                    <div className="text-center mb-8">

                                        <h3 className="text-xl font-bold text-slate-300 uppercase tracking-widest">

                                            Prediction Result

                                        </h3>


                                        {/* Delay Number */}

                                        <div className="mt-5 flex items-baseline justify-center">

                                            <span
                                                className={`text-6xl font-black ${style.text}`}
                                            >
                                                {result.predicted_delay_minute}
                                            </span>

                                            <span className="text-xl text-slate-400 ml-3">
                                                minutes
                                            </span>

                                        </div>


                                        {/* Delay Level */}

                                        <div className="mt-5 flex justify-center">

                                            <span
                                                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold border ${style.badge}`}
                                            >

                                                <span>
                                                    {style.icon}
                                                </span>

                                                {result.delay_level}

                                            </span>

                                        </div>

                                    </div>


                                    {/* Result Details */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                        {/* Recommendation */}

                                        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">

                                            <div className="flex items-center gap-3 mb-3">

                                                <Gauge className="w-6 h-6 text-blue-400" />

                                                <span className="text-slate-400 font-medium">
                                                    Recommendation
                                                </span>

                                            </div>

                                            <p className="text-white text-xl font-semibold">
                                                {result.recommendation}
                                            </p>

                                        </div>


                                        {/* Reason */}

                                        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">

                                            <div className="flex items-center gap-3 mb-3">

                                                <Info className="w-6 h-6 text-blue-400" />

                                                <span className="text-slate-400 font-medium">
                                                    Reason
                                                </span>

                                            </div>

                                            <p className="text-slate-200 leading-relaxed">
                                                {result.reason}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Train ID */}

                                    <div className="mt-6 text-center text-slate-500">

                                    Route:
                                   <span className="text-slate-300 font-medium ml-2">
                                        {formData.route_id}
                                    </span>

                                    </div>

                                </div>

                            );

                        })()}

                    </div>

                )}

            </div>

        </div>

    );
}