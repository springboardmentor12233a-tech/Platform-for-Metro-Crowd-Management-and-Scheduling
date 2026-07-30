import { useState } from "react";
import { generateAnnouncement } from "../services/announcementService";
import AnnouncementResult from "./AnnouncementResult";
import LoadingSpinner from "./LoadingSpinner";

function AnnouncementForm() {

    const [station, setStation] = useState("");
    const [incident, setIncident] = useState("");
    const [severity, setSeverity] = useState("Medium");

    const [announcement, setAnnouncement] = useState("");
    const [loading, setLoading] = useState(false);

    const stations = [
        "Ameerpet",
        "Miyapur",
        "Raidurg",
        "Nagole",
        "LB Nagar",
        "Secunderabad",
        "Kukatpally",
        "Madhapur"
    ];

    const handleSubmit = async () => {

        if (!station || !incident) {
            alert("Fill all fields");
            return;
        }

        setLoading(true);

        try {

            const data = await generateAnnouncement({
                station,
                incident,
                severity
            });

            setAnnouncement(data.announcement);

        } catch {

            alert("Generation Failed");

        } finally {

            setLoading(false);

        }
    };

    return (

        <>

            <div className="form-card">

                <label>Station</label>

                <select
                    value={station}
                    onChange={(e)=>setStation(e.target.value)}
                >
                    <option value="">Choose Station</option>

                    {stations.map((station)=>(
                        <option key={station}>{station}</option>
                    ))}

                </select>

                <label>Incident</label>

                <textarea

                    rows="4"

                    value={incident}

                    onChange={(e)=>setIncident(e.target.value)}

                    placeholder="Describe emergency..."

                />

                <label>Severity</label>

                <select

                    value={severity}

                    onChange={(e)=>setSeverity(e.target.value)}

                >

                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>

                </select>

                <button

                    className="generate-btn"

                    onClick={handleSubmit}

                >

                    Generate Announcement

                </button>

            </div>

            {loading && <LoadingSpinner/>}

            {announcement &&

                <AnnouncementResult

                    announcement={announcement}

                />

            }

        </>

    );

}

export default AnnouncementForm;