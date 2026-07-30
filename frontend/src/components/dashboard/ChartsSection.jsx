import StatisticsChart from "../StatisticsChart";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import DoughnutChart from "../DoughnutChart";

function ChartsSection({ data }) {
  return (
    <div
      style={{
        marginTop: "30px",
      }}
    >
      <h2
        style={{
          color: "#0f172a",
          marginBottom: "20px",
        }}
      >
        📊 AI Analytics Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <StatisticsChart data={data} />
        <PieChart data={data} />
        <LineChart data={data} />
        <DoughnutChart data={data} />
      </div>
    </div>
  );
}

export default ChartsSection;