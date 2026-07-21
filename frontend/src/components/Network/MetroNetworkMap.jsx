import { useEffect, useState } from "react";

import useMetro from "../../hooks/useMetro";

import metroNetworkData from "./metroNetworkData";
import MetroStation from "./MetroStation";
import TrainMarker from "./TrainMarker";
import NetworkStats from "./NetworkStats";
import NetworkHeader from "./NetworkHeader";
import MetroLegend from "./MetroLegend";

function MetroNetworkMap() {
  const { selectedStation } = useMetro();

  const [trains, setTrains] = useState(metroNetworkData.trains);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => {
          // Blue Line → Left to Right
          if (train.line === "Blue") {
            let nextX = train.x + 8;

            if (nextX > 700) {
              nextX = 80;
            }

            return {
              ...train,
              x: nextX,
            };
          }

          // Yellow Line → Top to Bottom
          if (train.line === "Yellow") {
            let nextY = train.y + 8;

            if (nextY > 420) {
              nextY = 80;
            }

            return {
              ...train,
              y: nextY,
            };
          }

          return train;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
        {/* Header */}
        <NetworkHeader />

        {/* Metro Map */}
        <div className="relative h-[600px] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #94a3b8 1px, transparent 1px),
                linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Blue Line */}
          <div className="absolute left-[80px] top-[258px] h-[6px] w-[640px] rounded-full bg-blue-600 shadow-md" />

          {/* Yellow Line */}
          <div className="absolute left-[388px] top-[80px] h-[340px] w-[6px] rounded-full bg-yellow-400 shadow-md" />

          {/* Stations */}
          {metroNetworkData.stations.map((station) => (
            <MetroStation
              key={station.id}
              station={station}
              selected={selectedStation === station.name}
            />
          ))}

          {/* Trains */}
          {trains.map((train) => (
            <TrainMarker
              key={train.id}
              train={train}
            />
          ))}

          {/* LIVE Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-sm font-semibold">
                LIVE
              </span>
            </div>
          </div>

          {/* Selected Station Indicator */}
          {selectedStation && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-xl shadow-lg px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Selected Station
              </p>
              <p className="font-bold text-blue-700 text-lg">
                {selectedStation}
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <MetroLegend />

        {/* Statistics */}
        <NetworkStats />
      </div>
    </section>
  );
}

export default MetroNetworkMap;