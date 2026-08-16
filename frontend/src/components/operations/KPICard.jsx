import CountUp from "react-countup";

export default function KPICard({
    title,
    value,
    icon,
    color,
}) {
    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500 transition">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-slate-400">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold text-white mt-2">
                        <CountUp
                            end={value}
                            duration={1.5}
                        />
                    </h2>

                </div>

                <div className={`text-5xl ${color}`}>
                    {icon}
                </div>

            </div>

        </div>
    );
}