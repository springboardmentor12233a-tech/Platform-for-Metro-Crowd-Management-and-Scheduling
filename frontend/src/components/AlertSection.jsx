import "../styles/AlertSection.css";

function AlertSection() {
  return (
    <div className="alert-container">

      <div className="alert-card">
        <h3>📢 Latest Alert</h3>

        <div className="alert-content">
          <p><strong>Alert:</strong> High Crowd Detected</p>
          <p><strong>Priority:</strong> High</p>
          <p><strong>Station:</strong> Rajiv Chowk</p>
        </div>
      </div>

      <div className="announcement-card">
        <h3>📣 Emergency Announcement</h3>

        <div className="alert-content">
          <p>
            Attention passengers! Please use alternate routes due to heavy
            congestion at Rajiv Chowk.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AlertSection;