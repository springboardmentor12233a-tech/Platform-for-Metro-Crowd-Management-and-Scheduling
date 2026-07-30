import {
  TrainFront,
  MapPinned,
  Users,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

function DashboardCards({ data }) {
  const cards = [
    {
      title: "Metro Stations",
      value: data.total_stations,
      icon: <MapPinned size={34} />,
      color: "#2563eb",
      bg: "#eff6ff",
      trend: "+3%",
    },
    {
      title: "Running Trains",
      value: data.total_trains,
      icon: <TrainFront size={34} />,
      color: "#16a34a",
      bg: "#ecfdf5",
      trend: "+5%",
    },
    {
      title: "Passengers Today",
      value: data.passengers_today,
      icon: <Users size={34} />,
      color: "#f59e0b",
      bg: "#fff7ed",
      trend: "+12%",
    },
    {
      title: "AI Prediction",
      value: data.prediction,
      icon: <BrainCircuit size={34} />,
      color: "#7c3aed",
      bg: "#f5f3ff",
      trend: "Live",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: "25px",
        marginBottom: "30px",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            transition: ".3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow =
              "0 20px 40px rgba(0,0,0,.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(0,0,0,.08)";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  color: "#64748b",
                  margin: 0,
                  fontSize: "15px",
                }}
              >
                {card.title}
              </p>

              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  fontSize: "32px",
                  color: "#0f172a",
                }}
              >
                {card.value}
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#16a34a",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                <TrendingUp size={16} />
                {card.trend}
              </div>
            </div>

            <div
              style={{
                background: card.bg,
                color: card.color,
                width: "70px",
                height: "70px",
                borderRadius: "18px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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