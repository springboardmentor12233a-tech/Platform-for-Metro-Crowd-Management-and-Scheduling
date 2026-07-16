import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  Zap,
  Calendar,
  BarChart2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'
import { getInitials } from '../utils/helpers'

/**
 * Navigation item definitions.
 * `badge` — optional numeric indicator shown on the nav item.
 */
const navItems = [
  { to: ROUTES.DASHBOARD,        icon: LayoutDashboard, label: 'Dashboard'        },
  { to: ROUTES.CROWD_MONITORING, icon: Activity,        label: 'Crowd Monitoring' },
  { to: ROUTES.TRAIN_STATUS,     icon: Zap,             label: 'Train Status'     },
  { to: ROUTES.SCHEDULES,        icon: Calendar,        label: 'Schedules'        },
  { to: ROUTES.ANALYTICS,        icon: BarChart2,       label: 'Analytics'        },
  { to: ROUTES.ALERTS,           icon: Bell,            label: 'Alerts', badge: 3 },
  { to: ROUTES.SETTINGS,         icon: Settings,        label: 'Settings'         },
]

/**
 * Sidebar — Collapsible navigation rail.
 *
 * @param {{ collapsed: boolean, onToggle: () => void }} props
 */
export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <aside
      className="flex flex-col bg-slate-900 border-r border-slate-700/50 transition-all duration-300 flex-shrink-0 relative"
      style={{ width: collapsed ? '72px' : '260px' }}
    >
      {/* ── Logo / Brand ───────────────────────────────── */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-700/50 overflow-hidden">
        {/* Logo icon — always visible */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-cyan-500/30">
            M
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-white font-bold text-sm leading-none truncate">
                Metro CMS
              </div>
              <div className="text-slate-400 text-xs leading-none mt-0.5 truncate">
                Crowd Management
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle — shown when expanded */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700 flex-shrink-0"
            title="Collapse sidebar"
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Expand toggle — shown when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center justify-center py-2.5 text-slate-400 hover:text-white transition-colors border-b border-slate-700/50"
          title="Expand sidebar"
        >
          <ChevronRight size={15} />
        </button>
      )}

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => {
          const isActive =
            to === ROUTES.DASHBOARD
              ? location.pathname === '/'
              : location.pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={[
                'nav-link',
                isActive ? 'active' : '',
                collapsed ? 'justify-center px-0' : '',
              ].join(' ')}
            >
              <Icon size={18} className="flex-shrink-0" />

              {!collapsed && (
                <span className="flex-1 truncate">{label}</span>
              )}

              {/* Badge — full text when expanded, dot when collapsed */}
              {badge && !collapsed && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {badge}
                </span>
              )}
              {badge && collapsed && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* ── User section ───────────────────────────────── */}
      <div className="p-3 border-t border-slate-700/50">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors group cursor-default">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user ? getInitials(user.full_name || user.name || 'User') : 'U'}
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                {user?.full_name || user?.name || 'Metro User'}
              </div>
              <div className="text-slate-400 text-xs capitalize truncate">
                {user?.role || 'operator'}
              </div>
            </div>

            {/* Logout — appears on group hover */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-slate-800"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  )
}
