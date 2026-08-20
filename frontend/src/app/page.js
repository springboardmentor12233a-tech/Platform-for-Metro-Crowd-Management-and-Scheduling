"use client";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [stations, setStations] = useState([]);
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  useEffect(() => {
    fetch("http://localhost:8000/stations")
      .then((res) => res.json())
      .then((data) => setStations(data));
  }, []);

  const getStatus = (capacity) => {
    if (capacity >= 1000) return { label: "High", color: "bg-red-100 text-red-700 border-red-300" };
    if (capacity >= 500) return { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-300" };
    return { label: "Low", color: "bg-green-100 text-green-700 border-green-300" };
  };

  return (
    <>
      <Navbar />
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              MetroFlow Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Live station data from backend
            </p>
          </div>
        </div>

        {stations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No stations found. Add one via /docs first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stations.map((station) => {
              const status = getStatus(station.capacity);
              return (
                <div
                  key={station.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {station.name}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-2">
                    Capacity: {station.capacity}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
        </>
  );
}