import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Settings, User, KeyRound, Palette, BellRing, CheckCircle, ShieldAlert } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  // Notification Control state
  const [flashingAlerts, setFlashingAlerts] = useState(user?.settings?.notifications ?? true);

  const handleToggleNotifications = async () => {
    const nextVal = !flashingAlerts;
    setFlashingAlerts(nextVal);
    try {
      await updateProfile({
        settings: {
          theme: user?.settings?.theme || 'dark',
          language: user?.settings?.language || 'en',
          notifications: nextVal
        }
      });
    } catch (err) {
      console.error("Failed to update notification settings:", err);
      setFlashingAlerts(!nextVal); // Rollback
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile({ name, email });
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.detail || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');
    try {
      await api.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPassSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPassError(err.response?.data?.detail || 'Failed to change password.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Settings className="text-blue-500" />
          <span>Account Settings</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Manage your operator profile details, secure access password, and console theme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Details Edit */}
        <GlassmorphicCard className="space-y-4" hoverEffect={false}>
          <h3 className="font-bold text-base flex items-center gap-2 border-b pb-2">
            <User size={16} className="text-blue-500" />
            <span>Profile Details</span>
          </h3>

          {profileSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-200 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={14} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold rounded-xl flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-500">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border"
              />
            </div>

            <button type="submit" className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide active:scale-[0.98] transition-all">
              Save Changes
            </button>
          </form>
        </GlassmorphicCard>

        {/* Change Password */}
        <GlassmorphicCard className="space-y-4" hoverEffect={false}>
          <h3 className="font-bold text-base flex items-center gap-2 border-b pb-2">
            <KeyRound size={16} className="text-blue-500" />
            <span>Security & Password</span>
          </h3>

          {passSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-200 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={14} />
              <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold rounded-xl flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-500">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500">New Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border"
              />
            </div>

            <button type="submit" className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide active:scale-[0.98] transition-all">
              Update Password
            </button>
          </form>
        </GlassmorphicCard>

        {/* Console styling theme config */}
        <GlassmorphicCard className="space-y-4" hoverEffect={false}>
          <h3 className="font-bold text-base flex items-center gap-2 border-b pb-2">
            <Palette size={16} className="text-blue-500" />
            <span>Console Theme</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select standard light or glassmorphism dark theme parameters for operations viewing.
          </p>

          <div className="flex gap-4 pt-2 text-xs font-bold">
            <button 
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 ${
                !isDark ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}
            >
              Light Mode
            </button>
            <button 
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 ${
                isDark ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-200 bg-slate-100 text-slate-500'
              }`}
            >
              Dark Mode (Glass)
            </button>
          </div>
        </GlassmorphicCard>

        {/* Notifications Preferences */}
        <GlassmorphicCard className="space-y-4" hoverEffect={false}>
          <h3 className="font-bold text-base flex items-center gap-2 border-b pb-2">
            <BellRing size={16} className="text-blue-500" />
            <span>Notification Controls</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure system audio triggers or flashing highlights for new alert logs.
          </p>
          <div className="flex justify-between items-center text-xs font-semibold pt-2">
            <span>Critical alerts flashing toasts</span>
            <button 
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-all duration-300 ${
                flashingAlerts ? 'bg-violet-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </button>
          </div>
        </GlassmorphicCard>

      </div>
    </div>
  );
};

export default SettingsPage;
