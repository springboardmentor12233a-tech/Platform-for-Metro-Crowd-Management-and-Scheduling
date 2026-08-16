function SystemStatus() {

  const time = new Date().toLocaleTimeString();

  return (
    <div className="card">

      <h2>🛰 System Status</h2>

      <p>🟢 AI Prediction Engine : Online</p>

      <p>🟢 FastAPI Server : Connected</p>

      <p>🟢 React Dashboard : Active</p>

      <p>🟢 Monitoring Service : Running</p>

      <hr />

      <strong>Last Updated</strong>

      <p>{time}</p>

    </div>
  );
}

export default SystemStatus;