    import {
        PieChart,
        Pie,
        Cell,
        ResponsiveContainer,
        Tooltip,
    } from "recharts";

    const COLORS = [
        "#22c55e",
        "#facc15",
        "#ef4444",
    ];

    export default function TrainStatusChart({ dashboard }) {

        const data = [

            {
                name: "Running",
                value: dashboard.running_trains,
            },

            {
                name: "Idle",
                value: dashboard.idle_trains,
            },

            {
                name: "Maintenance",
                value: dashboard.maintenance_trains,
            },

        ];

        return (

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">

                <h2 className="text-xl font-bold text-white mb-5">

                    🚆 Train Status

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={280}
                >

                    <PieChart>

                        <Pie

                            data={data}

                            dataKey="value"

                            outerRadius={95}

                            label

                        >

                            {

                                data.map((entry, index) => (

                                    <Cell

                                        key={index}

                                        fill={COLORS[index]}

                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        );

    }