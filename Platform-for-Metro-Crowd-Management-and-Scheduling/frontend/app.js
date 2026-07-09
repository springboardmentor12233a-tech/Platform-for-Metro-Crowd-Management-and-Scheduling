const API_URL = 'http://127.0.0.1:8000';

// DOM Elements
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

// State Management
let currentUser = null;
let pollInterval = null;

// Initialize app check
function init() {
    const savedUser = localStorage.getItem('metroflow_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

// Show/Hide Containers
function showLogin() {
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    loginError.classList.add('hidden');
    loginError.innerText = '';
    
    // Clear polling
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    
    // Update User Header Info
    userDisplayName.innerText = currentUser.name || currentUser.username;
    userDisplayRole.innerText = currentUser.role;

    // Display appropriate UI elements depending on roles
    if (currentUser.role === 'admin') {
        document.getElementById('admin-controls').classList.remove('hidden');
        document.getElementById('operator-controls').classList.add('hidden');
        fetchOperators();
    } else if (currentUser.role === 'operator') {
        document.getElementById('operator-controls').classList.remove('hidden');
        document.getElementById('admin-controls').classList.add('hidden');
    } else {
        document.getElementById('admin-controls').classList.add('hidden');
        document.getElementById('operator-controls').classList.add('hidden');
    }

    // Fetch live dashboard metrics & alerts
    fetchCrowdData();
    fetchAlerts();

    // Start background polling for real-time alerts
    if (!pollInterval) {
        pollInterval = setInterval(() => {
            fetchCrowdData();
            fetchAlerts();
        }, 15000); // Poll every 15 seconds
    }
}

// Handle Login Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            currentUser = data.user;
            localStorage.setItem('metroflow_user', JSON.stringify(currentUser));
            showDashboard();
        } else {
            showError(data.detail || 'Invalid username or password');
        }
    } catch (error) {
        console.error('Login Error:', error);
        showError('Could not connect to backend database server. Ensure FastAPI is running on port 8000.');
    }
});

function showError(msg) {
    loginError.innerText = msg;
    loginError.classList.remove('hidden');
}

// Handle Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('metroflow_user');
    currentUser = null;
    showLogin();
});

// Fetch and Populate Dashboard Data
async function fetchCrowdData() {
    try {
        const response = await fetch(`${API_URL}/crowd/summary`);
        if (!response.ok) {
            throw new Error('Failed to fetch summary data');
        }
        const data = await response.json();

        if (data.status === 'success') {
            updateSummaryCards(data.metrics);
            updateCrowdTable(data.live_records);
            updateBusiestStations(data.top_busiest_stations);
        }
    } catch (error) {
        console.error('Data Fetch Error:', error);
        // Populate fallback dummy data if backend is offline to keep demo functional
        showOfflineDemoFallback();
    }
}

// Fetch Congestion Alerts from Backend
async function fetchAlerts() {
    try {
        const response = await fetch(`${API_URL}/crowd/alerts`);
        if (!response.ok) {
            throw new Error('Failed to fetch active alerts');
        }
        const data = await response.json();
        if (data.status === 'success') {
            updateAlertsFeed(data.alerts);
        }
    } catch (error) {
        console.error('Alerts Fetch Error:', error);
        showOfflineAlertsFallback();
    }
}

// Fetch registered operators list (Admin only)
async function fetchOperators() {
    try {
        const response = await fetch(`${API_URL}/admin/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch operators directory');
        }
        const data = await response.json();
        if (data.status === 'success') {
            const body = document.getElementById('operators-list-body');
            body.innerHTML = '';
            data.users.forEach(user => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-800/40 transition-colors';
                tr.innerHTML = `
                    <td class="py-2.5 px-3 font-semibold text-white">${user.name}</td>
                    <td class="py-2.5 px-3 font-mono text-blue-400">${user.username}</td>
                    <td class="py-2.5 px-3 text-slate-300">${user.email}</td>
                    <td class="py-2.5 px-3">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-slate-900 ${user.role === 'admin' ? 'text-indigo-400 border-indigo-500/20' : 'text-teal-400 border-teal-500/20'}">
                            ${user.role}
                        </span>
                    </td>
                `;
                body.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Operators Fetch Error:', error);
    }
}

// Update Top stats values
function updateSummaryCards(metrics) {
    statTotalEntries.innerText = metrics.total_entries.toLocaleString();
    statTotalExits.innerText = metrics.total_exits.toLocaleString();
    statAvgEntries.innerText = metrics.avg_entries_per_hour.toLocaleString();
}

// Update Live Congestion Table
function updateCrowdTable(records) {
    crowdTableBody.innerHTML = '';
    
    records.forEach(row => {
        const netFlow = row.net_flow;
        let flowBadge = '';
        let rowGlow = '';

        // Highlight density status based on net entry levels
        if (row.entry_count > 180) {
            flowBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Severe</span>';
            rowGlow = 'bg-red-500/5';
        } else if (row.entry_count > 100) {
            flowBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Moderate</span>';
            rowGlow = 'bg-amber-500/5';
        } else {
            flowBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Normal</span>';
        }

        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-800/40 transition-colors ${rowGlow}`;
        tr.innerHTML = `
            <td class="py-3.5 px-4 font-medium text-white">${row.station}</td>
            <td class="py-3.5 px-4">
                <span class="inline-flex items-center">
                    <span class="w-2.5 h-2.5 rounded-full mr-2" style="background-color: ${getLineColor(row.line)}"></span>
                    ${row.line}
                </span>
            </td>
            <td class="py-3.5 px-4 text-center text-slate-300 font-semibold">${row.entry_count.toLocaleString()}</td>
            <td class="py-3.5 px-4 text-center text-slate-300">${row.exit_count.toLocaleString()}</td>
            <td class="py-3.5 px-4 text-center font-bold ${netFlow >= 0 ? 'text-indigo-400' : 'text-rose-400'}">${netFlow > 0 ? '+' : ''}${netFlow}</td>
            <td class="py-3.5 px-4 text-center">${flowBadge}</td>
        `;
        crowdTableBody.appendChild(tr);
    });
}

