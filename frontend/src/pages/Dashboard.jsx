import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Database, RefreshCw, ShieldCheck, UserCog } from 'lucide-react';
import { apiRequest } from '../api/client.js';
import AlertPanel from '../components/AlertPanel.jsx';
import AnalyticsPanel from '../components/AnalyticsPanel.jsx';
import HeatmapGrid from '../components/HeatmapGrid.jsx';
import Navbar from '../components/Navbar.jsx';
import PredictionPanel from '../components/PredictionPanel.jsx';
import RecommendationList from '../components/RecommendationList.jsx';
import ScheduleTable from '../components/ScheduleTable.jsx';
import StatCard from '../components/StatCard.jsx';
import StationTable from '../components/StationTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [stations, setStations] = useState([]);
  const [trend, setTrend] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [operations, setOperations] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [trafficReport, setTrafficReport] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [
        summaryData,
        stationData,
        trendData,
        heatmapData,
        scheduleData,
        recommendationData,
        operationData,
        predictionData,
        trafficData,
        alertData,
        updateData,
        announcementData,
        analyticsData,
      ] = await Promise.all([
        apiRequest('/dashboard/summary'),
        apiRequest('/dashboard/station-crowd?limit=20'),
        apiRequest('/dashboard/passenger-trend?days=30'),
        apiRequest('/dashboard/heatmap?limit=12'),
        apiRequest('/scheduling/schedules'),
        apiRequest('/scheduling/frequency-recommendations?limit=8'),
        apiRequest('/scheduling/operational-monitoring'),
        apiRequest('/prediction/demand-forecast?days=7'),
        apiRequest('/prediction/traffic-report'),
        apiRequest('/alerts'),
        apiRequest('/alerts/real-time-updates'),
        apiRequest('/alerts/announcements'),
        apiRequest('/analytics/report'),
      ]);
      setSummary(summaryData);
      setStations(stationData);
      setTrend(trendData.map((item) => ({ ...item, dateLabel: item.date.slice(5) })));
      setHeatmap(heatmapData);
      setSchedules(scheduleData);
      setRecommendations(recommendationData);
      setOperations(operationData);
      setPrediction(predictionData);
      setTrafficReport(trafficData);
      setAlerts(alertData);
      setUpdates(updateData);
      setAnnouncements(announcementData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-700">Milestones 1 to 3</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">MetroFlow Operations Dashboard</h1>
            <p className="mt-2 text-slate-500">
              Crowd monitoring, train scheduling, AI demand forecasting, alerts, analytics, and operational reporting using Delhi Metro passenger data.
            </p>
          </div>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>

        <section className="mb-8 rounded-3xl border border-cyan-100 bg-white p-5 card-shadow">
          {user?.role === 'admin' ? (
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-cyan-600" size={24} />
              <div>
                <p className="font-bold text-slate-950">Admin access enabled</p>
                <p className="text-sm text-slate-500">
                  Admin can view all station data, review schedules, monitor alerts, and validate operator-level workflows.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <UserCog className="mt-1 text-cyan-600" size={24} />
              <div>
                <p className="font-bold text-slate-950">Operator monitoring view</p>
                <p className="text-sm text-slate-500">
                  Operator can monitor crowd status, passenger trends, congestion alerts, schedule updates, and station-level recommendations.
                </p>
              </div>
            </div>
          )}
        </section>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center font-semibold text-slate-500 card-shadow">Loading dashboard...</div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-3xl bg-red-50 p-5 font-semibold text-red-700">
            <AlertTriangle /> {error}
          </div>
        )}

        {!loading && summary && (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {summary.cards.map((card) => (
                <StatCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
              ))}
            </section>

            {operations && (
              <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {operations.metrics.map((card) => (
                  <StatCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
                ))}
              </section>
            )}

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 card-shadow lg:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 1</p>
                    <h2 className="text-xl font-bold text-slate-950">Passenger trend</h2>
                    <p className="text-sm text-slate-500">Daily passenger volume from imported records.</p>
                  </div>
                  <Database className="text-cyan-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dateLabel" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="passengers" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 card-shadow">
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 1</p>
                <h2 className="text-xl font-bold text-slate-950">Ticket type split</h2>
                <p className="text-sm text-slate-500">Passenger volume by ticket category.</p>
                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={summary.ticket_type_split} dataKey="value" nameKey="label" innerRadius={55} outerRadius={100} paddingAngle={3}>
                        {summary.ticket_type_split.map((entry) => (
                          <Cell key={entry.label} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl bg-white p-6 card-shadow">
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 2</p>
              <h2 className="text-xl font-bold text-slate-950">Traffic analysis report</h2>
              <p className="text-sm text-slate-500">
                Peak context: {trafficReport?.peak_context || 'Loading'} | Busiest station: {trafficReport?.busiest_station || 'Loading'}
              </p>
              <div className="mt-5 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.remarks_split} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="mt-8">
              <ScheduleTable schedules={schedules} />
            </section>

            <section className="mt-8">
              <RecommendationList recommendations={recommendations} />
            </section>

            <section className="mt-8">
              <PredictionPanel prediction={prediction} />
            </section>

            <section className="mt-8">
              <AlertPanel alerts={alerts} updates={updates} announcements={announcements} />
            </section>

            <section className="mt-8">
              <HeatmapGrid heatmap={heatmap} />
            </section>

            <section className="mt-8">
              <AnalyticsPanel analytics={analytics} />
            </section>

            <section className="mt-8">
              <StationTable stations={stations} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
