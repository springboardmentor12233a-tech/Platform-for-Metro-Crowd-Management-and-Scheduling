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
  FREQUENCY_ADJUSTMENT: '/frequency-adjustment',
  SCHEDULE_OPTIMIZER: "/schedule-optimizer",
  OPERATIONS_DASHBOARD: "/operations-dashboard",

DELAY_PREDICTION: "/delay-prediction",
  /** Catch-all */
  NOT_FOUND: '*',
}