/**
 * Application route constants.
 * Centralises all route paths to avoid magic strings scattered across the codebase.
 * Import and use these instead of hard-coding path strings in <Link> or navigate().
 */
export const ROUTES = {
  /** Public routes */
  LOGIN: '/login',

  /** Protected routes — require authentication */
  DASHBOARD: '/',
  CROWD_MONITORING: '/crowd-monitoring',
  TRAIN_STATUS: '/train-status',
  SCHEDULES: '/schedules',
  ANALYTICS: '/analytics',
  ALERTS: '/alerts',
  SETTINGS: '/settings',

  /** Catch-all */
  NOT_FOUND: '*',
}
