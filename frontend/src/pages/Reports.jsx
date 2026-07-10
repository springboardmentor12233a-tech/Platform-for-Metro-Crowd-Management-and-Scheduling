import Navbar from "../components/Navbar";

function Reports() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          background: "#f5f7fa",
          minHeight: "100vh"
        }}
      >
        <h1 style={{ color: "#1565C0" }}>
          📄 MetroFlow Reports
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "30px"
          }}
        >
          <ReportCard title="Total Predictions" value="126" />
          <ReportCard title="Highest Crowd Station" value="Central" />
          <ReportCard title="Peak Hour" value="8:00 AM" />
          <ReportCard title="Average Passenger Count" value="4,860" />
          <ReportCard title="Today's Delay" value="2 Minutes" />
          <ReportCard title="Average Occupancy" value="71%" />
        </div>
      </div>
    </>
  );
}

function ReportCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0px 4px 10px rgba(0,0,0,.2)"
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

export default Reports;