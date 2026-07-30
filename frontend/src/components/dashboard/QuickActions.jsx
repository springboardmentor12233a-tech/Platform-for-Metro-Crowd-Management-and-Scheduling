import { FileDown, BarChart3, MapPinned, Bot } from "lucide-react";

function QuickActions() {
  const actions = [
    {
      title: "Download Report",
      icon: <FileDown size={22} />,
      color: "#2563eb",
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={22} />,
      color: "#16a34a",
    },
    {
      title: "Stations",
      icon: <MapPinned size={22} />,
      color: "#f59e0b",
    },
    {
      title: "AI Assistant",
      icon: <Bot size={22} />,
      color: "#7c3aed",
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
      <h3 style={{ marginBottom: "18px", color: "#0f172a" }}>
        ⚡ Quick Actions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "16px",
        }}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: `${action.color}15`,
              color: action.color,
              fontWeight: "600",
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