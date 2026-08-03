import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NetworkMap from './pages/NetworkMap';
import Schedules from './pages/Schedules';
import AIPredictions from './pages/AIPredictions';
import AnalyticsReports from './pages/AnalyticsReports';
import UserManagement from './pages/UserManagement';

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-950/60">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<NetworkMap />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/ai-predictions" element={<AIPredictions />} />
            <Route path="/reports" element={<AnalyticsReports />} />
            
            {/* Admin only route */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WebSocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/*" element={<AppLayout />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WebSocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
