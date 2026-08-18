import {
  TrainFront,
  MapPinned,
  Users,
  BrainCircuit,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";

function DashboardCards({ data }) {
  const cards = [
  {
    title: "Metro Stations",
    value: data?.total_stations || 0,
    icon: <MapPinned size={34} />,
    color: "#60a5fa",
    bg: "rgba(37,99,235,0.18)",
    trend: "Live",
  },

  {
    title: "Running Trains",
    value: data?.total_trains || 0,
    icon: <TrainFront size={34} />,
    color: "#4ade80",
    bg: "rgba(22,163,74,0.18)",
    trend: "Live",
  },

  {
    title: "Passengers Today",
    value: data?.passengers_today || 0,
    icon: <Users size={34} />,
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.18)",
    trend: "Today",
  },

  {
    title: "AI Prediction",
    value: data?.prediction || "Moderate",
    icon: <BrainCircuit size={34} />,
    color: "#c084fc",
    bg: "rgba(124,58,237,0.18)",
    trend: `${data?.ai_confidence || 0}%`,
  },

  {
    title: "Busiest Line",
    value: data?.busiest_line || "N/A",
    icon: <Activity size={34} />,
    color: "#f472b6",
    bg: "rgba(236,72,153,0.18)",
    trend: `${data?.busiest_line_stations || 0} Stations`,
  },

  {
    title: "Recommendation",
    value: data?.recommendation || "No Recommendation",
    icon: <BarChart3 size={34} />,
    color: "#22d3ee",
    bg: "rgba(6,182,212,0.18)",
    trend: "AI",
  },
];
  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "22px",
            minHeight: "150px",
            boxSizing: "border-box",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-5px)";

            e.currentTarget.style.boxShadow =
              "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";

            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(0,0,0,0.25)";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* TEXT */}
            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {card.title}
              </p>

              <h2
  style={{
    margin: "10px 0",
    fontSize:
      card.title === "Recommendation"
        ? "16px"
        : card.title === "Busiest Line"
        ? "22px"
        : "30px",
    color: "#f8fafc",
    fontWeight: "700",
    wordBreak: "break-word",
    lineHeight: "1.4",
  }}
>
  {card.value}
</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#4ade80",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                <TrendingUp size={15} />

                {card.trend}
              </div>
            </div>

            {/* ICON */}
            <div
              style={{
                background: card.bg,
                color: card.color,
                width: "60px",
                height: "60px",
                minWidth: "60px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid ${card.color}33`,
              }}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;