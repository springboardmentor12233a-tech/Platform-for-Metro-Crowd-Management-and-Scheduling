import StatisticsChart from "../StatisticsChart";

function ChartsSection({ data }) {
  return (
    <div
      style={{
        marginTop: "30px",
        width: "100%",
      }}
    >
      <h2
  style={{
    color: "#0f172a",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "700",
  }}
>
  📊 Metro Analytics
</h2>
      {/* Line-wise station distribution */}
      <div
        style={{
          width: "100%",
          marginBottom: "25px",
        }}
      >
        <StatisticsChart data={data} />
      </div>
    </div>
  );
}

export default ChartsSection;