import { useEffect, useMemo, useState } from "react";
import MetroMap from "../components/MetroMap";

import "./DelhiMetro.css";
function DelhiMetro() {
  const [stations, setStations] = useState([]);
  const [metroLines, setMetroLines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD METRO DATA
  ========================================================= */

  useEffect(() => {
    async function loadMetroData() {
      try {
        setLoading(true);
        setError("");

        const [stationsResponse, linesResponse] =
          await Promise.all([
            fetch("/data/stations.json"),
            fetch("/data/metroLines.json"),
          ]);

        if (!stationsResponse.ok) {
          throw new Error(
            `Unable to load stations.json (${stationsResponse.status})`
          );
        }

        if (!linesResponse.ok) {
          throw new Error(
            `Unable to load metroLines.json (${linesResponse.status})`
          );
        }

        const stationsData = await stationsResponse.json();
        const linesData = await linesResponse.json();

        if (!Array.isArray(stationsData)) {
          throw new Error(
            "stations.json must contain an array of stations."
          );
        }

        if (!Array.isArray(linesData)) {
          throw new Error(
            "metroLines.json must contain an array of metro lines."
          );
        }

        setStations(stationsData);
        setMetroLines(linesData);
      } catch (err) {
        console.error("Metro data loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load metro data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMetroData();
  }, []);

  /* =========================================================
     FILTER STATIONS
  ========================================================= */

  const filteredStations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return stations;
    }

    return stations.filter((station) =>
      station.name?.toLowerCase().includes(searchValue)
    );
  }, [stations, search]);

  /* =========================================================
     INTERCHANGE COUNT
  ========================================================= */

  const interchangeCount = useMemo(() => {
    return stations.filter(
      (station) =>
        station.interchange === true ||
        (station.lines?.length || 0) > 1
    ).length;
  }, [stations]);

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="delhi-metro-page">
        <div className="map-loading">
          <div className="loading-spinner"></div>

          <h3>Loading Delhi Metro Network...</h3>

          <p>
            Please wait while the station and metro-line data
            are loaded.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="delhi-metro-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="metro-page-header">

        <div>
          <h1>Delhi Metro Network</h1>

          <p>
            Explore Delhi Metro stations, lines and network
            connectivity.
          </p>
        </div>

        <div className="station-count">
          <strong>{stations.length}</strong>

          <span>Stations Loaded</span>
        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="metro-data-error">
          <strong>Data Loading Error:</strong>{" "}
          {error}
        </div>
      )}


      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="metro-layout">

        {/* ===================================================
            LEFT — STATION PANEL
        =================================================== */}

        <div className="station-panel">

          <h2>Metro Stations</h2>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* STATION LIST */}

          <div className="station-list">

            {filteredStations.length === 0 ? (
              <div className="no-stations">
                No station found.
              </div>
            ) : (
              filteredStations.map((station) => {

                const isInterchange =
                  station.interchange === true ||
                  (station.lines?.length || 0) > 1;

                return (
                  <div
                    className="metro-station"
                    key={station.id}
                  >

                    {/* STATION DOT */}

                    <div
                      className="station-dot"
                      style={{
                        backgroundColor: isInterchange
                          ? "#7c3aed"
                          : "#2563eb",
                      }}
                    />

                    {/* STATION DETAILS */}

                    <div className="station-details">

                      <strong>
                        {station.name}
                      </strong>

                      <span>
                        {(station.lines || []).join(" / ")}
                      </span>

                      {isInterchange && (
                        <small className="interchange-label">
                          Interchange Station
                        </small>
                      )}

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>


        {/* ===================================================
            RIGHT — MAP PANEL
        =================================================== */}

        <div className="map-panel">

          {/* MAP HEADER */}

          <div className="map-header">

            <div>
              <h2>Delhi Metro Map</h2>

              <p>
                Station locations and metro-line connections
              </p>
            </div>


            {/* MAP STATISTICS */}

            <div className="map-stats">

              <div>
                <strong>
                  {stations.length}
                </strong>

                <span>
                  Stations
                </span>
              </div>


              <div>
                <strong>
                  {metroLines.length}
                </strong>

                <span>
                  Lines
                </span>
              </div>


              <div>
                <strong>
                  {interchangeCount}
                </strong>

                <span>
                  Interchanges
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
              MAP

              IMPORTANT:
              Do NOT wrap MetroMap in another
              .metro-map-container.
          ================================================= */}

          {error ? (
            <div className="map-loading">

              <h3>
                Map unavailable
              </h3>

              <p>
                Please check the metro data files.
              </p>

            </div>
          ) : stations.length === 0 ? (
            <div className="map-loading">

              <h3>
                No station data available
              </h3>

              <p>
                Add station data to stations.json.
              </p>

            </div>
          ) : (
            <MetroMap
              stations={stations}
              metroLines={metroLines}
            />
          )}

        </div>

      </div>

          </div>
  );
}

export default DelhiMetro;