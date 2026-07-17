import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;