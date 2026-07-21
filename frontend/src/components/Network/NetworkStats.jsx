import {
  Activity,
  TrainFront,
  AlertTriangle,
  BrainCircuit,
} from "lucide-react";

const cards = [
  {
    title: "Network Health",
    value: "96%",
    icon: Activity,
    color: "text-green-500",
  },
  {
    title: "Active Trains",
    value: "124",
    icon: TrainFront,
    color: "text-indigo-600",
  },
  {
    title: "Delay Events",
    value: "4",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    title: "AI Accuracy",
    value: "98%",
    icon: BrainCircuit,
    color: "text-cyan-500",
  },
];

function NetworkStats() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <Icon className={card.color} size={30} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NetworkStats;