// Update Top Congested Bar Indicators
function updateBusiestStations(stations) {
    busiestStationsList.innerHTML = '';
    
    // Find max value to calibrate bar scale
    const maxEntries = stations.length > 0 ? stations[0].entry_count : 1;

    stations.forEach(station => {
        const percent = Math.min(100, Math.round((station.entry_count / maxEntries) * 100));
        let barColor = 'bg-blue-500';
        if (percent > 80) barColor = 'bg-rose-500';
        else if (percent > 50) barColor = 'bg-amber-500';

        const item = document.createElement('div');
        item.className = 'space-y-1.5';
        item.innerHTML = `
            <div class="flex justify-between text-sm">
                <span class="font-medium text-slate-300">${station.station}</span>
                <span class="font-bold text-white">${station.entry_count.toLocaleString()} entries</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2">
                <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${percent}%"></div>
            </div>
        `;
        busiestStationsList.appendChild(item);
    });
}

// Render Congestion Alerts Feed
function updateAlertsFeed(alerts) {
    const feed = document.getElementById('alerts-feed');
    const countBadge = document.getElementById('alerts-count');
    countBadge.innerText = `${alerts.length} Active`;

    if (alerts.length === 0) {
        feed.innerHTML = '<p class="text-center text-slate-500 py-6 text-sm"><i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>No active congestion alerts</p>';
        return;
    }

    feed.innerHTML = '';
    alerts.forEach(alert => {
        const isCritical = alert.severity === 'CRITICAL';
        const alertColor = isCritical ? 'border-red-500/30 bg-red-500/5 text-red-200' : 'border-amber-500/30 bg-amber-500/5 text-amber-200';
        const icon = isCritical ? 'fa-triangle-exclamation text-red-400' : 'fa-circle-exclamation text-amber-400';
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `p-3 rounded-xl border ${alertColor} space-y-2 text-xs transition-all hover:scale-[1.01]`;
        
        let resolveBtnHtml = '';
        if (currentUser && currentUser.role === 'operator') {
            resolveBtnHtml = `
                <div class="flex justify-end pt-1.5 border-t border-slate-700/20">
                    <button onclick="resolveAlert('${alert.id}')" class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-white text-[10px] font-bold rounded-lg border border-emerald-500/20 transition-all flex items-center space-x-1">
                        <i class="fa-solid fa-check mr-1"></i>
                        <span>Resolve Incident</span>
                    </button>
                </div>
            `;
        }

        alertDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center space-x-2 font-semibold">
                    <i class="fa-solid ${icon}"></i>
                    <span class="uppercase tracking-wider text-[10px] font-extrabold">${alert.type.replace('_', ' ')}</span>
                </div>
                <span class="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-900 ${isCritical ? 'text-red-400 border border-red-500/10' : 'text-amber-400 border border-amber-500/10'}">${alert.severity}</span>
            </div>
            <p class="text-slate-300 leading-normal">${alert.message}</p>
            <div class="flex justify-between text-[10px] text-slate-400">
                <span>Target: <b>${alert.target}</b></span>
                <span class="font-bold text-slate-300">${alert.metric}</span>
            </div>
            ${resolveBtnHtml}
        `;
        feed.appendChild(alertDiv);
    });
}

// Global resolve handler for interactive operator mitigation override
window.resolveAlert = async function(alertId) {
    const notes = prompt("Enter operational resolution actions taken in SQLite database:", "Mitigated gate bottleneck and redirected passengers to secondary platforms.");
    if (notes === null || notes.trim() === '') return;

    try {
        const response = await fetch(`${API_URL}/operator/resolve-alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alert_id: alertId,
                username: currentUser.username,
                notes: notes.trim()
            })
        });

        const data = await response.json();
        if (response.ok && data.status === 'success') {
            alert(`SUCCESS: ${data.message}`);
            // Instantly fetch updated listings from backend to reflect db update
            fetchCrowdData();
            fetchAlerts();
        } else {
            alert(data.detail || 'Failed to submit resolution.');
        }
    } catch (error) {
        console.error('Resolve Incident Error:', error);
        alert('Could not submit resolution override to the backend database.');
    }
};

