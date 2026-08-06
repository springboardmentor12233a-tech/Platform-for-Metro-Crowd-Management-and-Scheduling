// Global MetroFlow JavaScript Helper

const API_BASE = '/api';
let currentUser = null;

// Auth Check on page load
async function checkAuth(requiresRole = null) {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, { cache: 'no-store' });
        const data = await res.json();

        if (data.authenticated && data.user) {
            currentUser = data.user;
            renderUserBadge(currentUser);

            if (requiresRole && currentUser.role !== requiresRole && currentUser.role !== 'admin') {
                showToast('Access Restricted: Admin or Operator privileges required.', 'error');
                setTimeout(() => window.location.href = '/index.html', 1500);
            }
        } else {
            // Redirect to login if on protected page
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/login.html';
            }
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
}

// Render User Pill in Header
function renderUserBadge(user) {
    const container = document.getElementById('user-badge-container');
    if (!container) return;

    const roleClass = user.role === 'admin' ? 'role-admin' : 'role-operator';
    container.innerHTML = `
        <div class="user-badge">
            <span style="font-weight: 600; font-size: 0.88rem;">👤 ${user.full_name}</span>
            <span class="role-pill ${roleClass}">${user.role}</span>
            <button onclick="handleLogout()" class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">Logout</button>
        </div>
    `;
}

// Logout Handler
async function handleLogout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        showToast('Logged out successfully', 'info');
        setTimeout(() => window.location.href = '/login.html', 800);
    } catch (err) {
        console.error("Logout error:", err);
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'card';
    
    let borderColor = 'var(--accent-blue)';
    if (type === 'error') borderColor = 'var(--accent-rose)';
    if (type === 'success') borderColor = 'var(--accent-emerald)';

    toast.style.cssText = `
        padding: 0.85rem 1.25rem;
        border-left: 4px solid ${borderColor};
        min-width: 280px;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: slideIn 0.3s ease-out;
    `;
    toast.innerHTML = `<strong>${type.toUpperCase()}</strong>: ${message}`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Poll Active Overcrowding Alerts for Top Banner
async function pollActiveAlerts() {
    const bannerContainer = document.getElementById('top-alert-banner');
    if (!bannerContainer) return;

    try {
        const res = await fetch(`${API_BASE}/alerts?status=Active`);
        const data = await res.json();

        if (data.alerts && data.alerts.length > 0) {
            const criticalAlerts = data.alerts.filter(a => a.severity === 'Critical' || a.severity === 'High');
            if (criticalAlerts.length > 0) {
                const latest = criticalAlerts[0];
                bannerContainer.innerHTML = `
                    <div class="alert-banner-bar">
                        <span>🚨 <strong>${latest.severity.toUpperCase()} ALERT:</strong> ${latest.message}</span>
                        <a href="/stations.html" class="btn btn-secondary btn-sm" style="background: rgba(0,0,0,0.4); color: #fff;">View Stations</a>
                    </div>
                `;
            } else {
                bannerContainer.innerHTML = '';
            }
        } else {
            bannerContainer.innerHTML = '';
        }
    } catch (err) {
        console.error("Alert polling error:", err);
    }
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('login.html')) {
        checkAuth();
        pollActiveAlerts();
        setInterval(pollActiveAlerts, 10000); // Poll every 10 seconds
    }
});
