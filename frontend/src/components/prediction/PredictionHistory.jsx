import {
  Clock,
  ArrowRight,
  Users,
} from "lucide-react";

export default function PredictionHistory() {

  const history = JSON.parse(
    localStorage.getItem("predictionHistory") || "[]"
  );

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-slate-200">

      <div className="border-b px-6 py-5">

        <div className="flex items-center gap-3">

          <Clock className="text-indigo-600"/>

          <h2 className="text-2xl font-bold">
            Recent Predictions
          </h2>

        </div>

      </div>

      <div className="divide-y">

        {history.length === 0 && (

          <div className="p-10 text-center text-slate-500">

            No predictions yet

          </div>

        )}

        {history.map((item,index)=>(

          <div
            key={index}
            className="flex items-center justify-between p-5 hover:bg-slate-50 transition"
          >

            <div>

              <div className="flex items-center gap-2">

                <span className="font-semibold">
                  {item.from}
                </span>

                <ArrowRight size={16}/>

                <span className="font-semibold">
                  {item.to}
                </span>

              </div>

              <p className="text-sm text-slate-500 mt-1">

                {item.time}

              </p>

            </div>

            <div className="flex items-center gap-2">

              <Users className="text-indigo-600"/>

              <span className="font-bold">

                {item.passengers}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}