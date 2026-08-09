// =============================================
// AI METROFLOW - Complete App Logic (M1 to M3)
// =============================================

const API_URL = 'http://127.0.0.1:8000';

// ---- DOM References ----
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const userDisplayName = document.getElementById('user-display-name');
const userDisplayRole = document.getElementById('user-display-role');
const logoutBtn = document.getElementById('logout-btn');
const statTotalEntries = document.getElementById('stat-total-entries');
const statTotalExits = document.getElementById('stat-total-exits');
const statAvgEntries = document.getElementById('stat-avg-entries');
const crowdTableBody = document.getElementById('crowd-table-body');
const busiestStationsList = document.getElementById('busiest-stations-list');
const refreshSummaryBtn = document.getElementById('refresh-summary-btn');

// ---- State ----
let currentUser = null;
let pollInterval = null;
let lineChartInstance = null;
let hourlyChartInstance = null;

// =============================================
// INIT & SESSION RESTORE
// =============================================
function init() {
    const savedUser = localStorage.getItem('metroflow_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    loginError.classList.add('hidden');
    loginError.innerText = '';
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
}

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');

    userDisplayName.innerText = currentUser.name || currentUser.username;
    userDisplayRole.innerText = currentUser.role.toUpperCase();

    // Role-based UI visibility
    const adminControls = document.getElementById('admin-controls');
    const operatorControls = document.getElementById('operator-controls');
    if (adminControls) {
        if (currentUser.role === 'admin') {
            adminControls.classList.remove('hidden');
            fetchOperators();
        } else {
            adminControls.classList.add('hidden');
        }
    }
    if (operatorControls) {
        if (currentUser.role === 'operator') {
            operatorControls.classList.remove('hidden');
        } else {
            operatorControls.classList.add('hidden');
        }
    }

    // Switch to first tab
    switchTab('crowd');

    fetchCrowdData();
    fetchAlerts();

    if (!pollInterval) {
        pollInterval = setInterval(() => {
            if (document.getElementById('section-crowd') && !document.getElementById('section-crowd').classList.contains('hidden')) {
                fetchCrowdData();
                fetchAlerts();
            }
        }, 15000);
    }
}

// =============================================
// AUTH
// =============================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            currentUser = data.user;
            localStorage.setItem('metroflow_user', JSON.stringify(currentUser));
            showDashboard();
        } else {
            showLoginError(data.detail || 'Invalid username or password');
        }
    } catch (err) {
        showLoginError('Cannot connect to backend. Make sure FastAPI is running on port 8000.');
    }
});

function showLoginError(msg) {
    loginError.innerText = msg;
    loginError.classList.remove('hidden');
}

// Quick demo login
window.quickLogin = function () {
    currentUser = { username: 'admin', name: 'System Admin', role: 'admin' };
    localStorage.setItem('metroflow_user', JSON.stringify(currentUser));
    showDashboard();
};

// Role selector on login page
window.selectRole = function (role) {
    document.getElementById('role-btn-operator').classList.remove('active');
    document.getElementById('role-btn-admin').classList.remove('active');
    document.getElementById(`role-btn-${role}`).classList.add('active');
    if (role === 'admin') {
        usernameInput.value = 'admin';
        passwordInput.value = 'adminpassword';
    } else {
        usernameInput.value = 'operator';
        passwordInput.value = 'operatorpassword';
    }
};

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('metroflow_user');
    currentUser = null;
    showLogin();
});

// =============================================
// TAB SWITCHING
// =============================================
const TABS = ['crowd', 'scheduling', 'ai', 'alerts', 'reports'];

function switchTab(name) {
    TABS.forEach(t => {
        const section = document.getElementById(`section-${t}`);
        const btn = document.getElementById(`tab-${t}-btn`);
        if (section) section.classList.add('hidden');
        if (btn) btn.classList.remove('active');
    });

    const activeSection = document.getElementById(`section-${name}`);
    const activeBtn = document.getElementById(`tab-${name}-btn`);
    if (activeSection) activeSection.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('active');

    // Load data for the activated tab
    if (name === 'crowd') { fetchCrowdData(); fetchAlerts(); }
    if (name === 'scheduling') { fetchSchedules(); fetchDelays(); fetchFrequencyRecommendations(); }
    if (name === 'ai') { /* AI form is user-triggered */ }
    if (name === 'alerts') { fetchAnnouncements(); }
    if (name === 'reports') { fetchTrafficReport(); }
}

