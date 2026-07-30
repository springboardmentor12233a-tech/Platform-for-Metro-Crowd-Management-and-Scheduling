<div className="table-container">

  <h2>📅 Metro Schedules</h2>

  <input
    type="text"
    placeholder="🔍 Search Train Name or Number..."
    value={scheduleSearch}
    onChange={(e) => setScheduleSearch(e.target.value)}
    className="search-box"
  />

  <table className="metro-table">
    <thead>
      <tr>
        <th>Train No.</th>
        <th>Train Name</th>
        <th>Station</th>
        <th>Arrival</th>
        <th>Departure</th>
      </tr>
    </thead>

    <tbody>
      {filteredSchedules.slice(0, 10).map((schedule, index) => (
        <tr key={index}>
          <td>{schedule.train_number}</td>
          <td>{schedule.train_name}</td>
          <td>{schedule.station_name}</td>
          <td>{schedule.arrival}</td>
          <td>{schedule.departure}</td>
        </tr>
      ))}
    </tbody>
  </table>

</div>