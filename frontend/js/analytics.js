// Analytics Dashboard & AI Prediction Interface JS

let analyticsLineChart = null;
let analyticsBarChart = null;
let analyticsDoughnutChart = null;

async function loadAnalyticsPage() {
    try {
        // Load station dropdown list
        const res = await fetch(`${API_BASE}/stations`);
        const data = await res.json();

        if (data.stations) {
            const selectEl = document.getElementById('predict-station-select');
            if (selectEl) {
                const lines = ['Purple Line', 'Green Line', 'Yellow Line'];
                let html = '';
                lines.forEach(line => {
                    const lineStations = data.stations.filter(s => s.line === line);
                    if (lineStations.length > 0) {
                        html += `<optgroup label="${line}">`;
                        lineStations.forEach(s => {
                            let interchangeTag = s.is_interchange ? ' 🔁 (Interchange)' : '';
                            html += `<option value="${s.id}">${s.name}${interchangeTag}</option>`;
                        });
                        html += `</optgroup>`;
                    }
                });
                selectEl.innerHTML = html;
            }
            renderStationComparisonChart(data.stations);
            renderStatusDoughnutChart(data.stations);
        }

        // Run default prediction
        runPrediction();
        loadHourlyTrendChart();
    } catch (err) {
        console.error("Analytics initialization error:", err);
    }
}

// Execute AI Crowd Density Prediction
async function runPrediction() {
    const stationId = document.getElementById('predict-station-select')?.value || 1;
    const hour = parseInt(document.getElementById('predict-hour-select')?.value || 8);
    const dayOfWeek = parseInt(document.getElementById('predict-day-select')?.value || 1);
    const lagFootfall = parseFloat(document.getElementById('predict-lag-input')?.value || 500);

    try {
        const res = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                station_id: stationId,
                hour: hour,
                day_of_week: dayOfWeek,
                lag_1h_footfall: lagFootfall
            })
        });

        const data = await res.json();
        if (res.ok && data.prediction) {
            renderPredictionResults(data);
        } else {
            showToast(data.error || "Prediction request failed", "error");
        }
    } catch (err) {
        console.error("Prediction error:", err);
        showToast("Error connecting to AI prediction service.", "error");
    }
}

function renderPredictionResults(data) {
    const card = document.getElementById('prediction-result-card');
    if (!card) return;

    const pred = data.prediction;
    const st = data.station;
    let badgeClass = `status-${pred.predicted_status.toLowerCase()}`;
    let meterClass = `meter-${pred.predicted_status.toLowerCase()}`;

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">Predicted Station State</span>
                <h3 style="font-size: 1.35rem; font-weight: 700; margin-top: 0.2rem;">${st.name}</h3>
            </div>
            <span class="status-badge ${badgeClass}">${pred.predicted_status}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-sm);">
                <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">PREDICTED PASSENGERS</span>
                <strong style="font-size: 1.8rem; color: var(--accent-cyan);">${pred.predicted_passenger_count.toLocaleString()}</strong>
                <span style="font-size: 0.8rem; color: var(--text-dim); display: block;">of ${pred.capacity.toLocaleString()} Max Capacity</span>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-sm);">
                <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">PREDICTED DENSITY</span>
                <strong style="font-size: 1.8rem; color: ${pred.predicted_density_percentage >= 80 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${pred.predicted_density_percentage}%</strong>
                <span style="font-size: 0.8rem; color: var(--text-dim); display: block;">Target Hour: ${data.input.hour}:00</span>
            </div>
        </div>

        <div style="margin-bottom: 1rem;">
            <div class="meter-container" style="height: 10px;">
                <div class="meter-fill ${meterClass}" style="width: ${Math.min(100, pred.predicted_density_percentage)}%;"></div>
            </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted);">
            🤖 <strong>Model:</strong> ${pred.model_name} (Trained on reproducible synthetic footfall dataset)
        </p>
    `;
}

// Load 24-Hour Trend Line Chart Across Network
async function loadHourlyTrendChart() {
    const ctx = document.getElementById('analyticsLineChart');
    if (!ctx) return;

    try {
        const res = await fetch(`${API_BASE}/predict/all?hour=8&day_of_week=1`);
        const data = await res.json();

        const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
        // Generate simulated diurnal curve data for visualization comparison
        const peakCurve = [120, 90, 60, 50, 80, 240, 580, 920, 1150, 890, 620, 540, 580, 610, 650, 720, 940, 1180, 1020, 740, 510, 380, 260, 170];
        const normalCurve = [80, 60, 40, 30, 50, 150, 350, 550, 680, 520, 410, 390, 420, 430, 460, 510, 680, 790, 650, 480, 320, 240, 180, 110];

        if (analyticsLineChart) analyticsLineChart.destroy();

        analyticsLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [
                    {
                        label: 'Peak Weekday Predicted Traffic',
                        data: peakCurve,
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Normal Off-Peak Traffic',
                        data: normalCurve,
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.05)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#475569', font: { family: 'Inter' } } } },
                scales: {
                    x: { ticks: { color: '#64748B' }, grid: { display: false } },
                    y: { ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } }
                }
            }
        });
    } catch (err) {
        console.error("Hourly trend error:", err);
    }
}

function renderStationComparisonChart(stations) {
    const ctx = document.getElementById('analyticsBarChart');
    if (!ctx) return;

    if (analyticsBarChart) analyticsBarChart.destroy();

    analyticsBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stations.map(s => s.name),
            datasets: [{
                label: 'Current Occupancy (%)',
                data: stations.map(s => s.current_density),
                backgroundColor: stations.map(s => {
                    if (s.current_density >= 80) return '#EF4444';
                    if (s.current_density >= 65) return '#F59E0B';
                    if (s.current_density >= 40) return '#2563EB';
                    return '#10B981';
                }),
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#64748B', font: { size: 10 } }, grid: { display: false } },
                y: { max: 100, ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } }
            }
        }
    });
}

function renderStatusDoughnutChart(stations) {
    const ctx = document.getElementById('analyticsDoughnutChart');
    if (!ctx) return;

    const counts = {
        Low: stations.filter(s => s.status === 'Low').length,
        Moderate: stations.filter(s => s.status === 'Moderate').length,
        High: stations.filter(s => s.status === 'High').length,
        Critical: stations.filter(s => s.status === 'Critical').length
    };

    if (analyticsDoughnutChart) analyticsDoughnutChart.destroy();

    analyticsDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low Crowd', 'Moderate', 'High Crowd', 'Critical Overcrowd'],
            datasets: [{
                data: [counts.Low, counts.Moderate, counts.High, counts.Critical],
                backgroundColor: ['#10B981', '#2563EB', '#F59E0B', '#EF4444'],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#475569', font: { family: 'Inter' } } } }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('predict-station-select')) {
        loadAnalyticsPage();
    }
});
