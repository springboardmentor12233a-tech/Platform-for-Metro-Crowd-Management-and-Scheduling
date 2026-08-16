import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";

import CrowdPrediction from "../pages/CrowdPrediction";
import TrainStatus from "../pages/TrainStatus";
import Schedules from "../pages/Schedules";
import Analytics from "../pages/Analytics";
import Alerts from "../pages/Alerts";
import Settings from "../pages/Settings";

import DelayPrediction from "../pages/DelayPrediction";
import RidershipPrediction from "../pages/RidershipPrediction";
import FrequencyAdjustment from "../pages/FrequencyAdjustment";
import ScheduleOptimizer from "../pages/ScheduleOptimizer";
import OperationsDashboard from "../pages/OperationsDashboard";

import NotFound from "../pages/NotFound";

import { ROUTES } from "../constants/routes";


// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute({ children }) {

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                replace
            />
        );
    }

    return children;
}


// ============================================================
// ADMIN ONLY ROUTE
// ============================================================

function AdminRoute({ children }) {

    const {
        isAuthenticated,
        user,
    } = useAuth();


    // Not logged in
    if (!isAuthenticated) {

        return (
            <Navigate
                to={ROUTES.LOGIN}
                replace
            />
        );
    }


    // Logged-in normal user trying to access admin area
    if (user?.role !== "admin") {

        return (
            <Navigate
                to="/user-dashboard"
                replace
            />
        );
    }


    return children;
}


// ============================================================
// USER ONLY ROUTE
// ============================================================

function UserRoute({ children }) {

    const {
        isAuthenticated,
        user,
    } = useAuth();


    // Not logged in
    if (!isAuthenticated) {

        return (
            <Navigate
                to={ROUTES.LOGIN}
                replace
            />
        );
    }


    // Admin trying to access user area
    if (user?.role !== "user") {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
}


// ============================================================
// APP ROUTES
// ============================================================

export default function AppRoutes() {

    return (

        <Routes>

            {/* ==================================================
                PUBLIC LOGIN
            ================================================== */}

            <Route
                path={ROUTES.LOGIN}
                element={<Login />}
            />


            {/* ==================================================
                USER AREA
            ================================================== */}

<Route
    path="/user-dashboard"
    element={
        <UserRoute>
            <MainLayout />
        </UserRoute>
    }
>
    <Route
        index
        element={<OperationsDashboard />}
    />


                {/* Train Status */}

                <Route
                    path="train-status"
                    element={<TrainStatus />}
                />


                {/* Schedules */}

                <Route
                    path="schedules"
                    element={<Schedules />}
                />


                {/* Crowd Prediction */}

                <Route
                    path="crowd-prediction"
                    element={<CrowdPrediction />}
                />


                {/* Alerts */}

                <Route
                    path="alerts"
                    element={<Alerts />}
                />


                {/* Settings */}

                <Route
                    path="settings"
                    element={<Settings />}
                />

            </Route>


            {/* ==================================================
                ADMIN AREA
            ================================================== */}

            <Route
                path="/"
                element={
                    <AdminRoute>
                        <MainLayout />
                    </AdminRoute>
                }
            >

                {/* Admin Dashboard */}

                <Route
                    index
                    element={<OperationsDashboard />}
                />


                {/* Operations Dashboard */}

                <Route
                    path="operations-dashboard"
                    element={<OperationsDashboard />}
                />


                {/* Crowd Prediction */}

                <Route
                    path="crowd-prediction"
                    element={<CrowdPrediction />}
                />


                {/* Ridership Prediction */}

                <Route
                    path="ridership-prediction"
                    element={<RidershipPrediction />}
                />


                {/* Frequency Adjustment */}

                <Route
                    path="frequency-adjustment"
                    element={<FrequencyAdjustment />}
                />


                {/* Train Status */}

                <Route
                    path="train-status"
                    element={<TrainStatus />}
                />


                {/* Delay Prediction */}

                <Route
                    path="delay-prediction"
                    element={<DelayPrediction />}
                />


                {/* Schedule Optimizer */}

                <Route
                    path="schedule-optimizer"
                    element={<ScheduleOptimizer />}
                />


                {/* Schedules */}

                <Route
                    path="schedules"
                    element={<Schedules />}
                />


                {/* Analytics */}

                <Route
                    path="analytics"
                    element={<Analytics />}
                />


                {/* Alerts */}

                <Route
                    path="alerts"
                    element={<Alerts />}
                />


                {/* Settings */}

                <Route
                    path="settings"
                    element={<Settings />}
                />

            </Route>


            {/* ==================================================
                CATCH ALL
            ================================================== */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );
}