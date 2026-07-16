/**
 * Utility helpers for the Metro CMS frontend.
 * Pure functions — no side effects, fully testable.
 */

/**
 * Format a date string (ISO or locale) to a human-readable display date.
 * Example: "2024-07-08" → "08 Jul 2024"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

/**
 * Format a datetime string to HH:MM time.
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

/**
 * Map a crowd density level string to the matching Tailwind badge class.
 * @param {'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'} level
 * @returns {string} CSS class name
 */
export const getDensityBadgeClass = (level) => {
  const map = {
    CRITICAL: 'badge-critical',
    HIGH: 'badge-high',
    MEDIUM: 'badge-medium',
    LOW: 'badge-low',
  }
  return map[level] || 'badge-medium'
}

/**
 * Map a train status string to a Tailwind text-color class.
 * @param {'ON_TIME'|'DELAYED'|'CANCELLED'|'ARRIVED'} status
 * @returns {string} CSS class name
 */
export const getStatusColor = (status) => {
  const map = {
    ON_TIME: 'text-green-400',
    DELAYED: 'text-amber-400',
    CANCELLED: 'text-red-400',
    ARRIVED: 'text-blue-400',
    RUNNING: 'text-cyan-400',
  }
  return map[status] || 'text-slate-400'
}

/**
 * Return a background highlight colour for train/schedule status.
 * @param {'ON_TIME'|'DELAYED'|'CANCELLED'} status
 * @returns {string}
 */
export const getStatusBg = (status) => {
  const map = {
    ON_TIME: 'bg-green-500/20 text-green-400 border-green-500/30',
    DELAYED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
    RUNNING: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    ARRIVED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }
  return map[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

/**
 * Truncate a string to maxLen characters, appending ellipsis if needed.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (text, maxLen = 60) =>
  text.length > maxLen ? `${text.slice(0, maxLen)}...` : text

/**
 * Derive two-character initials from a full name.
 * @param {string} name
 * @returns {string} e.g. "Riya Sen" → "RS"
 */
export const getInitials = (name) =>
  (name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

/**
 * Return a CSS background-color class for a metro line.
 * @param {'Blue'|'Red'|'Green'|'Yellow'} line
 * @returns {string}
 */
export const getLineColor = (line) => {
  const map = {
    Blue: 'bg-blue-500',
    Red: 'bg-red-500',
    Green: 'bg-green-500',
    Yellow: 'bg-yellow-400',
    Purple: 'bg-purple-500',
    Orange: 'bg-orange-500',
  }
  return map[line] || 'bg-slate-500'
}

/**
 * Clamp a numeric value between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