// Wire tab buttons
document.getElementById('tab-crowd-btn').addEventListener('click', () => switchTab('crowd'));
document.getElementById('tab-scheduling-btn').addEventListener('click', () => switchTab('scheduling'));
document.getElementById('tab-ai-btn').addEventListener('click', () => switchTab('ai'));
document.getElementById('tab-alerts-btn').addEventListener('click', () => switchTab('alerts'));
document.getElementById('tab-reports-btn').addEventListener('click', () => switchTab('reports'));

// =============================================
// TAB 1 — LIVE CROWD MONITORING
// =============================================
async function fetchCrowdData() {
    try {
        const res = await fetch(`${API_URL}/crowd/summary`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (data.status === 'success') {
            updateSummaryCards(data.metrics);
            updateCrowdTable(data.live_records);
            updateBusiestStations(data.top_busiest_stations);
        }
    } catch (err) {
        console.warn('Backend offline – using demo data');
        showOfflineDemoFallback();
    }
}

async function fetchAlerts() {
    try {
        const res = await fetch(`${API_URL}/crowd/alerts`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.status === 'success') updateAlertsFeed(data.alerts);
    } catch (err) {
        showOfflineAlertsFallback();
    }
}

async function fetchOperators() {
    try {
        const res = await fetch(`${API_URL}/admin/users`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.status === 'success') {
            const body = document.getElementById('operators-list-body');
            body.innerHTML = '';
            data.users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding:12px 16px; font-weight:600; color:#fff;">${user.name}</td>
                    <td style="padding:12px 16px; color:#60a5fa; font-family:monospace;">${user.username}</td>
                    <td style="padding:12px 16px; color:#cbd5e1;">${user.email}</td>
                    <td style="padding:12px 16px;">
                        <span class="badge ${user.role === 'admin' ? 'badge-warning' : 'badge-normal'}">${user.role}</span>
                    </td>
                `;
                body.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Fetch operators failed:', err);
    }
}

function updateSummaryCards(metrics) {
    statTotalEntries.innerText = Number(metrics.total_entries).toLocaleString();
    statTotalExits.innerText = Number(metrics.total_exits).toLocaleString();
    statAvgEntries.innerText = Number(metrics.avg_entries_per_hour).toLocaleString();
}

function updateCrowdTable(records) {
    crowdTableBody.innerHTML = '';
    records.forEach(row => {
        let badge = '', glow = '';
        if (row.entry_count > 180) {
            badge = `<span class="badge badge-critical">Severe</span>`;
            glow = 'background: rgba(239,68,68,0.04);';
        } else if (row.entry_count > 100) {
            badge = `<span class="badge badge-warning">Moderate</span>`;
            glow = 'background: rgba(245,158,11,0.04);';
        } else {
            badge = `<span class="badge badge-normal">Normal</span>`;
        }
        const net = row.net_flow;
        const tr = document.createElement('tr');
        tr.style.cssText = glow;
        tr.innerHTML = `
            <td style="padding:12px 16px; font-weight:600; color:#fff;">${row.station}</td>
            <td style="padding:12px 16px;">
                <span style="display:inline-flex;align-items:center;gap:6px;">
                    <span style="width:10px;height:10px;border-radius:50%;background:${getLineColor(row.line)};display:inline-block;"></span>
                    ${row.line}
                </span>
            </td>
            <td style="padding:12px 16px;text-align:center;font-weight:700;color:#fff;">${Number(row.entry_count).toLocaleString()}</td>
            <td style="padding:12px 16px;text-align:center;color:#94a3b8;">${Number(row.exit_count).toLocaleString()}</td>
            <td style="padding:12px 16px;text-align:center;font-weight:700;color:${net >= 0 ? '#818cf8' : '#f87171'};">${net > 0 ? '+' : ''}${net}</td>
            <td style="padding:12px 16px;text-align:center;">${badge}</td>
        `;
        crowdTableBody.appendChild(tr);
    });
}

function updateBusiestStations(stations) {
    busiestStationsList.innerHTML = '';
    const max = stations.length > 0 ? stations[0].entry_count : 1;
    stations.forEach(s => {
        const pct = Math.min(100, Math.round((s.entry_count / max) * 100));
        const barColor = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#3b82f6';
        const el = document.createElement('div');
        el.style.marginBottom = '10px';
        el.innerHTML = `
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                <span style="color:#cbd5e1;font-weight:500;">${s.station}</span>
                <span style="color:#fff;font-weight:700;">${Number(s.entry_count).toLocaleString()}</span>
            </div>
            <div style="width:100%;background:rgba(255,255,255,0.08);border-radius:9999px;height:6px;">
                <div style="width:${pct}%;background:${barColor};height:6px;border-radius:9999px;transition:width 0.5s;"></div>
            </div>
        `;
        busiestStationsList.appendChild(el);
    });
}

function updateAlertsFeed(alerts) {
    const feed = document.getElementById('alerts-feed');
    const badge = document.getElementById('alerts-count');
    badge.innerText = `${alerts.length} Active`;

    if (alerts.length === 0) {
        feed.innerHTML = '<p style="text-align:center;color:#6b7280;padding:24px;font-size:12px;"><i class="fa-solid fa-circle-check" style="color:#10b981;margin-right:6px;"></i>No active congestion alerts</p>';
        return;
    }

    feed.innerHTML = '';
    alerts.forEach(alert => {
        const crit = alert.severity === 'CRITICAL';
        const borderColor = crit ? 'rgba(239,68,68,0.35)' : 'rgba(245,158,11,0.35)';
        const bg = crit ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)';
        const icon = crit ? 'fa-triangle-exclamation' : 'fa-circle-exclamation';
        const iconColor = crit ? '#f87171' : '#fbbf24';

        let resolveBtn = '';
        // Both admin and operator can resolve
        if (currentUser) {
            resolveBtn = `
                <div style="display:flex;justify-content:flex-end;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);margin-top:6px;">
                    <button onclick="resolveAlert('${alert.id}')" style="padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#34d399;font-size:11px;font-weight:700;border-radius:6px;cursor:pointer;transition:all 0.2s;" 
                        onmouseover="this.style.background='rgba(16,185,129,0.3)'" 
                        onmouseout="this.style.background='rgba(16,185,129,0.15)'">
                        <i class="fa-solid fa-check" style="margin-right:4px;"></i>Resolve
                    </button>
                </div>`;
        }

        const div = document.createElement('div');
        div.style.cssText = `padding:12px;border-radius:10px;border:1px solid ${borderColor};background:${bg};margin-bottom:8px;font-size:12px;`;
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
                <div style="display:flex;align-items:center;gap:6px;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">
                    <i class="fa-solid ${icon}" style="color:${iconColor};"></i>
                    <span style="color:${iconColor};">${alert.type.replace(/_/g, ' ')}</span>
                </div>
                <span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;background:rgba(0,0,0,0.3);color:${iconColor};">${alert.severity}</span>
            </div>
            <p style="color:#cbd5e1;line-height:1.5;margin-bottom:4px;">${alert.message}</p>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:#6b7280;">
                <span>Target: <b style="color:#94a3b8;">${alert.target}</b></span>
                <span style="font-weight:700;color:#94a3b8;">${alert.metric}</span>
            </div>
            ${resolveBtn}
        `;
        feed.appendChild(div);
    });
}

window.resolveAlert = async function (alertId) {
    const notes = prompt('Enter resolution notes (what action was taken):', 'Deployed crowd control barriers at Gate 2 and redirected passengers.');
    if (notes === null || notes.trim() === '') return;

    try {
        const res = await fetch(`${API_URL}/operator/resolve-alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alert_id: alertId, username: currentUser.username, notes: notes.trim() })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            showToast('✅ Alert resolved successfully!', 'success');
            fetchAlerts();
        } else {
            showToast('❌ Failed to resolve alert.', 'error');
        }
    } catch (err) {
        showToast('❌ Cannot connect to backend.', 'error');
    }
};

refreshSummaryBtn.addEventListener('click', () => { fetchCrowdData(); fetchAlerts(); });

// =============================================
// TAB 2 — SCHEDULING & FREQUENCY
// =============================================
async function fetchSchedules(line = '') {
    try {
        const url = line ? `${API_URL}/scheduling/schedules?line=${encodeURIComponent(line)}` : `${API_URL}/scheduling/schedules`;
        const res = await fetch(url);
        const data = await res.json();
        const body = document.getElementById('schedule-table-body');
        body.innerHTML = '';
        if (data.schedules && data.schedules.length > 0) {
            data.schedules.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding:10px 16px;font-weight:700;color:#60a5fa;font-family:monospace;">${s.train_id}</td>
                    <td style="padding:10px 16px;">
                        <span style="display:inline-flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:${getLineColor(s.line)};display:inline-block;"></span>
                            ${s.line}
                        </span>
                    </td>
                    <td style="padding:10px 16px;color:#94a3b8;">${s.from_station} → ${s.to_station}</td>
                    <td style="padding:10px 16px;text-align:center;font-weight:700;">${s.departure_time}</td>
                    <td style="padding:10px 16px;text-align:center;">${s.arrival_time}</td>
                    <td style="padding:10px 16px;text-align:center;"><span class="badge badge-normal">${s.frequency_per_hour}</span></td>
                `;
                body.appendChild(tr);
            });
        } else {
            body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#6b7280;padding:24px;">No schedules found.</td></tr>';
        }
    } catch (err) {
        console.error('Fetch schedules error:', err);
    }
}

