export default function SettingsCard({

    title,

    description,

    children,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold">

                {title}

            </h2>

            <p className="mt-1 text-slate-500">

                {description}

            </p>

            <div className="mt-8">

                {children}

            </div>

        </div>

    );

}