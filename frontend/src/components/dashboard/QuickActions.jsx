import { FileDown, BarChart3, MapPinned, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Download Report",
      icon: <FileDown size={22} />,
      color: "#2563eb",
      action: () => {
        alert("Report download feature coming soon.");
      },
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={22} />,
      color: "#16a34a",
      action: () => {
        navigate("/analytics");
      },
    },
    {
      title: "Stations",
      icon: <MapPinned size={22} />,
      color: "#f59e0b",
      action: () => {
        navigate("/stations");
      },
    },
    {
      title: "AI Assistant",
      icon: <Bot size={22} />,
      color: "#7c3aed",
      action: () => {
        alert("AI Assistant is available on the dashboard.");
      },
    },
  ];

  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "22px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        marginTop: "28px",
      }}
    >
      <h3
        style={{
          marginBottom: "18px",
          color: "#0f172a",
        }}
      >
        ⚡ Quick Actions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
        }}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "14px 10px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: `${action.color}15`,
              color: action.color,
              fontWeight: "600",
              fontSize: "14px",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {action.icon}
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;