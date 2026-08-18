"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Fragment } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const lineColors: Record<string, string> = {
  RED: "#e11d48",
  BLUE: "#2563eb",
  YELLOW: "#facc15",
  GREEN: "#16a34a",
  VIOLET: "#7c3aed",
  PINK: "#ec4899",
  MAGENTA: "#d946ef",
  ORANGE: "#fb923c",
  AQUA: "#06b6d4",
  GRAY: "#6b7280",
  RAPID: "#14b8a6"
};
const interchangeStations = [
  "Rajiv Chowk",
  "Kashmere Gate",
  "Central Secretariat",
  "Mandi House",
  "Botanical Garden",
  "Yamuna Bank",
  "Kirti Nagar",
  "Inderlok",
  "New Delhi",
  "Azadpur"
];
function FitBounds({ routes, selectedStation, network }: any) {
  const map = useMap();

  const positions = routes.flatMap((r: any) =>
    r.stations.map((s: any) => [s.latitude, s.longitude])
  );

  useEffect(() => {
    // Don't fit bounds if a station is selected
    if (selectedStation) return;

    if (positions.length > 0) {
      map.fitBounds(positions, {
        padding: [40, 40],
        maxZoom: 13,
      });
    }
  }, [routes, map, selectedStation, network]);

  return null;
}

function FlyToStation({ station }: any) {
  const map = useMap();

  useEffect(() => {
    if (!station) return;

    map.setView(
      [station.latitude, station.longitude],
      12,
      {
        animate: false,
      }
    );
  }, [station, map]);

  return null;
}

export default function MetroLeafletMap(
  {
    network,
    selectedRoute,
    selectedStation,
  }: {
    network: any;
    selectedRoute: number | null;
    selectedStation: any;
  }
) {

  if (!network || !network.routes) {
    return <div>Loading...</div>;
  }
  // Remove duplicate stations
  const uniqueStations = Array.from(
    new Map(
      network.routes
        .flatMap((route: any) => route.stations || [])
        .map((station: any) => [
          `${station.station_id}-${station.latitude}-${station.longitude}`,
          station,
        ])
    ).values()
  );
  const getMarkerIcon = (station: any) => {
    let color = "#22c55e"; // Normal

    if (
      station.crowd_level === 3 ||
      station.status?.toLowerCase() === "crowded"
    ) {
      color = "#facc15"; // Crowded
    }

    if (
      station.crowd_level === 4 ||
      station.status?.toLowerCase() === "critical"
    ) {
      color = "#ef4444"; // Critical
    }

    return L.divIcon({
      className: "",
      html: `
      <div style="
        width:14px;
        height:14px;
        border-radius:50%;
        background:${color};
        border:2px solid white;
        box-shadow:0 0 10px ${color};
      "></div>
    `,
    });
  };

  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={10}
      scrollWheelZoom={true}
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds
        routes={
          selectedRoute === null
            ? network.routes
            : network.routes.filter(
              (r: any) => r.route_id === selectedRoute
            )
        }
        selectedStation={selectedStation}
        network={network}
      />
      <FlyToStation station={selectedStation} />

      {network.routes
        .filter(
          (route: any) =>
            selectedRoute === null ||
            route.route_id === selectedRoute
        )
        .map((route: any, index: number) => {

          const name = route.route_name.toUpperCase();

          let color = "#2563eb";

          Object.keys(lineColors).forEach((key) => {
            if (name.includes(key)) {
              color = lineColors[key];
            }
          });

          return (
            <Polyline
              key={`${route.route_id}-${index}`}
              positions={
                route.stations?.map((s: any) => [
                  s.latitude,
                  s.longitude,
                ]) || []
              }
              pathOptions={{
                color,
                weight: 6,
              }}
            />
          );
        })}

      {uniqueStations.map((station: any, index: number) => {

        return (
          <Fragment key={`${station.station_id}-${index}`}>
            {selectedStation &&
              selectedStation.station_id === station.station_id &&
              selectedStation.latitude === station.latitude &&
              selectedStation.longitude === station.longitude && (
                <CircleMarker
                  center={[station.latitude, station.longitude]}
                  radius={15}
                  pathOptions={{
                    color: "#22d3ee",
                    fillColor: "#22d3ee",
                    fillOpacity: 0.25,
                    weight: 3,
                  }}
                />
              )}

            {interchangeStations.includes(station.station_name) && (
              <CircleMarker
                center={[station.latitude, station.longitude]}
                radius={10}
                pathOptions={{
                  color: "#facc15",
                  fillOpacity: 0,
                  weight: 3,
                }}
              />
            )}
            <Marker
              key={`${station.station_id}-${station.crowd_level}-${index}`}
              position={[station.latitude, station.longitude]}
              icon={getMarkerIcon(station)}
            >
              <Popup>
                <div className="space-y-1 min-w-[180px]">
                  <h3 className="font-bold text-base">
                    📍 {station.station_name}
                  </h3>

                  <p>👥 Passengers: {station.current_passengers ?? "N/A"}</p>

                  <p>📊 Capacity: {station.capacity_percentage ?? "N/A"}%</p>

                  <p>
                    Crowd:
                    {station.crowd_level === 4
                      ? "🔴 Critical"
                      : station.crowd_level === 3
                        ? "🟡 Crowded"
                        : "🟢 Normal"}
                  </p>

                  <p>🕒 Updated: Live</p>
                </div>
              </Popup>
            </Marker>
          </Fragment>
        );
      })}
    </MapContainer >
  );
}