import { useEffect, useState } from "react";
import {
    User,
    Bell,
    Shield,
    Save,
    RefreshCw,
} from "lucide-react";

import {
    getSettings,
    updateSettings,
} from "../services/settingsService";

export default function Settings() {
    const [settings, setSettings] = useState({
        full_name: "",
        email: "",
        username: "",
        email_notifications: true,
        browser_notifications: true,
        alert_notifications: true,
        prediction_notifications: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            setError("");

            const response = await getSettings();

            console.log("Settings API response:", response);

            if (response) {
                setSettings((previous) => ({
                    ...previous,
                    ...response,
                }));
            }
        } catch (err) {
            console.error("Failed to load settings:", err);

            setError(
                err?.response?.data?.detail ||
                "Could not load settings from the server."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSave() {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await updateSettings(settings);

            console.log("Settings update response:", response);

            if (response) {
                setSettings((previous) => ({
                    ...previous,
                    ...response,
                }));
            }

            setMessage("Settings saved successfully.");
        } catch (err) {
            console.error("Failed to save settings:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to save settings."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        System Settings
                    </h1>

                    <p className="text-slate-400 mt-1">
                        Manage your account and notification preferences
                    </p>
                </div>

                <button
                    onClick={loadSettings}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                >
                    <RefreshCw size={18} />

                    Refresh
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
                    {error}
                </div>
            )}

            {/* Success */}
            {message && (
                <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-green-300">
                    {message}
                </div>
            )}

            {/* Account Settings */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">

                <div className="flex items-center gap-3 mb-6">

                    <div className="p-3 rounded-lg bg-blue-500/10">
                        <User
                            size={22}
                            className="text-blue-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Account Information
                        </h2>

                        <p className="text-sm text-slate-400">
                            Your information is loaded from the database.
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            value={settings.full_name || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={settings.username || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white"
                        />
                    </div>

                    <div className="md:col-span-2">

                        <label className="block text-sm text-slate-400 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={settings.email || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white"
                        />

                    </div>

                </div>

            </div>

            {/* Notification Settings */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">

                <div className="flex items-center gap-3 mb-6">

                    <div className="p-3 rounded-lg bg-purple-500/10">
                        <Bell
                            size={22}
                            className="text-purple-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Notification Settings
                        </h2>

                        <p className="text-sm text-slate-400">
                            Choose which notifications you want to receive.
                        </p>
                    </div>

                </div>

                <div className="space-y-4">

                    <SettingToggle
                        name="email_notifications"
                        title="Email Notifications"
                        description="Receive important system notifications by email."
                        checked={settings.email_notifications}
                        onChange={handleChange}
                    />

                    <SettingToggle
                        name="browser_notifications"
                        title="Browser Notifications"
                        description="Show notifications inside the web application."
                        checked={settings.browser_notifications}
                        onChange={handleChange}
                    />

                    <SettingToggle
                        name="alert_notifications"
                        title="Operational Alerts"
                        description="Receive alerts about metro operations."
                        checked={settings.alert_notifications}
                        onChange={handleChange}
                    />

                    <SettingToggle
                        name="prediction_notifications"
                        title="Prediction Notifications"
                        description="Receive notifications about prediction results."
                        checked={settings.prediction_notifications}
                        onChange={handleChange}
                    />

                </div>

            </div>

            {/* Save */}
            <div className="flex justify-end">

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold disabled:opacity-50"
                >

                    <Save size={18} />

                    {saving ? "Saving..." : "Save Settings"}

                </button>

            </div>

            {loading && (
                <p className="text-sm text-slate-500">
                    Loading settings from database...
                </p>
            )}

        </div>
    );
}


function SettingToggle({
    name,
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <label className="flex items-center justify-between gap-4 p-4 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer">

            <div>

                <h3 className="text-white font-semibold">
                    {title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                    {description}
                </p>

            </div>

            <input
                type="checkbox"
                name={name}
                checked={Boolean(checked)}
                onChange={onChange}
                className="w-5 h-5 accent-cyan-500"
            />

        </label>
    );
}