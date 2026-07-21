import { useEffect, useRef, useState } from "react";

import MetroContext from "./MetroContext";
import metroState from "../data/metroState";

import {
  runSimulation,
  SIMULATION_INTERVAL,
} from "../utils/metroSimulation";

import {
  generateDashboardInsight,
} from "../utils/aiDecisionEngine";

function MetroProvider({ children }) {
  // ==========================================
  // Dashboard
  // ==========================================

  const [dashboard, setDashboard] = useState(
    metroState.dashboard
  );

  // ==========================================
  // Stations
  // ==========================================

  const [stations, setStations] = useState(
    metroState.stations
  );

  // ==========================================
  // Incidents
  // ==========================================

  const [incidents, setIncidents] = useState(
    metroState.incidents
  );

  // ==========================================
  // Schedule
  // ==========================================

  const [schedules, setSchedules] = useState(
    metroState.schedules
  );

  // ==========================================
  // Analytics
  // ==========================================

  const [analytics, setAnalytics] = useState(
    metroState.analytics
  );

  // ==========================================
  // Selected Station
  // ==========================================

  const [
    selectedStation,
    setSelectedStation,
  ] = useState(null);

  // ==========================================
  // Notifications
  // ==========================================

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  // ==========================================
  // AI Recommendation
  // ==========================================

  const [
    aiRecommendation,
    setAiRecommendation,
  ] = useState(null);

  // ==========================================
  // Loading
  // ==========================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  // ==========================================
  // Simulation
  // ==========================================

  const [
    simulationRunning,
    setSimulationRunning,
  ] = useState(true);

  const [
    simulationSpeed,
    setSimulationSpeed,
  ] = useState(1);

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(new Date());

  const simulationRef = useRef(null);

  // ==========================================
  // Station Selection
  // ==========================================

  const highlightStation = (
    stationName
  ) => {
    setSelectedStation(stationName);
  };

  const clearSelectedStation = () => {
    setSelectedStation(null);
  };

  // ==========================================
  // Notifications
  // ==========================================

  const addNotification = (
    notification
  ) => {
    const newNotification = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // ==========================================
  // AI Recommendation
  // ==========================================

  const updateAIRecommendation = (
    recommendation
  ) => {
    setAiRecommendation(recommendation);
  };

  // ==========================================
  // Resolve Incident
  // ==========================================

  const resolveIncident = (
    incidentId
  ) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              status: "Resolved",
            }
          : incident
      )
    );
  };
    // ==========================================
  // Toggle Simulation
  // ==========================================

  const toggleSimulation = () => {
    setSimulationRunning((prev) => !prev);
  };

  // ==========================================
  // Run One Simulation Cycle
  // ==========================================

  const runSimulationCycle = () => {
    const simulation = runSimulation({
      stations,
      dashboard,
    });

    // Update Stations
    setStations(simulation.stations);

    // Update Dashboard
    setDashboard(simulation.dashboard);

    // Generate AI Insight
    const insight = generateDashboardInsight(
      simulation.stations
    );

    if (insight) {
      setAiRecommendation(insight);
    }

    // Add Incident
    if (simulation.incident) {
      setIncidents((prev) => [
        simulation.incident,
        ...prev,
      ]);

      highlightStation(
        simulation.incident.station
      );
    }

    // Add Notification
    if (simulation.notification) {
      addNotification(
        simulation.notification
      );
    }

    // Update Timestamp
    setLastUpdated(new Date());
  };

  // ==========================================
  // Live Simulation
  // ==========================================

  useEffect(() => {
    if (!simulationRunning) {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }

      return;
    }

    if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }

    simulationRef.current = setInterval(
      runSimulationCycle,
      SIMULATION_INTERVAL / simulationSpeed
    );

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [
    simulationRunning,
    simulationSpeed,
    stations,
    dashboard,
  ]);

  // ==========================================
  // Auto Clear Selected Station
  // ==========================================

  useEffect(() => {
    if (!selectedStation) return;

    const timer = setTimeout(() => {
      clearSelectedStation();
    }, 8000);

    return () => clearTimeout(timer);
  }, [selectedStation]);

  // ==========================================
  // Limit Notifications
  // ==========================================

  useEffect(() => {
    if (notifications.length <= 25) {
      return;
    }

    setNotifications((prev) =>
      prev.slice(0, 25)
    );
  }, [notifications]);

  // ==========================================
  // Limit Incidents
  // ==========================================

  useEffect(() => {
    if (incidents.length <= 20) {
      return;
    }

    setIncidents((prev) =>
      prev.slice(0, 20)
    );
  }, [incidents]);

  // ==========================================
  // Generate Initial AI Insight
  // ==========================================

  useEffect(() => {
    if (!stations.length) {
      return;
    }

    const insight =
      generateDashboardInsight(
        stations
      );

    if (insight) {
      setAiRecommendation(insight);
    }
  }, []);
    // ==========================================
  // Context Value
  // ==========================================

  const value = {
    // Dashboard
    dashboard,
    setDashboard,

    // Stations
    stations,
    setStations,

    // Incidents
    incidents,
    setIncidents,

    // Schedule
    schedules,
    setSchedules,

    // Analytics
    analytics,
    setAnalytics,

    // Selected Station
    selectedStation,
    setSelectedStation,
    highlightStation,
    clearSelectedStation,

    // Notifications
    notifications,
    setNotifications,
    addNotification,
    removeNotification,
    markNotificationRead,
    clearNotifications,
    markAllNotificationsRead,

    // AI
    aiRecommendation,
    setAiRecommendation,
    updateAIRecommendation,

    // Loading
    loading,
    setLoading,

    // Simulation
    simulationRunning,
    toggleSimulation,

    simulationSpeed,
    setSimulationSpeed,

    lastUpdated,
    runSimulationCycle,

    // Incident
    resolveIncident,
  };

  return (
    <MetroContext.Provider value={value}>
      {children}
    </MetroContext.Provider>
  );
}

export default MetroProvider;
