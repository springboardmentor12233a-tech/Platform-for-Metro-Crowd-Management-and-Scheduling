/**
 * Settings Page
 * Profile, notifications, system configuration, and API settings.
 */
import { useState } from 'react'
import { User, Bell, Sliders, Globe, Shield, Check, Wifi } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getInitials } from '../utils/helpers'

function Toggle({ enabled, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Icon size={16} className="text-cyan-400" />
        </div>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    crowdThreshold: true,
    trainDelays: true,
    systemUpdates: false,
    weeklyReport: true,
  })

  const [system, setSystem] = useState({
    refreshInterval: '30',
    timezone: 'Asia/Kolkata',
    language: 'en',
    theme: 'dark',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleNotification = (key) => (val) => setNotifications((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your account preferences and system configuration</p>
      </div>

      {/* Profile */}
      <Section icon={User} title="Profile Settings">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div>
            <div className="text-white font-bold text-lg">{user?.name || 'Metro Admin'}</div>
            <div className="text-slate-400 text-sm">{user?.email || 'admin@metro.com'}</div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 mt-1 capitalize">
              {user?.role || 'admin'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', value: user?.name || 'Metro Admin', id: 'setting-name' },
            { label: 'Email Address', value: user?.email || 'admin@metro.com', id: 'setting-email' },
            { label: 'Role', value: user?.role || 'admin', id: 'setting-role' },
            { label: 'Employee ID', value: 'EMP-001', id: 'setting-empid' },
          ].map((f) => (
            <div key={f.id}>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">{f.label}</label>
              <input
                id={f.id}
                readOnly
                value={f.value}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm cursor-not-allowed capitalize"
              />
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-3">Profile edits require admin approval — available in Milestone 2.</p>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notification Preferences">
        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive critical alerts via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications for incidents' },
            { key: 'crowdThreshold', label: 'Crowd Threshold Alerts', desc: 'Alert when station exceeds 80% capacity' },
            { key: 'trainDelays', label: 'Train Delay Notifications', desc: 'Notify when trains are delayed >5 minutes' },
            { key: 'systemUpdates', label: 'System Update Notices', desc: 'Maintenance windows and system updates' },
            { key: 'weeklyReport', label: 'Weekly Analytics Report', desc: 'Receive weekly performance summary email' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
              <div>
                <div className="text-white text-sm font-medium">{n.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{n.desc}</div>
              </div>
              <Toggle
                id={`toggle-${n.key}`}
                enabled={notifications[n.key]}
                onChange={toggleNotification(n.key)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* System Config */}
      <Section icon={Sliders} title="System Configuration">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Data Refresh Interval</label>
            <select
              id="setting-refresh"
              value={system.refreshInterval}
              onChange={(e) => setSystem((s) => ({ ...s, refreshInterval: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Timezone</label>
            <select
              id="setting-timezone"
              value={system.timezone}
              onChange={(e) => setSystem((s) => ({ ...s, timezone: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Language</label>
            <select
              id="setting-language"
              value={system.language}
              onChange={(e) => setSystem((s) => ({ ...s, language: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Crowd Alert Threshold</label>
            <select
              id="setting-threshold"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option>70% — Early Warning</option>
              <option>80% — Standard Alert</option>
              <option>90% — Critical Only</option>
            </select>
          </div>
        </div>
      </Section>

      {/* API Config */}
      <Section icon={Shield} title="API Configuration">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <Wifi size={16} className="text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Backend API</div>
              <div className="text-slate-400 text-xs font-mono mt-0.5">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              Connected
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <Globe size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">WebSocket (Real-time)</div>
              <div className="text-slate-400 text-xs font-mono mt-0.5">ws://localhost:8000/ws</div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400 border border-slate-600">
              Milestone 4
            </span>
          </div>
        </div>
      </Section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button id="save-settings" onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <><Check size={16} /> Saved!</> : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
