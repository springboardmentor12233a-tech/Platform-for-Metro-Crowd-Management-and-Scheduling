'use client';

import { useEffect, useState } from "react";

import {
  Train,
  MapPinned,
  Route,
  Activity
} from "lucide-react";

import dynamic from "next/dynamic";
import { apiService } from "@/lib/api";

const MetroLeafletMap = dynamic(
  () => import("./MetroLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center text-slate-400">
        Loading Map...
      </div>
    ),
  }
);

export default function MetroMapPage() {

  const [network, setNetwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stationCrowd, setStationCrowd] = useState<any>(null);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/metro/network");
        const data = await response.json();

        console.log(data); // Check data in browser console

        setNetwork(data);
      } catch (error) {
        console.error("Error fetching metro network:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, []);

  useEffect(() => {
    if (!selectedStation) return;

    const loadStationData = async () => {
      setLoadingAI(true);

      // Load crowd information
      const crowd = await apiService.getCrowdStatus(
        selectedStation.station_id
      );

      setStationCrowd(crowd);

      if (crowd.error) {
        setAiRecommendation("No data available.");
        setLoadingAI(false);
        return;
      }

      // Load AI recommendation
      const ai = await apiService.getAIRecommendation(
        selectedStation.station_name,
        crowd.current_passengers || 0,
        (crowd.capacity_percentage || 0) >= 80
      );

      if (ai.status === "success") {
        setAiRecommendation(ai.recommendation);
      } else {
        setAiRecommendation("Unable to generate recommendation.");
      }

      setLoadingAI(false);
    };

    loadStationData();
  }, [selectedStation]);

  const filteredStations = Array.from(
    new Map(
      ((network?.routes ?? [])
        .flatMap((route: any) => route.stations || [])
        .filter(Boolean) as any[])
        .map((station: any) => [
          `${station.station_id}-${station.latitude}-${station.longitude}`,
          station,
        ])
    ).values()
  ).filter(
    (station: any) =>
      station.station_name &&
      station.station_name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getRouteColor = (name: string) => {

    const upper = name.toUpperCase();

    if (upper.includes("RED")) return "bg-red-600";
    if (upper.includes("BLUE")) return "bg-blue-600";
    if (upper.includes("YELLOW")) return "bg-yellow-400 text-black";
    if (upper.includes("GREEN")) return "bg-green-600";
    if (upper.includes("VIOLET")) return "bg-purple-600";
    if (upper.includes("PINK")) return "bg-pink-600";
    if (upper.includes("MAGENTA")) return "bg-fuchsia-600";
    if (upper.includes("ORANGE")) return "bg-orange-500";
    if (upper.includes("GRAY")) return "bg-gray-500";
    if (upper.includes("RAPID")) return "bg-cyan-500";

    return "bg-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" >

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Metro Network
        </h1>

        <p className="text-slate-400 mt-2">
          Live Network Overview
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
          <Train className="text-cyan-400 mb-3" />
          <p className="text-slate-400">Total Stations</p>
          <h2 className="text-3xl font-bold">{network?.total_stations ?? 0}</h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
          <Route className="text-green-400 mb-3" />
          <p className="text-slate-400">Metro Lines</p>
          <h2 className="text-3xl font-bold">{network?.metro_lines ?? 0}</h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
          <MapPinned className="text-yellow-400 mb-3" />
          <p className="text-slate-400">Interchange</p>
          <h2 className="text-3xl font-bold">{network?.interchange ?? 0}</h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
          <Activity className="text-red-400 mb-3" />
          <p className="text-slate-400">Operational</p>
          <h2 className="text-3xl font-bold">{network?.operational ?? "N/A"}</h2>
        </div>

      </div >
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span> Red
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span> Blue
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Yellow
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> Green
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span> Violet
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-pink-500"></span> Pink
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span> Orange
        </div>
      </div>

      {/* Metro Map */}

      < div className="bg-slate-900 rounded-xl border border-slate-700 p-8 mb-8" >

        <h2 className="text-2xl font-bold mb-6">
          Metro Route Map
        </h2>
        <div className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search station..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;

              setSearch(value);
              setShowSuggestions(true);

              if (value.trim() === "") {
                setSelectedStation(null);
              }
            }}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
          />

          <button
            onClick={() => {
              setSelectedStation(null);
              setSelectedRoute(null);
              setSearch("");
              setShowSuggestions(false);
              setStationCrowd(null);
              setAiRecommendation("");
            }}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            ↺ Reset
          </button>
        </div>
        {
          showSuggestions && search.length > 0 && (
            <div className="mt-2 bg-slate-800 rounded-lg max-h-60 overflow-y-auto">

              {filteredStations
                .slice(0, 10)
                .map((station: any) => (
                  <div
                    key={`${station.station_id}-${station.latitude}-${station.longitude}`}
                    onClick={() => {
                      setSelectedStation(station);
                      setSearch(station.station_name);
                      setShowSuggestions(false);
                    }}
                    className="p-3 cursor-pointer hover:bg-slate-700 border-b border-slate-700"
                  >
                    {station.station_name}
                  </div>
                ))}
              {filteredStations.length === 0 && (
                <div className="p-4 text-center text-slate-400">
                  🔍 No station found
                </div>
              )}

            </div>
          )
        }
      </div >

      <div className="h-[450px] rounded-xl border border-slate-700 overflow-hidden mt-3">

        {!loading && network ? (
          <MetroLeafletMap
            network={network}
            selectedRoute={selectedRoute}
            selectedStation={selectedStation}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Loading Metro Map...
          </div>
        )}

      </div>

      {/* Metro Lines */}

      <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {network?.routes?.map((route: any, index: number) => (

          <div
            key={route.route_id}
            onClick={() =>
              setSelectedRoute(
                selectedRoute === route.route_id ? null : route.route_id
              )
            }
            className={`
                ${getRouteColor(route.route_name || route.route_long_name || "")}
                rounded-lg
                p-3
                cursor-pointer
                transition-all
                duration-300
                hover:scale-[1.02]
                ${selectedRoute === route.route_id
                ? "ring-2 ring-cyan-400"
                : ""
              }
           `}
          >

            <h3 className="font-semibold text-sm leading-snug">
              {route.route_name || route.route_long_name || `Line ${index + 1}`}
            </h3>

            <p className="mt-1 text-xs">
              🚉 {route.stations.length} Stations
            </p>

          </div>

        ))}

      </div>
      {
        selectedRoute && (
          <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">

            {network.routes
              .filter((route: any) => route.route_id === selectedRoute)
              .map((route: any) => (
                <div key={route.route_id}>

                  <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                    {route.route_name}
                  </h2>

                  <div className="space-y-4">

                    {route.stations.map((station: any) => (

                      <div
                        key={`${station.station_id}-${station.latitude}-${station.longitude}`}
                        onClick={() => {
                          const count = network.routes
                            .flatMap((r: any) => r.stations)
                            .filter((s: any) => s.station_id === station.station_id).length;

                          setSelectedStation({
                            ...station,
                            is_interchange: count > 1,
                          });
                          setSearch(station.station_name);
                        }}
                        className="flex items-center gap-4 cursor-pointer hover:bg-slate-800 rounded-lg p-2 transition"
                      >
                        <div className="w-4 h-4 rounded-full bg-cyan-400"></div>

                        <div className="flex-1 bg-slate-800 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold">{station.station_name}</h3>

                            {network.routes.filter((r: any) =>
                              r.stations.some((s: any) => s.station_id === station.station_id)
                            ).length > 1 && (
                                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                                  Interchange
                                </span>
                              )}
                          </div>

                          <p className="text-sm text-slate-400">
                            {station.latitude}
                          </p>

                          <p className="text-sm text-slate-400">
                            {station.longitude}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>
              ))}

          </div>
        )
      }
      {selectedStation && (
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            📍 Station Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-slate-400 text-sm">Station Name</p>
              <h3 className="text-xl font-bold">
                {selectedStation.station_name}
              </h3>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Status</p>

              <h3 className="font-semibold text-green-400">
                {stationCrowd?.message ?? "Loading..."}
              </h3>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Latitude</p>
              <p>{selectedStation.latitude}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Longitude</p>
              <p>{selectedStation.longitude}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Station ID</p>
              <p>{stationCrowd?.station_id ?? selectedStation.station_id}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Passengers</p>
              <p>
                {stationCrowd?.current_passengers ?? "Loading..."}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Capacity</p>
              <p>
                {stationCrowd?.capacity_percentage ?? "--"}%
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Crowd Level</p>
              <p>
                {stationCrowd?.emoji} {stationCrowd?.status}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Updated</p>
              <p>
                {stationCrowd?.timestamp ?? "Live"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-slate-400 text-sm mb-2">
                Metro Line(s)
              </p>

              <div className="flex flex-wrap gap-2">

                {network.routes
                  .filter((route: any) =>
                    route.stations.some(
                      (s: any) =>
                        s.station_id === selectedStation.station_id &&
                        s.latitude === selectedStation.latitude &&
                        s.longitude === selectedStation.longitude
                    )
                  )
                  .map((route: any) => (
                    <span
                      key={route.route_id}
                      className={`${getRouteColor(route.route_name)} px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      🚇 {route.route_name}
                    </span>
                  ))}

              </div>
            </div>
            {network.routes.filter((route: any) =>
              route.stations.some(
                (s: any) =>
                  s.station_id === selectedStation.station_id &&
                  s.latitude === selectedStation.latitude &&
                  s.longitude === selectedStation.longitude
              )
            ).length > 1 && (

                <div className="md:col-span-2">
                  <span className="bg-yellow-500 text-black px-3 py-2 rounded-lg font-semibold">
                    🔄 Interchange Station
                  </span>
                </div>

              )}
          </div>

        </div>
      )}

      {selectedStation && (
        <div className="md:col-span-2 mt-6">
          <div className="bg-slate-800 rounded-xl p-5 border border-cyan-500">

            <h3 className="text-cyan-400 font-bold text-lg mb-3">
              🤖 AI Operational Recommendation
            </h3>

            {loadingAI ? (
              <p className="text-slate-400">
                🤖 Generating recommendation...
              </p>
            ) : (
              <p className="text-green-400 whitespace-pre-line">
                {aiRecommendation}
              </p>
            )}

          </div>
        </div>
      )}
    </div >

  );
}