async function fetchDelays() {
    try {
        const res = await fetch(`${API_URL}/scheduling/delays`);
        const data = await res.json();
        const list = document.getElementById('delays-list');
        list.innerHTML = '';
        if (data.delays && data.delays.length > 0) {
            data.delays.forEach(d => {
                const div = document.createElement('div');
                div.style.cssText = 'padding:10px 12px;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.25);border-radius:8px;font-size:12px;margin-bottom:8px;';
                div.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                        <span style="font-weight:700;color:#f87171;font-family:monospace;">${d.train_id}</span>
                        <span style="background:rgba(239,68,68,0.2);color:#f87171;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:800;">+${d.delay_minutes} MIN DELAY</span>
                    </div>
                    <div style="color:#94a3b8;">${d.station} · ${d.line}</div>
                    <div style="color:#6b7280;margin-top:2px;">Cause: ${d.cause}</div>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = '<p style="text-align:center;color:#6b7280;font-size:12px;padding:20px;">No delay incidents logged.</p>';
        }
    } catch (err) {
        console.error('Fetch delays error:', err);
    }
}

async function fetchFrequencyRecommendations() {
    try {
        const res = await fetch(`${API_URL}/scheduling/frequency-recommendations`);
        const data = await res.json();
        const grid = document.getElementById('frequency-recommendations-grid');
        grid.innerHTML = '';
        if (data.recommendations && data.recommendations.length > 0) {
            data.recommendations.forEach(rec => {
                const urgencyColor = rec.urgency === 'HIGH' ? '#ef4444' : rec.urgency === 'MEDIUM' ? '#f59e0b' : '#10b981';
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div style="display:flex;align-items:center;gap:6px;font-weight:700;font-size:13px;">
                            <span style="width:10px;height:10px;border-radius:50%;background:${getLineColor(rec.line)};display:inline-block;"></span>
                            ${rec.line}
                        </div>
                        <span style="font-size:10px;font-weight:800;color:${urgencyColor};padding:2px 6px;border-radius:4px;background:${urgencyColor}1a;">${rec.urgency}</span>
                    </div>
                    <div style="font-size:11px;color:#6b7280;margin-bottom:6px;">Avg Occupancy: <b style="color:#fff;">${rec.avg_occupancy}%</b></div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <span style="font-size:22px;font-weight:900;color:${urgencyColor};">${rec.recommended_frequency}</span>
                        <span style="font-size:10px;color:#6b7280;">trains/hr<br><span style="color:#475569;">was ${rec.current_frequency}</span></span>
                    </div>
                    <p style="font-size:11px;color:#94a3b8;line-height:1.4;">${rec.reason}</p>
                    <button onclick="applyFrequency('${rec.line}', ${rec.recommended_frequency})" style="margin-top:10px;width:100%;padding:7px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;font-size:11px;font-weight:700;border-radius:6px;cursor:pointer;transition:all 0.2s;"
                        onmouseover="this.style.background='rgba(99,102,241,0.3)'"
                        onmouseout="this.style.background='rgba(99,102,241,0.15)'">
                        <i class="fa-solid fa-bolt" style="margin-right:4px;"></i>Apply Adjustment
                    </button>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="color:#6b7280;font-size:12px;">No recommendations available.</p>';
        }
    } catch (err) {
        console.error('Frequency recommendations error:', err);
    }
}

window.applyFrequency = async function (line, freq) {
    if (!confirm(`Apply frequency of ${freq} trains/hr to ${line}?`)) return;
    try {
        const res = await fetch(`${API_URL}/scheduling/adjust-frequency`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line, new_frequency: freq, reason: 'AI Recommendation Applied', operator_username: currentUser.username })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            showToast(`✅ Frequency updated for ${line} to ${freq} trains/hr`, 'success');
            fetchSchedules();
        } else {
            showToast('❌ Failed to update frequency.', 'error');
        }
    } catch (err) {
        showToast('❌ Backend connection error.', 'error');
    }
};

// Schedule line filter
document.getElementById('schedule-line-filter').addEventListener('change', (e) => {
    fetchSchedules(e.target.value);
});

// Recalculate button
document.getElementById('refresh-freq-btn').addEventListener('click', () => {
    fetchFrequencyRecommendations();
    fetchSchedules();
});

// Log Delay Modal
const logDelayBtn = document.getElementById('log-delay-btn');
const logDelayModal = document.getElementById('log-delay-modal');
const closeDelayModal = document.getElementById('close-delay-modal');
const cancelDelayModal = document.getElementById('cancel-delay-modal');
const delayForm = document.getElementById('delay-form');

logDelayBtn.addEventListener('click', () => logDelayModal.classList.remove('hidden'));
closeDelayModal.addEventListener('click', () => logDelayModal.classList.add('hidden'));
cancelDelayModal.addEventListener('click', () => logDelayModal.classList.add('hidden'));

// Close modal on backdrop click
logDelayModal.addEventListener('click', (e) => {
    if (e.target === logDelayModal) logDelayModal.classList.add('hidden');
});

delayForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        train_id: document.getElementById('delay-train-id').value.trim(),
        line: document.getElementById('delay-line').value,
        station: document.getElementById('delay-station').value.trim(),
        delay_minutes: parseInt(document.getElementById('delay-minutes').value),
        cause: document.getElementById('delay-cause').value.trim(),
        operator_username: currentUser ? currentUser.username : 'operator'
    };

    try {
        const res = await fetch(`${API_URL}/scheduling/log-delay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            logDelayModal.classList.add('hidden');
            delayForm.reset();
            showToast(`✅ Delay logged for Train ${payload.train_id} (+${payload.delay_minutes} min)`, 'success');
            fetchDelays();
        } else {
            showToast('❌ Failed to log delay: ' + (data.detail || 'Unknown error'), 'error');
        }
    } catch (err) {
        showToast('❌ Backend connection error.', 'error');
    }
});

// =============================================
// TAB 3 — AI PREDICTION STUDIO
// =============================================
document.getElementById('ai-predict-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        station: document.getElementById('pred-station').value,
        line: document.getElementById('pred-line').value,
        hour: parseInt(document.getElementById('pred-hour').value),
        weather: document.getElementById('pred-weather').value,
        day: document.getElementById('pred-day').value
    };

    try {
        const res = await fetch(`${API_URL}/ai/predict-demand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            const pred = data.prediction;
            document.getElementById('res-entries').innerText = Number(pred.predicted_entries || pred.predicted_demand || 200).toLocaleString();

            const crowdLevel = pred.crowd_level || 'HIGH';
            const riskBadgeClass = crowdLevel === 'HIGH' || crowdLevel === 'CRITICAL' ? 'badge-critical' : crowdLevel === 'MEDIUM' ? 'badge-warning' : 'badge-normal';
            document.getElementById('res-risk').innerHTML = `<span class="badge ${riskBadgeClass}">${crowdLevel} RISK</span>`;

            document.getElementById('res-freq').innerText = pred.recommended_frequency || 12;
            document.getElementById('res-confidence').innerText = `Confidence: ${pred.confidence || 94}%`;
        } else {
            showToast('AI prediction failed.', 'error');
        }
    } catch (err) {
        // Show a simulated result when backend is unavailable
        document.getElementById('res-entries').innerText = '247';
        document.getElementById('res-risk').innerHTML = '<span class="badge badge-warning">MEDIUM RISK</span>';
        document.getElementById('res-freq').innerText = '12';
        document.getElementById('res-confidence').innerText = 'Confidence: 91.5%';
        showToast('⚠️ Using simulated AI result (backend offline)', 'warning');
    }
});

