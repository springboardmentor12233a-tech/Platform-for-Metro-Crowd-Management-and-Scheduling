import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from '../router';
import {
  LayoutDashboard, Train, AlertTriangle, BarChart2,
  CalendarClock, Radio, LogOut, Settings, Users
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, path: '/', roles: ['admin','operator','station_master','passenger'] },
  { label: 'Crowd Monitor', icon: Radio, path: '/crowd', roles: ['admin','operator','station_master'] },
  { label: 'Schedules', icon: CalendarClock, path: '/schedules', roles: ['admin','operator','station_master','passenger'] },
  { label: 'Analytics', icon: BarChart2, path: '/analytics', roles: ['admin','operator'] },
  { label: 'Alerts', icon: AlertTriangle, path: '/alerts', roles: ['admin','operator','station_master'] },
  { label: 'Stations', icon: Train, path: '/stations', roles: ['admin','operator','station_master','passenger'] },
  { label: 'Users', icon: Users, path: '/users', roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const userRole = user?.role || 'passenger';
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U';

  const visibleLinks = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🚇</div>
        <div>
          <h2>MetroFlow</h2>
          <span>Crowd Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {visibleLinks.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link${pathname === item.path ? ' active' : ''}`}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <strong>{user?.username}</strong>
            <span>{user?.role?.replace('_', ' ')}</span>
          </div>
          <button className="btn-logout" onClick={logout} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
