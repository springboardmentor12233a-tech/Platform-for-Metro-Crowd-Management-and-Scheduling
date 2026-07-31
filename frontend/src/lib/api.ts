import { getAccessToken, clearTokens } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Types matching backend Pydantic schemas
export interface StationData {
  id: number;
  name: string;
  code: string | null;
  line_id: number;
  latitude: number;
  longitude: number;
  layout: string;
  is_interchange: boolean;
  max_capacity: number;
  warning_threshold: number;
  critical_threshold: number;
  line_name: string | null;
  line_color: string | null;
}

export interface CrowdReading {
  id: number;
  station_id: number;
  timestamp: string;
  entry_count: number;
  exit_count: number;
  current_occupancy: number;
  density_level: string;
  source: string | null;
}

export interface LiveCrowdData {
  station_id: number;
  station_name: string;
  latest_reading: CrowdReading | null;
  density_level: string;
}

export interface AlertData {
  id: number;
  station_id: number | null;
  alert_type: string;
  severity: string;
  status: string;
  title: string;
  message: string;
  metric_value: number | null;
  created_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
}

export interface AlertListData {
  alerts: AlertData[];
  total: number;
  active_count: number;
}

export interface CrowdHistoryData {
  station_id: number;
  station_name: string;
  readings: CrowdReading[];
  total_count: number;
}

// API functions
export const fetchStations = () => apiFetch<StationData[]>('/api/v1/stations/');
export const fetchCrowdLive = () => apiFetch<LiveCrowdData[]>('/api/v1/crowd/live');
export const fetchAlerts = () => apiFetch<AlertListData>('/api/v1/alerts/');
export const fetchCrowdHistory = (stationId: number, hours = 24) =>
  apiFetch<CrowdHistoryData>(`/api/v1/crowd/${stationId}/history?hours=${hours}`);
export const acknowledgeAlert = (alertId: number) =>
  apiFetch<AlertData>(`/api/v1/alerts/${alertId}/acknowledge`, { method: 'POST' });

// ── Prediction Types ─────────────────────────────────────
export interface StationPrediction {
  station_id: number;
  station_name: string;
  current_entries: number;
  prediction_1h: number;
  prediction_4h: number;
  trend: string;
  risk_level: string;
}

export interface ModelInfo {
  name: string;
  model_type: string;
  version: string;
  r2_score: number | null;
  rmse: number | null;
  last_trained: string | null;
}

export interface BulkPredictionData {
  predictions: StationPrediction[];
  model_info: ModelInfo;
  generated_at: string;
}

// ── Scheduling Types ─────────────────────────────────────
export interface ScheduleRecommendation {
  id: number;
  station_id: number;
  station_name: string;
  line_name: string | null;
  reason: string;
  adjustment_type: string;
  suggested_change: string;
  risk_level: string;
  predicted_entries: number;
  status: string;
  created_at: string;
}

export interface RecommendationListData {
  recommendations: ScheduleRecommendation[];
  total: number;
  generated_at: string;
}

// ── Prediction & Scheduling API ──────────────────────────
export const fetchPredictions = (limit = 50) =>
  apiFetch<BulkPredictionData>(`/api/v1/predictions/bulk/all?limit=${limit}`);
export const fetchStationPrediction = (stationId: number) =>
  apiFetch<StationPrediction>(`/api/v1/predictions/${stationId}`);
export const fetchScheduleRecommendations = (limit = 50) =>
  apiFetch<RecommendationListData>(`/api/v1/scheduling/recommendations?limit=${limit}`);
