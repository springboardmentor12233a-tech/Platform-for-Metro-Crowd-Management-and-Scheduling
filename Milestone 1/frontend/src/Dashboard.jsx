import Navbar from "./Navbar";

function Dashboard() {
  const stations = [
    { name: "Central Station", passengers: 250, level: "Medium" },
    { name: "North Station", passengers: 420, level: "High" },
    { name: "South Station", passengers: 120, level: "Low" },
  ];

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>MetroFlow Dashboard</h2>

        <h3>Crowd Monitoring</h3>

        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Station</th>
              <th>Passengers</th>
              <th>Crowd Level</th>
            </tr>
          </thead>

          <tbody>
            {stations.map((station, index) => (
              <tr key={index}>
                <td>{station.name}</td>
                <td>{station.passengers}</td>
                <td>{station.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
