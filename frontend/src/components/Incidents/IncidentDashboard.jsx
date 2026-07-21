import { useEffect, useMemo, useState } from "react";

import useMetro from "../../hooks/useMetro";

import incidentData from "./incidentData";
import IncidentCard from "./IncidentCard";
import IncidentDrawer from "./IncidentDrawer";
import IncidentFilters from "./IncidentFilters";
import IncidentSearch from "./IncidentSearch";
import IncidentSort from "./IncidentSort";
import IncidentStats from "./IncidentStats";
import IncidentTimeline from "./IncidentTimeline";
import NotificationToast from "./NotificationToast";

function IncidentDashboard() {
  const {
    highlightStation,
    addNotification,
  } = useMetro();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("severity");

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // ==========================
  // Simulate Live Refresh
  // ==========================
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Refreshing incident feed...");
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // ==========================
  // Demo Notification
  // ==========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // ==========================
  // Filter Incidents
  // ==========================
  const filteredIncidents = useMemo(() => {
    return incidentData.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.station.toLowerCase().includes(search.toLowerCase()) ||
        incident.line.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        selectedFilter === "All" ||
        incident.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilter]);

  // ==========================
  // Sort Incidents
  // ==========================
  const sortedIncidents = useMemo(() => {
    const incidents = [...filteredIncidents];

    if (sortBy === "passengers") {
      incidents.sort((a, b) => b.passengers - a.passengers);
    } else if (sortBy === "severity") {
      const severityOrder = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      incidents.sort(
        (a, b) =>
          severityOrder[b.severity] - severityOrder[a.severity]
      );
    } else if (sortBy === "time") {
      incidents.sort((a, b) =>
        b.reported.localeCompare(a.reported)
      );
    }

    return incidents;
  }, [filteredIncidents, sortBy]);

  // ==========================
  // Handle Incident Click
  // ==========================
  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);

    // Highlight station globally
    highlightStation(incident.station);

    // Create global notification
    addNotification({
      type: "incident",
      title: incident.title,
      message: `${incident.station} has been selected from Incident Management.`,
      severity: incident.severity,
    });
  };

  return (
    <>
      <section className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Incident Management
            </h1>

            <p className="text-slate-500 mt-2 text-lg">
              Monitor, prioritize, and resolve operational incidents across the
              metro network in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-xl shadow-sm">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

            <span className="font-semibold">
              System Live
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <IncidentStats />

        {/* Search + Sort */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <IncidentSearch
              search={search}
              setSearch={setSearch}
            />
          </div>

          <IncidentSort
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* Filters */}
        <IncidentFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident List */}
          <div className="lg:col-span-2 space-y-6">
            {sortedIncidents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow border border-slate-200 p-12 text-center">
                <h2 className="text-2xl font-semibold text-slate-800">
                  No incidents found
                </h2>

                <p className="text-slate-500 mt-3">
                  Try changing your search keywords or selected filter.
                </p>
              </div>
            ) : (
              sortedIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onClick={() => handleIncidentClick(incident)}
                />
              ))
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <IncidentTimeline />
          </div>
        </div>
      </section>

      {/* Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

      {/* Live Notification */}
      {showToast && <NotificationToast />}
    </>
  );
}

export default IncidentDashboard;