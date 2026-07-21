import { useMemo, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

import useMetro from "../../hooks/useMetro";

import MetroLine from "./MetroLine";
import MetroStationNode from "./MetroStationNode";
import MetroTrain from "./MetroTrain";
import StationPopup from "./StationPopup";
import HeatmapLayer from "./HeatmapLayer";
import PassengerFlow from "./PassengerFlow";

import {
  metroLayout,
  stationPositions,
} from "../../data/metroLayout";

// ==========================================
// Metro Line Colors
// ==========================================

const lineColors = {
  blue: "#2563eb",
  yellow: "#facc15",
  red: "#ef4444",
  green: "#22c55e",
  violet: "#7c3aed",
  pink: "#ec4899",
};

// ==========================================
// Component
// ==========================================

function MetroNetworkMap({ stations }) {
  // ==========================================
  // Local Popup State
  // ==========================================

  const [popupStation, setPopupStation] =
    useState(null);

  // ==========================================
  // Global Metro Context
  // ==========================================

  const {
    selectedStation,
    highlightStation,
  } = useMetro();

  // ==========================================
  // Filter only mapped stations
  // ==========================================

  const mappedStations = useMemo(() => {
    return stations.filter(
      (station) =>
        stationPositions[station.station]
    );
  }, [stations]);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50">

        {/* ================= Header ================= */}

        <div className="absolute top-6 left-6 z-30">

          <h2 className="text-3xl font-bold text-slate-900">
            Delhi Metro Live Network
          </h2>

          <p className="text-slate-500">
            AI Powered Real-Time Passenger Monitoring
          </p>

        </div>

        {/* ================= Legend ================= */}

        <div className="absolute top-6 right-6 z-30 flex gap-6 rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur-md">

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-green-500"></span>

            <span className="text-sm font-medium">
              Low
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>

            <span className="text-sm font-medium">
              Medium
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-red-500"></span>

            <span className="text-sm font-medium">
              High
            </span>

          </div>

        </div>

        {/* ================= Zoom Wrapper ================= */}

        <TransformWrapper
          initialScale={1}
          minScale={0.6}
          maxScale={3}
          wheel={{ step: 0.15 }}
          doubleClick={{ disabled: true }}
          centerOnInit
        >
          {({
            zoomIn,
            zoomOut,
            resetTransform,
          }) => (
            <>
              {/* ================= Zoom Controls ================= */}

              <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                <button
                  onClick={() => zoomIn()}
                  className="rounded-xl p-3 transition hover:bg-slate-100"
                >
                  <ZoomIn size={20} />
                </button>

                <button
                  onClick={() => zoomOut()}
                  className="rounded-xl p-3 transition hover:bg-slate-100"
                >
                  <ZoomOut size={20} />
                </button>

                <button
                  onClick={() => resetTransform()}
                  className="rounded-xl p-3 transition hover:bg-slate-100"
                >
                  <RotateCcw size={20} />
                </button>

              </div>

              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "850px",
                }}
              >
                <svg
                  viewBox="0 0 1600 1000"
                  className="h-[850px] w-full"
                >

                  <defs>

                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M40 0 L0 0 0 40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    </pattern>

                    <radialGradient
                      id="bgGlow"
                      cx="50%"
                      cy="50%"
                      r="80%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ffffff"
                      />

                      <stop
                        offset="100%"
                        stopColor="#f1f5f9"
                      />

                    </radialGradient>

                  </defs>

                  {/* ================= Background ================= */}

                  <rect
                    width="1600"
                    height="1000"
                    fill="url(#bgGlow)"
                  />

                  <rect
                    width="1600"
                    height="1000"
                    fill="url(#grid)"
                  />
                                    {/* ================= Heatmap ================= */}

                  <HeatmapLayer
                    stations={mappedStations}
                    positions={stationPositions}
                  />

                  {/* ================= Metro Lines ================= */}

                  {Object.entries(metroLayout).map(
                    ([line, lineStations]) => (
                      <MetroLine
                        key={line}
                        stations={lineStations}
                        positions={stationPositions}
                        color={lineColors[line]}
                      />
                    )
                  )}

                  {/* ================= Passenger Flow ================= */}

                  {Object.entries(metroLayout).map(
                    ([line, lineStations]) => (
                      <PassengerFlow
                        key={`${line}-flow`}
                        stations={lineStations}
                        positions={stationPositions}
                        color={lineColors[line]}
                        duration={7}
                      />
                    )
                  )}

                  {/* ================= Animated Trains ================= */}

                  {Object.entries(metroLayout).map(
                    ([line, lineStations]) => (
                      <MetroTrain
                        key={`${line}-train`}
                        stations={lineStations}
                        positions={stationPositions}
                        color={lineColors[line]}
                      />
                    )
                  )}

                  {/* ================= Stations ================= */}

                  {mappedStations.map((station) => {
                    const pos =
                      stationPositions[station.station];

                    return (
                      <MetroStationNode
                        key={station.station}
                        station={station}
                        x={pos.x}
                        y={pos.y}
                        selected={
                          selectedStation ===
                          station.station
                        }
                        onClick={(clickedStation) => {
                          setPopupStation(
                            clickedStation
                          );

                          highlightStation(
                            clickedStation.station
                          );
                        }}
                      />
                    );
                  })}
                                  </svg>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

      </div>

      {/* ================= Station Popup ================= */}

      {popupStation && (
        <StationPopup
          station={popupStation}
          onClose={() => setPopupStation(null)}
        />
      )}

      {/* ================= Selected Station Indicator ================= */}

      {selectedStation && (
        <div className="fixed bottom-6 left-6 z-50 rounded-2xl bg-white shadow-2xl border border-indigo-200 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="relative">

              <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-indigo-400 opacity-70"></span>

              <span className="relative inline-flex h-4 w-4 rounded-full bg-indigo-600"></span>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Selected Station
              </p>

              <p className="font-bold text-indigo-700">
                {selectedStation}
              </p>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default MetroNetworkMap;