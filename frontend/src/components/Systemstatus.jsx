function SystemStatus({ data }) {

  const today = new Date();

  return (
    <div className="status-container">

      <div className="status-card">
        <h3>🟢 API Status</h3>
        <h2>Online</h2>
      </div>

      <div className="status-card">
        <h3>📅 Date</h3>
        <h2>{today.toLocaleDateString()}</h2>
      </div>

      <div className="status-card">
        <h3>⏰ Time</h3>
        <h2>{today.toLocaleTimeString()}</h2>
      </div>

      <div className="status-card">
        <h3>📊 Total Records</h3>
        <h2>
          {data.total_stations + data.total_trains + data.passengers_today}
        </h2>
      </div>

    </div>
  );
}

export default SystemStatus;