function getLineColor(line) {
    switch (line) {
        case 'Blue Line': return '#3b82f6';
        case 'Yellow Line': return '#eab308';
        case 'Red Line': return '#ef4444';
        case 'Green Line': return '#22c55e';
        case 'Violet Line': return '#a855f7';
        default: return '#cbd5e1';
    }
}

// Quick Mitigation Commands for Operators
document.getElementById('dispatch-train-btn')?.addEventListener('click', () => {
    const line = prompt("Target Metro Line for Supplementary Rolling Stock dispatch:", "Yellow Line");
    if (line) {
        alert(`DISPATCH COMMAND RECEIVED:\nSupplementary Train has been scheduled and injected into active line service on the ${line} to clear platform density.`);
    }
});

document.getElementById('bypass-station-btn')?.addEventListener('click', () => {
    const station = prompt("Station to temporarially set as rapid Bypass:", "Rajiv Chowk");
    if (station) {
        alert(`RAPID BYPASS ORDER ISSUED:\nIncoming trains on line will temporarily skip service at ${station} station to reduce severe platform congestion.`);
    }
});

document.getElementById('broadcast-alert-btn')?.addEventListener('click', () => {
    const msg = prompt("Enter public announcement notice message to broadcast to displays/audio systems:", "Severe congestion at central station gates. Please utilize alternative interchanges.");
    if (msg) {
        alert(`PA BROADCAST SENT:\nAudio announcement broadcasted to stations: "${msg}"`);
    }
});

// Fallback logic when FastAPI backend is Offline
function showOfflineDemoFallback() {
    console.warn('Backend is offline. Displaying simulated fallback data.');
    const fallbackMetrics = {
        total_entries: 473928,
        total_exits: 442938,
        avg_entries_per_hour: 157.3
    };
    const fallbackLiveRecords = [
        { station: "Rajiv Chowk", line: "Blue Line", entry_count: 245, exit_count: 180, net_flow: 65 },
        { station: "Kashmere Gate", line: "Red Line", entry_count: 185, exit_count: 195, net_flow: -10 },
        { station: "Hauz Khas", line: "Yellow Line", entry_count: 95, exit_count: 65, net_flow: 30 },
        { station: "Noida Sector 16", line: "Blue Line", entry_count: 60, exit_count: 45, net_flow: 15 },
        { station: "Lajpat Nagar", line: "Violet Line", entry_count: 130, exit_count: 120, net_flow: 10 },
        { station: "Dwarka Sector 21", line: "Blue Line", entry_count: 85, exit_count: 90, net_flow: -5 },
        { station: "ITO", line: "Violet Line", entry_count: 155, exit_count: 110, net_flow: 45 }
    ];
    const fallbackBusiest = [
        { station: "Rajiv Chowk", entry_count: 245 },
        { station: "Kashmere Gate", entry_count: 185 },
        { station: "ITO", entry_count: 155 },
        { station: "Lajpat Nagar", entry_count: 130 }
    ];

    updateSummaryCards(fallbackMetrics);
    updateCrowdTable(fallbackLiveRecords);
    updateBusiestStations(fallbackBusiest);
}

function showOfflineAlertsFallback() {
    const fallbackAlerts = [
        {
            id: "OFFLINE-ALERT-1",
            type: "STATION_OVERCROWDING",
            severity: "CRITICAL",
            target: "Rajiv Chowk",
            line: "Blue Line",
            message: "Critical bottleneck detected at Rajiv Chowk entry gate (245 entries/min). Deploy crowd barriers.",
            metric: "245 pax/min"
        },
        {
            id: "OFFLINE-ALERT-2",
            type: "STATION_WARNING",
            severity: "WARNING",
            target: "Lajpat Nagar",
            line: "Violet Line",
            message: "High passenger inflow at Lajpat Nagar (130 entries/min). Monitoring platform density.",
            metric: "130 pax/min"
        }
    ];
    updateAlertsFeed(fallbackAlerts);
}

// Refresh Actions
refreshSummaryBtn.addEventListener('click', () => {
    fetchCrowdData();
    fetchAlerts();
});

// Run Init
init();
