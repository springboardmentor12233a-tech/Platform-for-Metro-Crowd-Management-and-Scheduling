import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getProfile, updateProfile } from "../services/authService";

export default function Profile() {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const user = await getProfile();
                setForm(user);
            } catch (err) {
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await updateProfile(form);
            setForm(updated);
            toast.success("Profile updated successfully.");
        } catch (err) {
            const message =
                err?.response?.data?.detail || "Failed to update profile.";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }

    if (!form) {
        return <div className="profile-error">Unable to load profile.</div>;
    }

    return (
        <div className="profile-card">
            <h2>My Profile</h2>

            <div className="profile-avatar">👤</div>

            <label>
                Name
                <input
                    type="text"
                    value={form.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
            </label>

            <label>
                Email
                <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
            </label>

            <div className="profile-readonly">
                <div>
                    <span>Role</span>
                    <strong>{form.role}</strong>
                </div>
                <div>
                    <span>Joined</span>
                    <strong>
                        {form.created_at
                            ? new Date(form.created_at).toLocaleDateString()
                            : "—"}
                    </strong>
                </div>
                <div>
                    <span>Last Login</span>
                    <strong>
                        {form.last_login
                            ? new Date(form.last_login).toLocaleString()
                            : "Never"}
                    </strong>
                </div>
            </div>

            <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}