// import { useState } from "react";
// import { predictDelay } from "../services/predictionService";

// export default function DelayPrediction() {

//     const [result, setResult] = useState(null);

//     const [loading, setLoading] = useState(false);

//     const [formData, setFormData] = useState({

//         transport_type: "Metro",
//         route_id: "Route_4",

//         origin_station: "Station_15",
//         destination_station: "Station_20",

//         weather_condition: "Rain",

//         temperature_c: 28,
//         humidity_percent: 80,
//         wind_speed_kmh: 15,
//         precipitation_mm: 8,

//         event_type: "Festival",
//         event_attendance_est: 5000,
//         event_attendance_est_outlier: 0,

//         traffic_congestion_index: 75,

//         holiday: 0,
//         peak_hour: 1,

//         season: "Summer",

//         scheduled_departure_min: 540,
//         scheduled_arrival_min: 585,

//         day_of_week: 2,
//         is_weekend: 0,

//         time_min: 540,
//     });

//     const handlePredict = async () => {

//         setLoading(true);

//         try {

//             const prediction = await predictDelay(formData);

//             setResult(prediction);

//         } catch (err) {

//             console.log(err);

//         }

//         setLoading(false);
//     };

//     return(

//         <div className="space-y-8">

//             <h1 className="text-3xl font-bold">
//                 Delay Prediction
//             </h1>

//         </div>

//     )

// }
// return(

//         <div className="space-y-8">

//             <h1 className="text-3xl font-bold">
//                 Delay Prediction
//             </h1>

//         </div>

//     )
import { useState } from "react";
import { predictDelay } from "../services/predictionService";
import { 
  MapPin, 
  Train, 
  CloudRain, 
  Clock, 
  AlertTriangle, 
  Gauge, 
  Calendar, 
  Users, 
  Navigation,
  Thermometer,
  Wind,
  Droplets,
  Activity,
  CheckCircle2,
  XCircle,
  Info
} from "lucide-react";

const InputField = ({ label, name, type = "text", value, onChange, icon: Icon }) => (
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
      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-600"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, icon: Icon }) => (
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
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all hover:bg-slate-800/80">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <h2 className="text-lg font-semibold text-slate-100 tracking-wide">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
  </div>
);