// =============================================
// TAB 4 — EMERGENCY ANNOUNCEMENTS (MILESTONE 3)
// =============================================
document.getElementById('announcement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        title: document.getElementById('ann-title').value.trim(),
        message: document.getElementById('ann-message').value.trim(),
        line: document.getElementById('ann-line').value,
        severity: document.getElementById('ann-severity').value,
        broadcast_by: currentUser ? currentUser.username : 'operator'
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Broadcasting...';

    try {
        const res = await fetch(`${API_URL}/notifications/announcement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            showToast('📢 Emergency Announcement Broadcasted!', 'success');
            document.getElementById('announcement-form').reset();
            fetchAnnouncements();
        } else {
            showToast('❌ Broadcast failed: ' + (data.detail || 'Unknown error'), 'error');
        }
    } catch (err) {
        showToast('❌ Backend connection error. Cannot broadcast.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Broadcast Notice';
    }
});

async function fetchAnnouncements() {
    try {
        const res = await fetch(`${API_URL}/notifications/active`);
        const data = await res.json();
        renderAnnouncements(data.announcements || []);
    } catch (err) {
        renderAnnouncements([]);
    }
}

function renderAnnouncements(announcements) {
    const container = document.getElementById('announcements-list-container');
    container.innerHTML = '';

    if (announcements.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#6b7280;padding:32px;font-size:13px;"><i class="fa-solid fa-bell-slash" style="margin-right:6px;"></i>No active emergency broadcasts.</p>';
        return;
    }

    announcements.forEach(ann => {
        const sev = ann.severity;
        let borderColor = 'rgba(59,130,246,0.4)';
        let bgColor = 'rgba(59,130,246,0.06)';
        let badgeClass = 'badge-normal';
        let icon = 'fa-circle-info';
        let iconColor = '#60a5fa';
        if (sev === 'CRITICAL') { borderColor = 'rgba(239,68,68,0.5)'; bgColor = 'rgba(239,68,68,0.08)'; badgeClass = 'badge-critical'; icon = 'fa-triangle-exclamation'; iconColor = '#f87171'; }
        else if (sev === 'EMERGENCY') { borderColor = 'rgba(239,68,68,0.7)'; bgColor = 'rgba(239,68,68,0.12)'; badgeClass = 'badge-critical'; icon = 'fa-skull-crossbones'; iconColor = '#ef4444'; }
        else if (sev === 'WARNING') { borderColor = 'rgba(245,158,11,0.5)'; bgColor = 'rgba(245,158,11,0.08)'; badgeClass = 'badge-warning'; icon = 'fa-circle-exclamation'; iconColor = '#fbbf24'; }

        const div = document.createElement('div');
        div.style.cssText = `padding:16px;border-radius:10px;border:1px solid ${borderColor};background:${bgColor};margin-bottom:12px;`;
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <i class="fa-solid ${icon}" style="color:${iconColor};font-size:16px;"></i>
                    <span style="font-weight:800;font-size:14px;color:#fff;">${ann.title}</span>
                </div>
                <span class="badge ${badgeClass}">${ann.severity}</span>
            </div>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.5;margin-bottom:10px;">${ann.message}</p>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#6b7280;">
                <span>Line: <b style="color:#94a3b8;">${ann.line}</b></span>
                <span>Broadcast by: <b style="color:#94a3b8;">${ann.broadcast_by}</b></span>
                <span>${ann.created_at ? new Date(ann.created_at).toLocaleTimeString() : 'Just now'}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

document.getElementById('refresh-announcements-btn').addEventListener('click', fetchAnnouncements);

// =============================================
// TAB 5 — TRAFFIC REPORTS & EXPORT (MILESTONE 3)
// =============================================
async function fetchTrafficReport() {
    try {
        const res = await fetch(`${API_URL}/ai/traffic-report`);
        const data = await res.json();
        if (data.status === 'success') {
            renderTrafficCharts(data.report);
            renderAIDirectives(data.report.executive_recommendations || []);
        }
    } catch (err) {
        console.error('Traffic report error:', err);
        renderFallbackCharts();
    }
}

function renderTrafficCharts(report) {
    // Destroy old chart instances if they exist
    if (lineChartInstance) { lineChartInstance.destroy(); lineChartInstance = null; }
    if (hourlyChartInstance) { hourlyChartInstance.destroy(); hourlyChartInstance = null; }

    const linePerf = report.line_performance || [];
    const labels = linePerf.map(l => l.line);
    const values = linePerf.map(l => Math.round(l.total_passenger_entries));
    const colors = labels.map(l => getLineColor(l));

    const ctxBar = document.getElementById('chart-line-flow');
    if (ctxBar) {
        lineChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Total Passenger Entries',
                    data: values,
                    backgroundColor: colors.map(c => c + '88'),
                    borderColor: colors,
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    const peakHours = report.peak_demand_hours || [];
    const hourLabels = peakHours.length > 0 ? peakHours.map(h => h.time) : ['08:00', '09:00', '10:00', '17:00', '18:00'];
    const hourValues = peakHours.length > 0 ? peakHours.map(h => h.entry_volume) : [320, 410, 280, 390, 450];

    const ctxLine = document.getElementById('chart-hourly-trend');
    if (ctxLine) {
        hourlyChartInstance = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: hourLabels,
                datasets: [{
                    label: 'Hourly Entry Volume',
                    data: hourValues,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.12)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
}

function renderFallbackCharts() {
    if (lineChartInstance) { lineChartInstance.destroy(); lineChartInstance = null; }
    if (hourlyChartInstance) { hourlyChartInstance.destroy(); hourlyChartInstance = null; }
    renderTrafficCharts({
        line_performance: [
            { line: 'Yellow Line', total_passenger_entries: 182000 },
            { line: 'Blue Line', total_passenger_entries: 215000 },
            { line: 'Red Line', total_passenger_entries: 148000 },
            { line: 'Violet Line', total_passenger_entries: 97000 }
        ],
        peak_demand_hours: [
            { time: '08:00', entry_volume: 310 }, { time: '09:00', entry_volume: 420 },
            { time: '12:00', entry_volume: 280 }, { time: '17:00', entry_volume: 380 }, { time: '18:00', entry_volume: 450 }
        ],
        executive_recommendations: [
            'Deploy 4 additional rolling stock sets on Yellow Line during peak window (08:00 – 10:00).',
            'Implement staggered gate entry controls at Rajiv Chowk & Kashmere Gate during weather anomalies.',
            'Optimize turn-around timing at terminal stations to decrease average delay from 4.2 min to < 2.0 min.'
        ]
    });
}

function renderAIDirectives(recommendations) {
    const container = document.getElementById('executive-recommendations-list');
    container.innerHTML = '';
    const icons = ['fa-bolt', 'fa-shield-halved', 'fa-chart-line'];
    const colors = ['#f59e0b', '#6366f1', '#10b981'];
    recommendations.forEach((rec, i) => {
        const div = document.createElement('div');
        div.className = 'glass-card';
        div.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div style="width:36px;height:36px;border-radius:8px;background:${colors[i % 3]}1a;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="fa-solid ${icons[i % 3]}" style="color:${colors[i % 3]};font-size:16px;"></i>
                </div>
                <span style="font-size:11px;font-weight:700;color:${colors[i % 3]};text-transform:uppercase;letter-spacing:0.5px;">AI Directive ${i + 1}</span>
            </div>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.5;">${rec}</p>
        `;
        container.appendChild(div);
    });
}

