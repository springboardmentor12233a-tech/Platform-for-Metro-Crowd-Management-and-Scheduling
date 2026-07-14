import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { PrivateRoute, RoleRoute } from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MetroMapPage from './pages/MetroMapPage';
import CrowdMonitoring from './pages/CrowdMonitoring';
import Scheduling from './pages/Scheduling';
import AIPrediction from './pages/AIPrediction';
import AnalyticsReports from './pages/AnalyticsReports';
import StationsPage from './pages/StationsPage';
import TrainsPage from './pages/TrainsPage';
import AdminPanel from './pages/AdminPanel';
import SettingsPage from './pages/SettingsPage';
import AlertsPage from './pages/AlertsPage';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import LiveMonitoring from './pages/LiveMonitoring';
import FrequencyAdjustment from './pages/FrequencyAdjustment';
import CrowdPrediction from './pages/CrowdPrediction';
import PassengerForecast from './pages/PassengerForecast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Private Shell Layout Routes */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                {/* General Protected Pages */}
                <Route index element={<Dashboard />} />
                <Route path="map" element={<MetroMapPage />} />
                <Route path="crowd" element={<CrowdMonitoring />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="live-monitoring" element={<LiveMonitoring />} />


                {/* Operations restricted pages (Admin & Operators) */}
                <Route 
                  path="scheduling" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Metro Operator']}>
                      <Scheduling />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="frequency" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Metro Operator']}>
                      <FrequencyAdjustment />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="stations" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Metro Operator']}>
                      <StationsPage />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="trains" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Metro Operator']}>
                      <TrainsPage />
                    </RoleRoute>
                  } 
                />

                {/* Analytics restricted pages (Admin & Analysts) */}
                <Route 
                  path="predictions" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Analyst']}>
                      <AIPrediction />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="predict-crowd" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Analyst']}>
                      <CrowdPrediction />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="passenger-forecast" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Analyst']}>
                      <PassengerForecast />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="reports" 
                  element={
                    <RoleRoute allowedRoles={['Admin', 'Analyst']}>
                      <AnalyticsReports />
                    </RoleRoute>
                  } 
                />

                {/* Admin Exclusive Panel */}
                <Route 
                  path="admin" 
                  element={
                    <RoleRoute allowedRoles={['Admin']}>
                      <AdminPanel />
                    </RoleRoute>
                  } 
                />
              </Route>

              {/* 404 Route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
