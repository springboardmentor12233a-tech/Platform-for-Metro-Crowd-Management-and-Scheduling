import { useState } from "react";
import api from "../services/api";
import "../styles/aiPages.css";

function AnalyticsDashboard() {

    const [station, setStation] = useState("");
    const [passengerCount, setPassengerCount] = useState("");
    const [averageWaitTime, setAverageWaitTime] = useState("");
    const [alertsGenerated, setAlertsGenerated] = useState("");
    const [scheduleDelays, setScheduleDelays] = useState("");

    const [report, setReport] = useState("");
    const [loading, setLoading] = useState(false);

    const stations = [
        "Ameerpet",
        "Miyapur",
        "Raidurg",
        "Nagole",
        "LB Nagar",
        "Secunderabad",
        "Kukatpally",
        "Uppal"
    ];

    const generateReport = async () => {

        if (
            !station ||
            !passengerCount ||
            !averageWaitTime ||
            !alertsGenerated ||
            !scheduleDelays
        ) {
            alert("Please fill all fields.");
            return;
        }

        setLoading(true);

        try {

            const res = await api.post("/analytics/generate", {

                station,

                passenger_count: Number(passengerCount),

                average_wait_time: Number(averageWaitTime),

                alerts_generated: Number(alertsGenerated),

                schedule_delays: Number(scheduleDelays)

            });

            setReport(res.data.analytics_report);

        } catch (err) {

            console.log(err);

            alert("Failed to generate analytics.");

        }

        setLoading(false);

    };

    const copyReport = () => {

        navigator.clipboard.writeText(report);

        alert("Copied Successfully");

    };

    const downloadReport = () => {

        const blob = new Blob([report], {
            type: "text/plain"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `${station}_Analytics_Report.txt`;

        a.click();

        URL.revokeObjectURL(url);

    };

    const clearData = () => {

        setStation("");

        setPassengerCount("");

        setAverageWaitTime("");

        setAlertsGenerated("");

        setScheduleDelays("");

        setReport("");

    };

    return (

<div className="ai-page">

<div className="ai-header">

<h2>📊 AI Analytics Dashboard</h2>

<p>
Generate AI-powered metro analytics and recommendations.
</p>

</div>

<div className="dashboard-cards">

<div className="stat-card">

<h3>👥 Passengers</h3>

<p>{passengerCount || "--"}</p>

</div>

<div className="stat-card">

<h3>⏱ Wait Time</h3>

<p>{averageWaitTime || "--"} mins</p>

</div>

<div className="stat-card">

<h3>🚨 Alerts</h3>

<p>{alertsGenerated || "--"}</p>

</div>

<div className="stat-card">

<h3>🚆 Delays</h3>

<p>{scheduleDelays || "--"}</p>

</div>

</div>

<div className="ai-card">

<h3 className="section-title">

Today's Metro Analytics

</h3>

<div className="form-group">

<label>Station</label>

<select
value={station}
onChange={(e)=>setStation(e.target.value)}
>

<option value="">Select Station</option>

{stations.map((s)=>(

<option key={s}>{s}</option>

))}

</select>

</div>

<div className="form-group">

<label>Passenger Count</label>

<input

type="number"

value={passengerCount}

onChange={(e)=>setPassengerCount(e.target.value)}

/>

</div>

<div className="form-group">

<label>Average Wait Time</label>

<input

type="number"

value={averageWaitTime}

onChange={(e)=>setAverageWaitTime(e.target.value)}

/>

</div>

<div className="form-group">

<label>Alerts Generated</label>

<input

type="number"

value={alertsGenerated}

onChange={(e)=>setAlertsGenerated(e.target.value)}

/>

</div>

<div className="form-group">

<label>Schedule Delays</label>

<input

type="number"

value={scheduleDelays}

onChange={(e)=>setScheduleDelays(e.target.value)}

/>

</div>

<button

className="primary-btn"

onClick={generateReport}

>

{loading ? "Generating..." : "🤖 Generate Analytics Report"}

</button>

</div>

{report && (

<div className="ai-card">

<h3 className="section-title">

🤖 MetroFlow AI Analytics Report

</h3>

<div className="info-row">

<span className="chip">

📍 {station}

</span>

<span className="chip">

👥 {passengerCount}

</span>

<span className="chip">

⏱ {averageWaitTime} mins

</span>

<span className="chip">

🚨 {alertsGenerated}

</span>

</div>

<div className="result-box">

{report}

</div>

<div className="action-buttons">

<button

className="copy-btn"

onClick={copyReport}

>

📋 Copy

</button>

<button

className="download-btn"

onClick={downloadReport}

>

💾 Download

</button>

<button

className="clear-btn"

onClick={clearData}

>

🗑 Clear

</button>

</div>

</div>

)}

</div>

);

}

export default AnalyticsDashboard;