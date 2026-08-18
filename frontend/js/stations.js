// Station Crowd Monitoring & Detail JS

let stationHistoryChart = null;
let currentStationId = null;
let allStationsList = [];
let activeLineFilter = 'All';

async function loadStationsPage() {
    try {
        const res = await fetch(`${API_BASE}/stations`);
        const data = await res.json();

        if (data.stations) {
            allStationsList = data.stations;
            filterStationsByLine(activeLineFilter);
        }
    } catch (err) {
        console.error("Failed to load stations:", err);
        showToast("Error loading stations data.", "error");
    }
}

function filterStationsByLine(line) {
    activeLineFilter = line;
    document.querySelectorAll('.line-filter-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`filter-line-${line}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (line === 'All') {
        renderStationCards(allStationsList);
    } else {
        const filtered = allStationsList.filter(s => s.line === line);
        renderStationCards(filtered);
    }
}

function renderStationCards(stations) {
    const grid = document.getElementById('stations-grid-container');
    if (!grid) return;

    if (stations.length === 0) {
        grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align:center; padding: 2rem; color:var(--text-muted);">No stations found for this line.</div>`;
        return;
    }

    grid.innerHTML = stations.map(st => {
        let statusClass = `status-${st.status.toLowerCase()}`;
        let meterClass = `meter-${st.status.toLowerCase()}`;
        let isInterchange = st.is_interchange || st.name.includes('Majestic') || st.name.includes('RV Road');
        let interchangeBadge = isInterchange ? `<span style="background: rgba(139, 92, 246, 0.2); color: var(--accent-purple); border: 1px solid rgba(139, 92, 246, 0.4); padding: 0.15rem 0.5rem; border-radius: 12px; font-size: 0.72rem; font-weight: 700; display: inline-block; margin-top: 0.2rem;">🔁 Interchange Station</span>` : '';

        return `
            <div class="card" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.5px;">${st.line} • ${st.station_code}</span>
                        <h3 style="font-size: 1.15rem; font-weight: 700; margin-top: 0.2rem;">${st.name}</h3>
                        ${interchangeBadge}
                    </div>
                    <span class="status-badge ${statusClass}">${st.status}</span>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.4rem;">
                        <span style="color: var(--text-muted);">Current Occupancy</span>
                        <strong>${st.current_density}% (${st.current_inflow} / ${st.capacity})</strong>
                    </div>
                    <div class="meter-container" style="height: 10px;">
                        <div class="meter-fill ${meterClass}" style="width: ${Math.min(100, st.current_density)}%;"></div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: rgba(0,0,0,0.25); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.88rem;">
                    <div>
                        <span style="color: var(--text-dim); display: block; font-size: 0.75rem;">INFLOW RATE</span>
                        <strong style="color: var(--accent-emerald); font-size: 1.1rem;">⬇ ${st.current_inflow}</strong> /hr
                    </div>
                    <div>
                        <span style="color: var(--text-dim); display: block; font-size: 0.75rem;">OUTFLOW RATE</span>
                        <strong style="color: var(--accent-blue); font-size: 1.1rem;">⬆ ${st.current_outflow}</strong> /hr
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="openStationDetailModal(${st.id})" class="btn btn-secondary btn-sm" style="flex: 1;">Analytics & History</button>
                    <button onclick="openUpdateCrowdModal(${st.id}, '${st.name.replace(/'/g, "\\'")}', ${st.current_inflow}, ${st.current_outflow})" class="btn btn-primary btn-sm" style="flex: 1;">Update Sensor Data</button>
                </div>
            </div>
        `;
    }).join('');
}

// Open Station Detail Modal with History Chart
async function openStationDetailModal(stationId) {
    currentStationId = stationId;
    const modal = document.getElementById('station-detail-modal');
    if (!modal) return;

    try {
        const res = await fetch(`${API_BASE}/stations/${stationId}`);
        const data = await res.json();

        if (data.station) {
            document.getElementById('modal-station-title').textContent = `${data.station.name} (${data.station.station_code})`;
            document.getElementById('modal-station-line').textContent = data.station.line;
            document.getElementById('modal-station-capacity').textContent = data.station.capacity;
            document.getElementById('modal-station-density').textContent = `${data.station.current_density}%`;

            modal.classList.add('active');
            renderStationHistoryChart(data.history || []);
        }
    } catch (err) {
        showToast("Error loading station history.", "error");
    }
}

function renderStationHistoryChart(history) {
    const ctx = document.getElementById('stationHistoryChart');
    if (!ctx) return;

    const labels = history.map(h => `${h.hour}:00`);
    const densityData = history.map(h => h.density_percentage);
    const countData = history.map(h => h.passenger_count);

    if (stationHistoryChart) stationHistoryChart.destroy();

    stationHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Density Percentage (%)',
                    data: densityData,
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Passenger Count',
                    data: countData,
                    borderColor: '#7C3AED',
                    backgroundColor: 'rgba(124, 58, 237, 0.05)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
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
                x: { ticks: { color: '#64748B' }, grid: { display: false } },
                y: { title: { display: true, text: 'Density %', color: '#64748B', font: { weight: '600' } }, ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } },
                y1: { position: 'right', title: { display: true, text: 'Passengers', color: '#64748B', font: { weight: '600' } }, ticks: { color: '#64748B' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Open Update Sensor Data Modal
function openUpdateCrowdModal(stationId, stationName, inflow, outflow) {
    currentStationId = stationId;
    document.getElementById('update-station-id').value = stationId;
    document.getElementById('update-station-name-label').textContent = stationName;
    document.getElementById('update-inflow-input').value = inflow;
    document.getElementById('update-outflow-input').value = outflow;

    const modal = document.getElementById('update-crowd-modal');
    if (modal) modal.classList.add('active');
}

async function handleUpdateCrowdSubmit(e) {
    e.preventDefault();
    const stationId = document.getElementById('update-station-id').value;
    const inflow = parseInt(document.getElementById('update-inflow-input').value);
    const outflow = parseInt(document.getElementById('update-outflow-input').value);

    try {
        const res = await fetch(`${API_BASE}/stations/${stationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_inflow: inflow, current_outflow: outflow })
        });

        const data = await res.json();
        if (res.ok) {
            showToast(`Sensor data updated! Density: ${data.new_density}% (${data.new_status})`, "success");
            closeModal('update-crowd-modal');
            loadStationsPage();
        } else {
            showToast(data.error || "Update failed", "error");
        }
    } catch (err) {
        showToast("Network error while updating station sensor data.", "error");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stations-grid-container')) {
        loadStationsPage();
    }
});
