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

import StationsPage from './pages/StationsPage';
import TrainsPage from './pages/TrainsPage';
import AdminPanel from './pages/AdminPanel';
import SettingsPage from './pages/SettingsPage';

import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import LiveMonitoring from './pages/LiveMonitoring';
import Scheduling from './pages/Scheduling';
import AIPrediction from './pages/AIPrediction';
import PassengerForecast from './pages/PassengerForecast';
import AnalyticsReports from './pages/AnalyticsReports';
import FrequencyAdjustment from './pages/FrequencyAdjustment';
import CrowdPrediction from './pages/CrowdPrediction';
import AlertsPage from './pages/AlertsPage';

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

                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="live-monitoring" element={<LiveMonitoring />} />
                <Route path="scheduling" element={<Scheduling />} />
                <Route path="ai-prediction" element={<AIPrediction />} />
                <Route path="passenger-forecast" element={<PassengerForecast />} />
                <Route path="analytics-reports" element={<AnalyticsReports />} />
                <Route path="frequency-adjustment" element={<FrequencyAdjustment />} />
                <Route path="crowd-prediction" element={<CrowdPrediction />} />
                <Route path="alerts" element={<AlertsPage />} />

                {/* Operations restricted pages (Admin & Operators) */}
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
