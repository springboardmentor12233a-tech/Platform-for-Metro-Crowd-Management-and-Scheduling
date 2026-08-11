"use client";

import { useEffect, useState } from "react";
import { Zap, Train, Users } from "lucide-react";


export default function FrequencyAdjustment(){

    const [data,setData] = useState<any>(null);
    const [hour,setHour] = useState(17);
    const [loading,setLoading] = useState(true);


    const fetchFrequency = async()=>{

        try{

            const response = await fetch(
                `http://localhost:8000/api/scheduling/dashboard?hour=${hour}`
            );

            const result = await response.json();

            setData(result);

            setLoading(false);

        }
        catch(error){

            console.error(error);
            setLoading(false);

        }

    };


    useEffect(()=>{

        fetchFrequency();

    },[hour]);



    if(loading){

        return(
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading Frequency Data...
            </div>
        )

    }



    return(

        <div className="min-h-screen bg-slate-950 text-white p-8">


            <h1 className="text-4xl font-bold">
                🚆 Frequency Adjustment
            </h1>


            <p className="text-slate-400 mt-2 mb-8">
                AI based train frequency optimization
            </p>



            <select

                value={hour}

                onChange={(e)=>setHour(Number(e.target.value))}

                className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-8"

            >

                {
                    Array.from({length:24},(_,i)=>(

                        <option key={i} value={i}>
                            {i}:00
                        </option>

                    ))
                }

            </select>




            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">



                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <Users className="text-cyan-400"/>

                    <p className="text-slate-400 mt-3">
                        Predicted Passengers
                    </p>

                    <h2 className="text-3xl font-bold">
                        {data.predicted_passengers}
                    </h2>

                </div>



                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <Train className="text-green-400"/>

                    <p className="text-slate-400 mt-3">
                        Current Frequency
                    </p>

                    <h2 className="text-3xl font-bold">
                        {data.current_frequency}
                    </h2>

                    <p className="text-sm text-slate-400">
                        trains/hour
                    </p>

                </div>




                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

                    <Zap className="text-yellow-400"/>

                    <p className="text-slate-400 mt-3">
                        AI Recommended Frequency
                    </p>

                    <h2 className="text-3xl font-bold text-green-400">
                        {data.recommended_frequency}
                    </h2>

                    <p className="text-sm text-slate-400">
                        trains/hour
                    </p>

                </div>



            </div>



            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mt-8">


                <h2 className="text-xl font-bold mb-4">
                    Optimization Result
                </h2>


                <p className="text-slate-300">

                    {
                        data.recommended_frequency >
                        data.current_frequency

                        ?

                        `Increase frequency by ${
                            data.recommended_frequency -
                            data.current_frequency
                        } trains/hour during this period.`

                        :

                        "Current frequency is sufficient."

                    }

                </p>


            </div>


        </div>

    );

}