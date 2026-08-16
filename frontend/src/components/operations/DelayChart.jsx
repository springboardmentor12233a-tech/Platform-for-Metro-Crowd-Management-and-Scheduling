import {

    BarChart,

    Bar,

    XAxis,

    YAxis,

    Tooltip,

    ResponsiveContainer,

} from "recharts";

export default function DelayChart({

    dashboard,

}) {

    const data = [

        {

            name: "Average",

            value: dashboard.average_delay,

        },

        {

            name: "Delayed",

            value: dashboard.delayed_trains,

        },

    ];

    return (

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold text-white mb-5">

                ⏱ Delay Overview

            </h2>

            <ResponsiveContainer

                width="100%"

                height={280}

            >

                <BarChart data={data}>

                    <XAxis dataKey="name"/>

                    <YAxis/>

                    <Tooltip/>

                    <Bar

                        dataKey="value"

                        fill="#06b6d4"

                        radius={[10,10,0,0]}

                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}