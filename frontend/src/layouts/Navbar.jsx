import { Bell, Search, Menu, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLocation } from 'react-router-dom'

/**
 * Human-readable page title for each route.
 */
const PAGE_TITLES = {
  '/':                 'Operations Dashboard',
  '/crowd-monitoring': 'Crowd Monitoring',
  '/train-status':     'Train Status',
  '/schedules':        'Schedule Management',
  '/analytics':        'Analytics & Insights',
  '/alerts':           'Alert Management',
  '/settings':         'System Settings',
}

/**
 * Navbar — Top header bar showing current page title, search, notifications, and user chip.
 *
 * @param {{ onMenuToggle: () => void }} props
 */
export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth()
  const location = useLocation()

  const pageTitle = PAGE_TITLES[location.pathname] || 'Metro CMS'
  const now = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 flex-shrink-0 z-10">
      {/* ── Left: menu toggle + page title ─────────────── */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="text-slate-400 hover:text-white transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-white font-semibold text-base leading-tight">
            {pageTitle}
          </h1>
          <p className="text-slate-500 text-xs leading-none mt-0.5">{now}</p>
        </div>
      </div>

      {/* ── Right: search, actions, user ───────────────── */}
      <div className="flex items-center gap-2.5">
        {/* Search bar — hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-cyan-500/60 transition-colors">
          <Search size={13} className="text-slate-500 flex-shrink-0" />
          <input
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-36"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        {/* Notifications bell */}
        <button
          className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          title="Notifications"
          aria-label="Notifications (3 unread)"
        >
          <Bell size={16} />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
        </button>

        {/* Refresh button */}
        <button
          className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-slate-600 transition-colors"
          title="Refresh data"
          aria-label="Refresh"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2 pl-2.5 border-l border-slate-700">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(user?.full_name || user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-slate-300 font-medium hidden sm:block">
            {(user?.full_name || user?.name || 'User').split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  )
}
