export const ROUTES = {
  /** Public routes */
  LOGIN: '/login',

  /** Protected routes */
  DASHBOARD: '/',
  CROWD_PREDICTION: '/crowd-prediction',
  RIDERSHIP_PREDICTION: '/ridership-prediction',   // <-- ADD THIS
  TRAIN_STATUS: '/train-status',
  SCHEDULES: '/schedules',
  ANALYTICS: '/analytics',
  ALERTS: '/alerts',
  SETTINGS: '/settings',

  /** Catch-all */
  NOT_FOUND: '*',
}