import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {

    return (

        <div className="sidebar">

            <h2>MetroFlow</h2>

            <NavLink to="/dashboard">Dashboard</NavLink>

            <NavLink to="/prediction">Prediction</NavLink>
            <NavLink to="/monitoring">Monitoring</NavLink>

            <NavLink to="/reports">Reports</NavLink>

            <NavLink to="/schedule">Schedule</NavLink>

            <NavLink to="/frequency">Frequency</NavLink>

            <NavLink to="/history">Prediction History</NavLink>

            <NavLink to="/emergency-announcement">
                Emergency Announcement
            </NavLink>

            <NavLink to="/smart-alerts">
                Smart Alerts
            </NavLink>

            <NavLink to="/schedule-updates">
                Schedule Updates
            </NavLink>
            <NavLink to="/analytics-dashboard">
                Analytics Dashboard
            </NavLink>

            <NavLink to="/heatmap">
                Congestion Heatmap
            </NavLink>

        </div>

    );

}

export default Sidebar;