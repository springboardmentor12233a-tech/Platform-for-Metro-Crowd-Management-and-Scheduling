<div className="table-container">
  <h2>🚉 Metro Stations</h2>

  <input
    type="text"
    placeholder="🔍 Search Station..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-box"
  />

  <table className="metro-table">
    <thead>
      <tr>
        <th>Code</th>
        <th>Station Name</th>
        <th>State</th>
        <th>Zone</th>
      </tr>
    </thead>

    <tbody>
      {filteredStations.slice(0, 10).map((station, index) => (
        <tr key={index}>
          <td>{station["properties.code"]}</td>
          <td>{station["properties.name"]}</td>
          <td>{station["properties.state"]}</td>
          <td>{station["properties.zone"]}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>