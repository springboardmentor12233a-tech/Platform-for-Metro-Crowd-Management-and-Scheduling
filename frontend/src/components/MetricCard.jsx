export default function MetricCard({

    title,

    value,

    color = "blue"

}) {

    return (

        <div
            className={`
                bg-white
                rounded-xl
                shadow-md
                p-6
                border-l-4
                border-${color}-500
            `}
        >

<p className="text-gray-600 text-sm">
    {title}
</p>

<h2 className="text-3xl font-bold text-slate-800 mt-2">
    {value}
</h2>

        </div>

    )

}