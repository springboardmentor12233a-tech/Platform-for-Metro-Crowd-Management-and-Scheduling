import DashboardCards from "../DashboardCards";

function KPIGrid({ data }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <DashboardCards data={data} />
    </div>
  );
}

export default KPIGrid;