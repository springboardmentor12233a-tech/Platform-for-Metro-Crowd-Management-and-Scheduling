function Header() {
  return (
    <div className="dashboard-header">

      <div className="header-title">

        <div className="header-brand">
          <h1>MetroFlow AI Command Center</h1>
        </div>

        <p>
          Smart Metro Crowd Management & Passenger Forecasting
        </p>

      </div>

      <div className="system-online">
        <span className="status-dot"></span>
        <span>System Online</span>
      </div>

    </div>
  );
}

export default Header;