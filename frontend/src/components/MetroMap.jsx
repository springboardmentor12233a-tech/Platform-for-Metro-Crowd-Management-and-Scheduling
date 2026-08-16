import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";

import "./MetroMap.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DEFAULT_CENTER = {
  lat: 28.6139,
  lng: 77.2090,
};

/* =========================================================
   DRAW METRO LINES
========================================================= */

function MetroLines({ lines, stations }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google || !lines?.length || !stations?.length) {
      return;
    }

    // IMPORTANT:
    // Use the native JavaScript Map.
    const stationMap = new globalThis.Map(
      stations.map((station) => [station.id, station])
    );

    const polylines = [];

    lines.forEach((line) => {
      const path = line.stations
        .map((stationId) => stationMap.get(stationId))
        .filter(Boolean)
        .map((station) => ({
          lat: Number(station.latitude),
          lng: Number(station.longitude),
        }));

      if (path.length < 2) {
        return;
      }

      const polyline = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: line.color,
        strokeOpacity: 0.95,
        strokeWeight: 5,
        clickable: false,
        map,
      });

      polylines.push(polyline);
    });

    return () => {
      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });
    };
  }, [map, lines, stations]);

  return null;
}

/* =========================================================
   STATION MARKER
========================================================= */

function StationMarker({
  station,
  selectedStation,
  setSelectedStation,
  lineColors,
}) {
  const colors = (station.lines || [])
    .map((lineName) => lineColors[lineName])
    .filter(Boolean);

  const primaryColor = colors[0] || "#2563EB";

  const isInterchange =
    station.interchange === true || colors.length > 1;

  return (
    <>
      <AdvancedMarker
        position={{
          lat: Number(station.latitude),
          lng: Number(station.longitude),
        }}
        onClick={() => setSelectedStation(station)}
      >
        <div
          className={
            isInterchange
              ? "metro-marker interchange-marker"
              : "metro-marker"
          }
        >
          {isInterchange ? (
            <div
              className="interchange-ring"
              style={{
                background:
                  colors.length === 1
                    ? colors[0]
                    : `conic-gradient(${colors.join(", ")})`,
              }}
            >
              <div className="marker-inner" />
            </div>
          ) : (
            <div
              className="normal-marker"
              style={{
                backgroundColor: primaryColor,
              }}
            />
          )}
        </div>
      </AdvancedMarker>

      {selectedStation?.id === station.id && (
        <InfoWindow
          position={{
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          }}
          onCloseClick={() => setSelectedStation(null)}
        >
          <div className="station-info">
            <h3>{station.name}</h3>

            <div className="station-lines">
              {(station.lines || []).map((line) => (
                <span
                  key={line}
                  className="line-badge"
                  style={{
                    backgroundColor:
                      lineColors[line] || "#64748b",
                  }}
                >
                  {line}
                </span>
              ))}
            </div>

            {isInterchange && (
              <p className="interchange-text">
                🔄 Interchange Station
              </p>
            )}

            <p className="station-coordinates">
              {Number(station.latitude).toFixed(4)},{" "}
              {Number(station.longitude).toFixed(4)}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

/* =========================================================
   MAIN METRO MAP
========================================================= */

function MetroMap({ stations = [], metroLines = [] }) {
  const [selectedStation, setSelectedStation] = useState(null);

  /* =======================================================
     LINE COLORS
  ======================================================= */

  const lineColors = useMemo(() => {
    const colors = {};

    metroLines.forEach((line) => {
      const normalizedName = line.name
        .replace(" Line", "")
        .trim();

      colors[normalizedName] = line.color;
      colors[line.name] = line.color;
    });

    return colors;
  }, [metroLines]);

  /* =======================================================
     MAP CENTER
  ======================================================= */

  const center = useMemo(() => {
    if (!stations.length) {
      return DEFAULT_CENTER;
    }

    const validStations = stations.filter(
      (station) =>
        Number.isFinite(Number(station.latitude)) &&
        Number.isFinite(Number(station.longitude))
    );

    if (!validStations.length) {
      return DEFAULT_CENTER;
    }

    const totalLat = validStations.reduce(
      (sum, station) => sum + Number(station.latitude),
      0
    );

    const totalLng = validStations.reduce(
      (sum, station) => sum + Number(station.longitude),
      0
    );

    return {
      lat: totalLat / validStations.length,
      lng: totalLng / validStations.length,
    };
  }, [stations]);

  /* =======================================================
     API KEY CHECK
  ======================================================= */

  if (!API_KEY) {
    return (
      <div className="map-error">
        <h3>Google Maps API Key Missing</h3>

        <p>
          Add VITE_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      </div>
    );
  }

  /* =======================================================
     MAP
  ======================================================= */

  return (
    <div className="metro-map-container">
      <APIProvider apiKey={API_KEY}>
        <GoogleMap
          className="metro-google-map"
          defaultCenter={center}
          defaultZoom={11}
          mapId="METROFLOW_MAP"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={true}
          fullscreenControl={true}
          streetViewControl={false}
          clickableIcons={false}
        >
          {/* METRO LINES */}
          <MetroLines
            lines={metroLines}
            stations={stations}
          />

          {/* STATIONS */}
          {stations.map((station) => (
            <StationMarker
              key={station.id}
              station={station}
              selectedStation={selectedStation}
              setSelectedStation={setSelectedStation}
              lineColors={lineColors}
            />
          ))}
        </GoogleMap>
      </APIProvider>

      {/* ===================================================
          MAP LEGEND
      =================================================== */}

      <div className="metro-map-legend">
        <h3>Metro Lines</h3>

        {metroLines.map((line) => (
          <div className="legend-item" key={line.id}>
            <span
              className="legend-color"
              style={{
                backgroundColor: line.color,
              }}
            />

            <span>{line.name}</span>
          </div>
        ))}

        <div className="legend-divider" />

        <div className="legend-item">
          <span className="legend-normal" />
          <span>Normal Station</span>
        </div>

        <div className="legend-item">
          <span className="legend-interchange">
            <span />
          </span>

          <span>Interchange</span>
        </div>
      </div>

      {/* ===================================================
          STATION COUNT
      =================================================== */}

      <div className="metro-map-count">
        <strong>{stations.length}</strong>
        <span>Stations</span>
      </div>
    </div>
  );
}

export default MetroMap;