import {
  BrainCircuit,
  Cpu,
  Activity,
} from "lucide-react";

const metrics = [
  {
    title: "AI Accuracy",
    value: "98.4%",
    icon: BrainCircuit,
  },
  {
    title: "Prediction Engine",
    value: "Running",
    icon: Cpu,
  },
  {
    title: "Network Health",
    value: "96%",
    icon: Activity,
  },
];

function AIStatusPanel() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <h2 className="text-xl font-bold mb-5">
        AI System Status
      </h2>

      <div className="space-y-5">

        {metrics.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="flex justify-between items-center"
            >

              <div className="flex gap-3 items-center">

                <Icon className="text-indigo-600" />

                <span>{item.title}</span>

              </div>

              <strong>{item.value}</strong>

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default AIStatusPanel;