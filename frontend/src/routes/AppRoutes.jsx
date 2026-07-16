import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import CrowdMonitoring from '../pages/CrowdMonitoring'
import TrainStatus from '../pages/TrainStatus'
import Schedules from '../pages/Schedules'
import Analytics from '../pages/Analytics'
import Alerts from '../pages/Alerts'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'
import { ROUTES } from '../constants/routes'

/**
 * ProtectedRoute — wraps children and redirects to /login when unauthenticated.
 * @param {{ children: ReactNode }} props
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />
}

/**
 * AppRoutes — declarative route tree for the entire application.
 *
 * Structure:
 *  /login           → Login (public)
 *  /                → MainLayout (protected shell)
 *    index          → Dashboard
 *    /crowd-monitoring → CrowdMonitoring
 *    /train-status     → TrainStatus
 *    /schedules        → Schedules
 *    /analytics        → Analytics
 *    /alerts           → Alerts
 *    /settings         → Settings
 *  *                → NotFound
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<Login />} />

      {/* Protected shell — all children inherit MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path={ROUTES.CROWD_MONITORING} element={<CrowdMonitoring />} />
        <Route path={ROUTES.TRAIN_STATUS} element={<TrainStatus />} />
        <Route path={ROUTES.SCHEDULES} element={<Schedules />} />
        <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
        <Route path={ROUTES.ALERTS} element={<Alerts />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  )
}
