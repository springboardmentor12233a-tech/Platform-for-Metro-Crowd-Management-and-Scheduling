import metro from "../assets/image/metro-bg.jpg";

function Navbar() {
  return (
    <div
      style={{
        height: "80px",
        background: "white",
        borderRadius: "15px",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
        marginBottom: "25px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={metro}
          alt="Metro"
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "15px",
          }}
        />

        <div>
          <h2 style={{ margin: 0 }}>
            Metro Crowd Management
          </h2>

          <p
            style={{
              margin: 0,
              color: "gray",
            }}
          >
            AI Powered Scheduling System
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <span>🔔</span>
        <span>⚙️</span>
        <span>👤 Admin</span>
      </div>
    </div>
  );
}

export default Navbar;