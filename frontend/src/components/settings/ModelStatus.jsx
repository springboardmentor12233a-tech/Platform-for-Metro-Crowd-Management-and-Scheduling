export default function ModelStatus({

  title,

  status,

}) {

  const online = status === "Online";

  return (

    <div className="flex items-center justify-between border-b border-slate-200 py-4 last:border-none">

      <span className="font-medium">

        {title}

      </span>

      <span

        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          online
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}

      >

        {status}

      </span>

    </div>

  );

}