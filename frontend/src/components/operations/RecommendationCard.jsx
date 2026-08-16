import {

    CheckCircle,

} from "lucide-react";

export default function RecommendationCard({

    recommendation,

}) {

    return (

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center gap-4 hover:border-cyan-500 transition">

            <CheckCircle

                className="text-green-400"

                size={24}

            />

            <span className="text-white">

                {recommendation}

            </span>

        </div>

    );

}