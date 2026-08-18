// Dashboard Management JS

let overviewChart = null;

async function loadDashboardData() {
    try {
        const res = await fetch(`${API_BASE}/stations`);
        const data = await res.json();

        if (data.summary) {
            document.getElementById('stat-total-inflow').textContent = data.summary.total_inflow.toLocaleString();
            document.getElementById('stat-avg-density').textContent = `${data.summary.avg_density}%`;
            document.getElementById('stat-critical-count').textContent = data.summary.critical_count;
            document.getElementById('stat-total-capacity').textContent = data.summary.total_capacity.toLocaleString();
        }

        if (data.stations) {
            renderDashboardStationTable(data.stations);
            renderDashboardChart(data.stations);
        }

        loadActiveAlertsList();
    } catch (err) {
        console.error("Failed to load dashboard data:", err);
        showToast("Failed to load real-time station metrics.", "error");
    }
}

function renderDashboardStationTable(stations) {
    const tbody = document.getElementById('dashboard-stations-tbody');
    if (!tbody) return;

    tbody.innerHTML = stations.map(st => {
        let statusClass = `status-${st.status.toLowerCase()}`;
        let meterClass = `meter-${st.status.toLowerCase()}`;
        
        return `
            <tr>
                <td><strong>${st.station_code}</strong></td>
                <td><strong style="font-size:0.95rem;">${st.name}</strong></td>
                <td><span style="color:var(--text-muted);">${st.line}</span></td>
                <td>${st.current_inflow.toLocaleString()} / ${st.capacity.toLocaleString()}</td>
                <td style="width: 200px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:2px;">
                        <span>Density</span>
                        <strong>${st.current_density}%</strong>
                    </div>
                    <div class="meter-container">
                        <div class="meter-fill ${meterClass}" style="width: ${Math.min(100, st.current_density)}%;"></div>
                    </div>
                </td>
                <td><span class="status-badge ${statusClass}">${st.status}</span></td>
                <td>
                    <a href="/stations.html?id=${st.id}" class="btn btn-secondary btn-sm">Monitor</a>
                </td>
            </tr>
        `;
    }).join('');
}

async function loadActiveAlertsList() {
    const listEl = document.getElementById('active-alerts-list');
    if (!listEl) return;

    try {
        const res = await fetch(`${API_BASE}/alerts?status=Active`);
        const data = await res.json();

        if (!data.alerts || data.alerts.length === 0) {
            listEl.innerHTML = `
                <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
                    ✅ No active alerts. All stations operating within nominal parameters.
                </div>
            `;
            return;
        }

        listEl.innerHTML = data.alerts.map(a => `
            <div class="card" style="padding: 1rem; margin-bottom: 0.75rem; border-left: 4px solid ${a.severity === 'Critical' ? 'var(--accent-rose)' : 'var(--accent-amber)'}; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
                        <span class="status-badge ${a.severity === 'Critical' ? 'status-critical' : 'status-high'}">${a.severity}</span>
                        <strong style="font-size: 0.9rem;">${a.alert_type}</strong>
                        <span style="font-size: 0.78rem; color: var(--text-dim);">${a.created_at}</span>
                    </div>
                    <p style="font-size: 0.88rem; color: var(--text-muted);">${a.message}</p>
                </div>
                <button onclick="acknowledgeAlert(${a.id})" class="btn btn-secondary btn-sm">Acknowledge</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Alerts list error:", err);
    }
}

async function acknowledgeAlert(alertId) {
    try {
        await fetch(`${API_BASE}/alerts/${alertId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Acknowledged' })
        });
        showToast("Alert marked as Acknowledged.", "success");
        loadActiveAlertsList();
        pollActiveAlerts();
    } catch (err) {
        showToast("Failed to update alert.", "error");
    }
}

function renderDashboardChart(stations) {
    const ctx = document.getElementById('dashboardOverviewChart');
    if (!ctx) return;

    const labels = stations.map(s => s.name);
    const densityData = stations.map(s => s.current_density);
    const capacityData = stations.map(s => s.capacity);

    if (overviewChart) overviewChart.destroy();

    overviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Current Passenger Inflow',
                    data: stations.map(s => s.current_inflow),
                    backgroundColor: 'rgba(37, 99, 235, 0.75)',
                    borderColor: '#2563EB',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Total Capacity',
                    data: capacityData,
                    backgroundColor: '#E2E8F0',
                    borderColor: '#CBD5E1',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#475569', font: { family: 'Inter' } } }
            },
            scales: {
                x: { ticks: { color: '#64748B', font: { size: 10 } }, grid: { display: false } },
                y: { ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboard-stations-tbody')) {
        loadDashboardData();
        setInterval(loadDashboardData, 15000); // Auto-refresh dashboard every 15s
    }
});