export default function DelayPrediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transport_type: "Metro",
    route_id: "Route_4",
    origin_station: "Station_15",
    destination_station: "Station_20",
    weather_condition: "Rain",
    temperature_c: 28,
    humidity_percent: 80,
    wind_speed_kmh: 15,
    precipitation_mm: 8,
    event_type: "Festival",
    event_attendance_est: 5000,
    event_attendance_est_outlier: 0,
    traffic_congestion_index: 75,
    holiday: 0,
    peak_hour: 1,
    season: "Summer",
    scheduled_departure_min: 540,
    scheduled_arrival_min: 585,
    day_of_week: 2,
    is_weekend: 0,
    time_min: 540,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const prediction = await predictDelay(formData);
      setResult(prediction);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getRiskDetails = (probability) => {
    if (probability < 40) {
      return { level: "Low Risk", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20", icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />, action: "No operational action required." };
    }
    if (probability < 70) {
      return { level: "Medium Risk", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20", icon: <AlertTriangle className="w-6 h-6 text-amber-400" />, action: "Monitor platform traffic." };
    }
    return { level: "High Risk", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: <XCircle className="w-6 h-6 text-rose-500" />, action: "Increase train frequency and notify passengers." };
  };

  return (
    <div className="w-full text-slate-200 p-6 md:p-10 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            Delay Prediction
          </h1>
          <p className="text-slate-400 text-lg">
            Predict whether a train journey will be delayed using AI.
          </p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Journey Information */}
          <SectionCard title="Journey Information" icon={Navigation}>
            <InputField label="Origin Station" name="origin_station" value={formData.origin_station} onChange={handleInputChange} icon={MapPin} />
            <InputField label="Destination Station" name="destination_station" value={formData.destination_station} onChange={handleInputChange} icon={MapPin} />
            <InputField label="Transport Type" name="transport_type" value={formData.transport_type} onChange={handleInputChange} icon={Train} />
            <InputField label="Route ID" name="route_id" value={formData.route_id} onChange={handleInputChange} icon={Navigation} />
            <InputField label="Departure Time (min)" name="scheduled_departure_min" type="number" value={formData.scheduled_departure_min} onChange={handleInputChange} icon={Clock} />
            <InputField label="Arrival Time (min)" name="scheduled_arrival_min" type="number" value={formData.scheduled_arrival_min} onChange={handleInputChange} icon={Clock} />
          </SectionCard>

          {/* Card 2: Weather Information */}
          <SectionCard title="Weather Information" icon={CloudRain}>
            <SelectField 
              label="Weather Condition" 
              name="weather_condition" 
              value={formData.weather_condition} 
              onChange={handleInputChange} 
              icon={CloudRain}
              options={[
                { label: "Clear", value: "Clear" },
                { label: "Rain", value: "Rain" },
                { label: "Cloudy", value: "Cloudy" },
                { label: "Snow", value: "Snow" },
                { label: "Storm", value: "Storm" },
              ]}
            />
            <InputField label="Temperature (°C)" name="temperature_c" type="number" value={formData.temperature_c} onChange={handleInputChange} icon={Thermometer} />
            <InputField label="Humidity (%)" name="humidity_percent" type="number" value={formData.humidity_percent} onChange={handleInputChange} icon={Droplets} />
            <InputField label="Wind Speed (km/h)" name="wind_speed_kmh" type="number" value={formData.wind_speed_kmh} onChange={handleInputChange} icon={Wind} />
            <InputField label="Precipitation (mm)" name="precipitation_mm" type="number" value={formData.precipitation_mm} onChange={handleInputChange} icon={CloudRain} />
          </SectionCard>

          {/* Card 3: Schedule & Events (Spans full width on Desktop) */}
          <div className="lg:col-span-2">
            <SectionCard title="Schedule & Events" icon={Calendar}>
              <InputField label="Event Type" name="event_type" value={formData.event_type} onChange={handleInputChange} icon={Users} />
              <InputField label="Expected Attendance" name="event_attendance_est" type="number" value={formData.event_attendance_est} onChange={handleInputChange} icon={Users} />
              <InputField label="Traffic Congestion" name="traffic_congestion_index" type="number" value={formData.traffic_congestion_index} onChange={handleInputChange} icon={Gauge} />
              <InputField label="Season" name="season" value={formData.season} onChange={handleInputChange} icon={Calendar} />
              <SelectField label="Peak Hour" name="peak_hour" value={formData.peak_hour} onChange={handleInputChange} icon={Clock} options={[{ label: "Yes", value: 1 }, { label: "No", value: 0 }]} />
              <SelectField label="Holiday" name="holiday" value={formData.holiday} onChange={handleInputChange} icon={Calendar} options={[{ label: "Yes", value: 1 }, { label: "No", value: 0 }]} />
              <InputField label="Day of Week" name="day_of_week" type="number" value={formData.day_of_week} onChange={handleInputChange} icon={Calendar} />
              <SelectField label="Weekend" name="is_weekend" value={formData.is_weekend} onChange={handleInputChange} icon={Calendar} options={[{ label: "Yes", value: 1 }, { label: "No", value: 0 }]} />
            </SectionCard>
          </div>
        </div>

        {/* Action Button */}
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

        {/* Prediction Result */}
        {result != null && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(() => {
              const risk = getRiskDetails(result.probability);
              return (
                <div className={`rounded-2xl border p-8 shadow-2xl backdrop-blur-sm flex flex-col items-center text-center space-y-6 ${risk.bg} ${risk.border}`}>
                  <h3 className="text-xl font-bold text-slate-300 uppercase tracking-widest">Prediction Result</h3>
                  
                  <div className="flex items-center gap-3 bg-slate-950/50 px-8 py-4 rounded-full border border-slate-800 shadow-inner">
                    <span className="text-3xl font-black tracking-wider">
                      {result.prediction === "Delayed" ? (
                        <span className="text-rose-500 flex items-center gap-3">
                          <span className="animate-pulse">🔴</span> DELAYED
                        </span>
                      ) : (
                        <span className="text-emerald-500 flex items-center gap-3">
                          <span className="animate-pulse">🟢</span> ON TIME
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl pt-4">
                    <div className="flex flex-col items-center p-6 bg-slate-900/50 rounded-xl border border-slate-800/50">
                      <Gauge className={`w-8 h-8 mb-3 ${risk.color}`} />
                      <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Confidence</span>
                      <span className="text-4xl font-bold text-white">{result.probability.toFixed(2)}%</span>
                      <span className={`mt-2 font-semibold ${risk.color}`}>{risk.level}</span>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-slate-900/50 rounded-xl border border-slate-800/50">
                      <Info className="w-8 h-8 mb-3 text-blue-400" />
                      <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Suggested Action</span>
                      <p className="text-slate-200 font-medium text-lg mt-2 leading-relaxed">
                        {risk.action}
                      </p>
                    </div>
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