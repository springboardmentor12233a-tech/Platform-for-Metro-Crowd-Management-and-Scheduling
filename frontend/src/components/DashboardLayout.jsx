import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Sidebar.css";

function DashboardLayout() {
  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </>
  );
}

export default DashboardLayout;