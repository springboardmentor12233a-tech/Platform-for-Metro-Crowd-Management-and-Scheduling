import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export default function ProtectedRoute({
    allowedRoles,
}) {

    const {
        isAuthenticated,
        loading,
        role,
    } = useAuth();

    const location = useLocation();


    // --------------------------------------------------------
    // Restore JWT/user information first
    // --------------------------------------------------------

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">

                    <div
                        className="
                            w-10
                            h-10
                            border-4
                            border-slate-700
                            border-t-cyan-400
                            rounded-full
                            animate-spin
                            mx-auto
                            mb-4
                        "
                    />

                    <p className="text-slate-400">
                        Checking authentication...
                    </p>

                </div>
            </div>
        );

    }


    // --------------------------------------------------------
    // Not logged in
    // --------------------------------------------------------

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );

    }


    // --------------------------------------------------------
    // Role restriction
    // --------------------------------------------------------

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // --------------------------------------------------------
    // Authorized
    // --------------------------------------------------------

    return <Outlet />;
}