"use client";

import Sidebar from "@/components/layout/Sidebar";
import {
  HourProvider,
  useHour
} from "./HourContext";


function HourSelector({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    selectedHour,
    setSelectedHour
  } = useHour();


  return (
    <>
      <div className="flex justify-end mb-6">

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl">

          <span className="text-slate-300 text-sm">
            Hour
          </span>


          <select
            value={selectedHour}
            onChange={(e)=>setSelectedHour(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-3 py-2"
          >

            {Array.from({length:24},(_,i)=>{

              const hour = i.toString().padStart(2,"0");

              return (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              );

            })}

          </select>

        </div>

      </div>


      {children}

    </>
  );
}



export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {


  return (

    <HourProvider>

      <div className="flex min-h-screen bg-slate-950 overflow-x-hidden">

        <Sidebar />


        <main className="flex-1 min-w-0 p-6">

          <HourSelector>
            {children}
          </HourSelector>

        </main>


      </div>

    </HourProvider>

  );
}