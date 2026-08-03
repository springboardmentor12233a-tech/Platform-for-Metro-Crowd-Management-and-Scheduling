export default function MetricCard({

  icon: Icon,

  title,

  value,

}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <Icon

        className="mb-4 text-blue-600"

        size={22}

      />

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <h3 className="mt-2 text-3xl font-bold">

        {value}

      </h3>

    </div>

  );

}