import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function TicketDistributionChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Ticket Distribution
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Ticket type analysis
          </p>
        </div>

        <button
          className="
            px-4
            py-2
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            hover:bg-slate-50
            transition
          "
        >
          Monthly ▼
        </button>
      </div>

      {/* Body */}

      <div className="flex-1 flex items-center gap-5">
        {/* Donut */}

        <div className="w-[48%] h-full flex items-center justify-center">
          <div className="w-[190px] h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={4}
                  stroke="#fff"
                  strokeWidth={5}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "none",
                    boxShadow: "0 15px 35px rgba(0,0,0,.12)",
                  }}
                />

                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    fill: "#0F172A",
                  }}
                >
                  {total.toLocaleString()}
                </text>

                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 12,
                    fill: "#64748B",
                  }}
                >
                  Tickets
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}

        <div className="w-[52%] space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                px-3
                py-2.5
                hover:bg-indigo-50
                hover:border-indigo-200
                transition-all
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: COLORS[index],
                  }}
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {((item.value / total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="text-sm font-bold text-slate-900">
                {item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketDistributionChart;