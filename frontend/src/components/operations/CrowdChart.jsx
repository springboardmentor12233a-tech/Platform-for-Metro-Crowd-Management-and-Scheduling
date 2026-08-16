import {

    RadialBarChart,

    RadialBar,

    Legend,

    ResponsiveContainer,

} from "recharts";

export default function CrowdChart({

    dashboard,

}) {

    const data = [

        {

            name: "High Crowd",

            value: dashboard.high_crowd_stations,

            fill: "#ef4444",

        },

    ];

    return (

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold text-white mb-5">

                👥 Crowd Monitoring

            </h2>

            <ResponsiveContainer

                width="100%"

                height={280}

            >

                <RadialBarChart

                    innerRadius="20%"

                    outerRadius="90%"

                    data={data}

                >

                    <RadialBar

                        dataKey="value"

                    />

                    <Legend />

                </RadialBarChart>

            </ResponsiveContainer>

        </div>

    );

}