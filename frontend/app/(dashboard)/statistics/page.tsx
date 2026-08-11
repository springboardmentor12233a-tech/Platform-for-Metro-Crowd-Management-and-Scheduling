"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, TrendingDown, Database, Train } from "lucide-react";


export default function Statistics(){

    const [network,setNetwork] = useState<any>(null);
    const [passengers,setPassengers] = useState<any>(null);
    const [stations,setStations] = useState<any[]>([]);
    const [loading,setLoading] = useState(true);



    useEffect(()=>{

        const fetchStatistics = async()=>{

            try{

                const [
                    networkRes,
                    passengerRes,
                    stationRes
                ] = await Promise.all([

                    fetch(
                        "http://localhost:8000/api/statistics/network"
                    ).then(res=>res.json()),


                    fetch(
                        "http://localhost:8000/api/statistics/passengers"
                    ).then(res=>res.json()),


                    fetch(
                        "http://localhost:8000/api/statistics/top-stations?limit=10"
                    ).then(res=>res.json())

                ]);


                setNetwork(networkRes);

                setPassengers(passengerRes);

                setStations(
                    stationRes.top_stations || []
                );

                setLoading(false);


            }
            catch(error){

                console.error(error);
                setLoading(false);

            }

        };


        fetchStatistics();


    },[]);



    if(loading){

        return(
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading Statistics...
            </div>
        )

    }



    return(

        <div className="min-h-screen bg-slate-950 text-white p-8">


            <h1 className="text-4xl font-bold">
                📊 Metro Statistics
            </h1>

            <p className="text-slate-400 mt-2 mb-8">
                Network, passenger and operational statistics
            </p>



            {/* NETWORK STATS */}

            <h2 className="text-xl font-bold mb-4">
                Network Statistics
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">


                <StatCard
                    icon={<Train/>}
                    title="Stations"
                    value={network?.stations}
                />


                <StatCard
                    icon={<Database/>}
                    title="Routes"
                    value={network?.routes}
                />


                <StatCard
                    icon={<Train/>}
                    title="Trips"
                    value={network?.trips}
                />


                <StatCard
                    icon={<Database/>}
                    title="Stop Times"
                    value={network?.stop_times}
                />


            </div>




            {/* PASSENGER STATS */}

            <h2 className="text-xl font-bold mb-4">
                Passenger Statistics
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">


                <StatCard
                    icon={<Users/>}
                    title="Total Passengers"
                    value={passengers?.total_passengers.toLocaleString()}
                />


                <StatCard
                    icon={<TrendingUp/>}
                    title="Average"
                    value={passengers?.average_passengers}
                />


                <StatCard
                    icon={<TrendingUp/>}
                    title="Highest"
                    value={passengers?.highest_passengers}
                />


                <StatCard
                    icon={<TrendingDown/>}
                    title="Lowest"
                    value={passengers?.lowest_passengers}
                />


            </div>




            {/* TOP STATIONS */}

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">


                <h2 className="text-xl font-bold mb-6">
                    Top 10 Busiest Stations
                </h2>


                <div className="space-y-3">


                {
                    stations.map((station:any)=>(

                        <div
                        key={station.station_id}
                        className="flex justify-between bg-slate-800 p-4 rounded-lg"
                        >

                            <span>
                                #{station.rank} {station.station_name}
                            </span>


                            <span className="font-bold">
                                {station.total_passengers.toLocaleString()}
                            </span>


                        </div>

                    ))
                }


                </div>


            </div>


        </div>

    );

}



function StatCard(
    {
        icon,
        title,
        value
    }:{
        icon:any,
        title:string,
        value:any
    }
){

    return(

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

            <div className="text-cyan-400 mb-3">
                {icon}
            </div>

            <p className="text-slate-400">
                {title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
                {value ?? "N/A"}
            </h2>


        </div>

    )

}