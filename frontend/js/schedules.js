// Train Scheduling Management & AI Recommendations JS

let allSchedulesList = [];
let activeScheduleLineFilter = 'All';

async function loadSchedulesPage() {
    try {
        const res = await fetch(`${API_BASE}/schedules`);
        const data = await res.json();

        if (data.schedules) {
            allSchedulesList = data.schedules;
            filterSchedulesByLine(activeScheduleLineFilter);
        }

        loadAIRecommendations();
    } catch (err) {
        console.error("Error loading schedules:", err);
        showToast("Failed to load train schedules.", "error");
    }
}

function filterSchedulesByLine(line) {
    activeScheduleLineFilter = line;
    document.querySelectorAll('.line-sched-filter').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`sched-filter-${line}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (line === 'All') {
        renderSchedulesTable(allSchedulesList);
    } else {
        const filtered = allSchedulesList.filter(s => s.line === line);
        renderSchedulesTable(filtered);
    }
}

function renderSchedulesTable(schedules) {
    const tbody = document.getElementById('schedules-tbody');
    if (!tbody) return;

    if (schedules.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:2rem;">No schedules found for this line.</td></tr>`;
        return;
    }

    const isAdmin = currentUser && currentUser.role === 'admin';
    const isOperator = currentUser && (currentUser.role === 'operator' || currentUser.role === 'admin');

    tbody.innerHTML = schedules.map(s => {
        let statusBadgeClass = 'status-low';
        if (s.status === 'Delayed') statusBadgeClass = 'status-high';
        if (s.status === 'Cancelled') statusBadgeClass = 'status-critical';
        if (s.status.includes('Recommended')) statusBadgeClass = 'status-moderate';

        return `
            <tr>
                <td><strong>${s.train_code}</strong></td>
                <td><span style="color:var(--accent-cyan); font-weight:600;">${s.line}</span></td>
                <td>${s.origin_station} ➔ ${s.destination_station}</td>
                <td>${s.departure_time}</td>
                <td>${s.arrival_time}</td>
                <td><strong>Every ${s.frequency_mins} mins</strong></td>
                <td><span class="status-badge ${statusBadgeClass}">${s.status}</span></td>
                <td>
                    ${isOperator ? `
                        <select onchange="updateScheduleStatus(${s.id}, this.value)" class="form-select" style="padding:0.25rem 0.5rem; font-size:0.8rem; width:auto; display:inline-block;">
                            <option value="On Time" ${s.status === 'On Time' ? 'selected' : ''}>On Time</option>
                            <option value="Delayed" ${s.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
                            <option value="Cancelled" ${s.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    ` : ''}
                    ${isAdmin ? `
                        <button onclick="deleteSchedule(${s.id})" class="btn btn-danger btn-sm" style="padding:0.2rem 0.5rem; margin-left:0.25rem;">Delete</button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

async function updateScheduleStatus(scheduleId, newStatus) {
    try {
        const res = await fetch(`${API_BASE}/schedules/${scheduleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
            showToast("Train status updated successfully.", "success");
            loadSchedulesPage();
        } else {
            showToast("Failed to update schedule status.", "error");
        }
    } catch (err) {
        showToast("Network error updating schedule.", "error");
    }
}

async function deleteSchedule(scheduleId) {
    if (!confirm("Are you sure you want to delete this train schedule?")) return;

    try {
        const res = await fetch(`${API_BASE}/schedules/${scheduleId}`, { method: 'DELETE' });
        if (res.ok) {
            showToast("Train schedule deleted.", "info");
            loadSchedulesPage();
        } else {
            showToast("Failed to delete schedule.", "error");
        }
    } catch (err) {
        showToast("Error deleting schedule.", "error");
    }
}

// AI Dispatch & Frequency Recommendation Engine
async function loadAIRecommendations() {
    const container = document.getElementById('ai-recommendations-container');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/schedules/recommendations`);
        const data = await res.json();

        if (data.recommendations) {
            container.innerHTML = data.recommendations.map(rec => `
                <div class="card" style="margin-bottom: 1rem; border-left: 4px solid ${rec.recommended_frequency <= 5 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <div>
                            <strong style="font-size: 1.1rem; color: var(--accent-cyan);">${rec.line} Optimization</strong>
                            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">Busiest Hub: <strong>${rec.busiest_station}</strong> (${rec.current_max_density}% density)</span>
                        </div>
                        <span class="status-badge ${rec.recommended_frequency <= 5 ? 'status-high' : 'status-low'}">${rec.action}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.75rem;">💡 ${rec.reason}</p>
                    <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; background: rgba(0,0,0,0.25); padding: 0.6rem 1rem; border-radius: var(--radius-sm);">
                        <div>Current Frequency: <strong>${rec.current_avg_frequency} mins</strong></div>
                        <div>AI Recommended Frequency: <strong style="color: var(--accent-cyan);">${rec.recommended_frequency} mins</strong></div>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to load AI recommendations:", err);
    }
}

// Add Schedule Modal
async function openAddScheduleModal() {
    const modal = document.getElementById('add-schedule-modal');
    if (!modal) return;

    // Populate origin and destination dropdowns with grouped optgroups
    try {
        const res = await fetch(`${API_BASE}/stations`);
        const data = await res.json();

        if (data.stations) {
            const originEl = document.getElementById('sched-origin');
            const destEl = document.getElementById('sched-destination');

            const lines = ['Purple Line', 'Green Line', 'Yellow Line'];
            let html = '';
            lines.forEach(line => {
                const lineStations = data.stations.filter(s => s.line === line);
                if (lineStations.length > 0) {
                    html += `<optgroup label="${line}">`;
                    lineStations.forEach(s => {
                        html += `<option value="${s.name}">${s.name}</option>`;
                    });
                    html += `</optgroup>`;
                }
            });

            if (originEl) originEl.innerHTML = html;
            if (destEl) destEl.innerHTML = html;
        }
    } catch (err) {
        console.error("Failed to load station options for schedule modal:", err);
    }

    modal.classList.add('active');
}

async function handleAddScheduleSubmit(e) {
    e.preventDefault();
    const trainCode = document.getElementById('sched-train-code').value.trim();
    const line = document.getElementById('sched-line').value;
    const origin = document.getElementById('sched-origin').value.trim();
    const destination = document.getElementById('sched-destination').value.trim();
    const departure = document.getElementById('sched-departure').value;
    const arrival = document.getElementById('sched-arrival').value;
    const frequency = parseInt(document.getElementById('sched-frequency').value);

    try {
        const res = await fetch(`${API_BASE}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                train_code: trainCode,
                line: line,
                origin_station: origin,
                destination_station: destination,
                departure_time: departure,
                arrival_time: arrival,
                frequency_mins: frequency
            })
        });

        const data = await res.json();
        if (res.ok) {
            showToast("New train schedule added successfully!", "success");
            closeModal('add-schedule-modal');
            loadSchedulesPage();
        } else {
            showToast(data.error || "Failed to add schedule", "error");
        }
    } catch (err) {
        showToast("Error connecting to server.", "error");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('schedules-tbody')) {
        loadSchedulesPage();
    }
});
