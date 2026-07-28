import {
  MapPin,
  Train,
  Flag,
} from "lucide-react";

export default function PredictionTimeline({

  form

}){

return(

<div className="rounded-3xl bg-white border shadow-xl p-8">

<h2 className="text-2xl font-bold mb-8">

Journey Timeline

</h2>

<div className="flex flex-col gap-8">

<div className="flex items-center gap-5">

<div className="rounded-full bg-indigo-100 p-3">

<MapPin className="text-indigo-600"/>

</div>

<div>

<p className="text-sm text-slate-500">

Origin

</p>

<h3 className="font-bold">

{form.from_station||"--"}

</h3>

</div>

</div>

<div className="ml-6 border-l-2 border-dashed h-10"/>

<div className="flex items-center gap-5">

<div className="rounded-full bg-violet-100 p-3">

<Train className="text-violet-600"/>

</div>

<div>

<p className="text-sm text-slate-500">

Journey

</p>

<h3>

{form.distance_km||0} km

</h3>

</div>

</div>

<div className="ml-6 border-l-2 border-dashed h-10"/>

<div className="flex items-center gap-5">

<div className="rounded-full bg-emerald-100 p-3">

<Flag className="text-emerald-600"/>

</div>

<div>

<p className="text-sm text-slate-500">

Destination

</p>

<h3 className="font-bold">

{form.to_station||"--"}

</h3>

</div>

</div>

</div>

</div>

)

}