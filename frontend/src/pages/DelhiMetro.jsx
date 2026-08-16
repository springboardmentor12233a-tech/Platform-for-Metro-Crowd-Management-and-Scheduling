import { useEffect, useState } from "react";

import MetroMap from "../components/MetroMap";
import CrowdPrediction from "../components/CrowdPrediction";

import "./DelhiMetro.css";

function DelhiMetro() {
  const [stations, setStations] = useState([]);
  const [metroLines, setMetroLines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     LOAD METRO DATA
  ========================================= */

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
          throw new Error("Unable to load stations.json");
        }

        if (!linesResponse.ok) {
          throw new Error("Unable to load metroLines.json");
        }

        const stationsData =
          await stationsResponse.json();

        const linesData =
          await linesResponse.json();

        setStations(stationsData);
        setMetroLines(linesData);
      } catch (err) {
        console.error(
          "Metro data loading error:",
          err
        );

        setError(
          err.message ||
          "Unable to load metro data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMetroData();
  }, []);

  /* =========================================
     FILTER STATIONS
  ========================================= */

  const filteredStations = stations.filter((station) =>
    station.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="delhi-metro-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="metro-page-header">

        <div>
          <h1>Delhi Metro Network</h1>

          <p>
            Explore Delhi Metro stations,
            lines and network connectivity.
          </p>
        </div>

        <div className="station-count">

          <strong>
            {stations.length}
          </strong>

          <span>
            Stations Loaded
          </span>

        </div>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div
          className="metro-error-message"
        >
          <strong>
            Data Loading Error:
          </strong>{" "}
          {error}
        </div>
      )}


      {/* =====================================
          MAIN METRO LAYOUT
      ===================================== */}

      <div className="metro-layout">

        {/* ===================================
            LEFT — STATION PANEL
        =================================== */}

        <div className="station-panel">

          <h2>
            Metro Stations
          </h2>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search station..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* STATION LIST */}

          {loading ? (

            <p className="loading-text">
              Loading metro stations...
            </p>

          ) : (

            <div className="station-list">

              {filteredStations.length === 0 ? (

                <p className="no-stations">
                  No station found.
                </p>

              ) : (

                filteredStations.map(
                  (station) => (

                    <div
                      className="metro-station"
                      key={station.id}
                    >

                      {/* STATION DOT */}

                      <div
                        className="station-dot"
                        style={{
                          background:
                            station.interchange
                              ? "#7c3aed"
                              : "#1976d2",
                        }}
                      />

                      {/* STATION INFORMATION */}

                      <div>

                        <strong>
                          {station.name}
                        </strong>

                        <span>
                          {station.lines.join(" / ")}
                        </span>

                        {station.interchange && (
                          <small className="interchange-label">
                            Interchange Station
                          </small>
                        )}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          )}

        </div>


        {/* ===================================
            RIGHT — MAP
        =================================== */}

        <div className="map-panel">

          {/* MAP HEADER */}

          <div className="map-header">

            <div>

              <h2>
                Delhi Metro Map
              </h2>

              <p>
                Station locations and
                metro-line connections
              </p>

            </div>

            <div className="map-stats">

              <span>
                <strong>
                  {stations.length}
                </strong>{" "}
                Stations
              </span>

              <span>
                <strong>
                  {metroLines.length}
                </strong>{" "}
                Lines
              </span>

            </div>

          </div>


          {/* GOOGLE MAP */}

          <div className="metro-map-container">

            {loading ? (

              <div className="map-loading">

                <h3>
                  Loading Delhi Metro Map...
                </h3>

                <p>
                  Please wait while station
                  data is loaded.
                </p>

              </div>

            ) : error ? (

              <div className="map-loading">

                <h3>
                  Map unavailable
                </h3>

                <p>
                  Check the metro data files.
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


      {/* =====================================
          AI CROWD PREDICTION

          IMPORTANT:
          OUTSIDE metro-layout
          OUTSIDE map-panel
          OUTSIDE metro-map-container
      ===================================== */}

      {!loading && !error && (

        <section className="crowd-prediction-section">

          <div className="crowd-section-header">

            <h2>
              AI Crowd Prediction
            </h2>

            <p>
              Select a station, date and time
              to analyze passenger crowd,
              occupancy, congestion and
              train conditions.
            </p>

          </div>

          <CrowdPrediction />

        </section>

      )}

    </div>
  );
}

export default DelhiMetro;