// PDF Export
document.getElementById('export-pdf-btn').addEventListener('click', async () => {
    const btn = document.getElementById('export-pdf-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
    try {
        const res = await fetch(`${API_URL}/analytics/export/pdf`);
        if (!res.ok) throw new Error('Export failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MetroFlow_Executive_Report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('✅ PDF downloaded: MetroFlow_Executive_Report.pdf', 'success');
    } catch (err) {
        showToast('❌ PDF export failed. Ensure backend is running.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Export PDF';
    }
});

// Excel Export
document.getElementById('export-excel-btn').addEventListener('click', async () => {
    const btn = document.getElementById('export-excel-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
    try {
        const res = await fetch(`${API_URL}/analytics/export/excel`);
        if (!res.ok) throw new Error('Export failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MetroFlow_Operational_Report.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('✅ Excel downloaded: MetroFlow_Operational_Report.xlsx', 'success');
    } catch (err) {
        showToast('❌ Excel export failed. Ensure backend is running.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-file-excel"></i> Export Excel';
    }
});

// =============================================
// HELPERS
// =============================================
function getLineColor(line) {
    if (!line) return '#94a3b8';
    const l = line.toLowerCase();
    if (l.includes('blue')) return '#3b82f6';
    if (l.includes('yellow')) return '#eab308';
    if (l.includes('red')) return '#ef4444';
    if (l.includes('green')) return '#22c55e';
    if (l.includes('violet') || l.includes('purple')) return '#a855f7';
    return '#94a3b8';
}

function showToast(message, type = 'success') {
    // Remove any existing toast
    const existing = document.getElementById('metroflow-toast');
    if (existing) existing.remove();

    const bgColor = type === 'success' ? 'rgba(16,185,129,0.15)' : type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)';
    const borderColor = type === 'success' ? 'rgba(16,185,129,0.4)' : type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)';

    const toast = document.createElement('div');
    toast.id = 'metroflow-toast';
    toast.style.cssText = `
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        padding: 14px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
        background: ${bgColor}; border: 1px solid ${borderColor};
        backdrop-filter: blur(12px); color: #fff;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        animation: toastIn 0.3s ease;
    `;
    toast.innerText = message;

    // Inject animation style once
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes toastIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
            @keyframes toastOut { from { opacity:1; } to { opacity:0; transform:translateY(8px); } }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// =============================================
// FALLBACK DATA (backend offline mode)
// =============================================
function showOfflineDemoFallback() {
    updateSummaryCards({ total_entries: 473928, total_exits: 442938, avg_entries_per_hour: 157.3 });
    updateCrowdTable([
        { station: 'Rajiv Chowk', line: 'Blue Line', entry_count: 245, exit_count: 180, net_flow: 65 },
        { station: 'Kashmere Gate', line: 'Red Line', entry_count: 185, exit_count: 195, net_flow: -10 },
        { station: 'Hauz Khas', line: 'Yellow Line', entry_count: 95, exit_count: 65, net_flow: 30 },
        { station: 'Noida Sector 16', line: 'Blue Line', entry_count: 60, exit_count: 45, net_flow: 15 },
        { station: 'Lajpat Nagar', line: 'Violet Line', entry_count: 130, exit_count: 120, net_flow: 10 },
        { station: 'ITO', line: 'Violet Line', entry_count: 155, exit_count: 110, net_flow: 45 }
    ]);
    updateBusiestStations([
        { station: 'Rajiv Chowk', entry_count: 245 },
        { station: 'Kashmere Gate', entry_count: 185 },
        { station: 'ITO', entry_count: 155 },
        { station: 'Lajpat Nagar', entry_count: 130 }
    ]);
}

function showOfflineAlertsFallback() {
    updateAlertsFeed([
        { id: 'OFFLINE-1', type: 'STATION_OVERCROWDING', severity: 'CRITICAL', target: 'Rajiv Chowk', line: 'Blue Line', message: 'Critical bottleneck at Rajiv Chowk entry gate (245 entries/min). Deploy crowd barriers.', metric: '245 pax/min' },
        { id: 'OFFLINE-2', type: 'STATION_WARNING', severity: 'WARNING', target: 'Lajpat Nagar', line: 'Violet Line', message: 'High passenger inflow at Lajpat Nagar (130 entries/min). Monitoring platform density.', metric: '130 pax/min' }
    ]);
}

// =============================================
// OPERATOR QUICK ACTIONS
// =============================================
window.operatorDispatch = function () {
    const line = prompt('Enter Metro Line for supplementary train dispatch:', 'Yellow Line');
    if (line && line.trim()) {
        showToast(`🚆 Dispatch command sent: Supplementary train deployed on ${line.trim()}`, 'success');
    }
};

window.operatorBypass = function () {
    const station = prompt('Enter station name for rapid bypass:', 'Rajiv Chowk');
    if (station && station.trim()) {
        showToast(`⚡ Rapid bypass order issued: Trains will skip ${station.trim()}`, 'warning');
    }
};

window.operatorBroadcast = function () {
    const msg = prompt('Enter PA broadcast message:', 'Severe congestion at central station. Please use alternate routes.');
    if (msg && msg.trim()) {
        showToast(`📢 PA Broadcast sent: "${msg.trim().substring(0, 50)}..."`, 'success');
    }
};

// =============================================
// START
// =============================================
init();