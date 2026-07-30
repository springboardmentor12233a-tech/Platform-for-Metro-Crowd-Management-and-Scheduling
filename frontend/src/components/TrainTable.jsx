<div className="table-container">
  <h2>🚆 Metro Trains</h2>

  <table className="metro-table">
    <thead>
      <tr>
        <th>Type</th>
        <th>Geometry</th>
        <th>Coordinates</th>
      </tr>
    </thead>

    <tbody>
      {trains.slice(0, 10).map((train, index) => (
        <tr key={index}>
          <td>{train.type}</td>
          <td>{train["geometry.type"]}</td>
          <td>{train["geometry.coordinates"].length} Points</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>