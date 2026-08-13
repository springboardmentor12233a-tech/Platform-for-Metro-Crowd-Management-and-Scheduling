import { useEffect, useState } from "react";
import api from "../services/api";

const CrowdPrediction = () => {
  const [station, setStation] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [stations, setStations] = useState([]);

  const [result, setResult] = useState(null);

  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // LOAD STATIONS
  // ============================================================

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoadingStations(true);
        setError("");

        const response = await api.get("/data/stations");

        setStations(response.data.stations || []);
      } catch (err) {
        console.error("Station loading error:", err);

        setError(
          "Unable to load stations. Please make sure the FastAPI server is running."
        );
      } finally {
        setLoadingStations(false);
      }
    };

    loadStations();
  }, []);

  // ============================================================
  // HANDLE PREDICTION
  // ============================================================

  const handlePredict = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!station) {
      setError("Please select a station.");
      return;
    }

    if (!targetDate) {
      setError("Please select a date.");
      return;
    }

    try {
      setLoadingPrediction(true);

      const response = await api.post("/data/predict", {
        station: station,
        target_date: targetDate,
      });

      setResult(response.data);
    } catch (err) {
      console.error("Prediction error:", err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Prediction failed. Please make sure the FastAPI server is running."
        );
      }
    } finally {
      setLoadingPrediction(false);
    }
  };

  // ============================================================
  // CROWD COLOR
  // ============================================================

  const getCrowdColor = (level) => {
    if (level === "High") {
      return "#e53935";
    }

    if (level === "Medium") {
      return "#fb8c00";
    }

    return "#43a047";
  };

  // ============================================================
  // CROWD ICON
  // ============================================================

  const getCrowdIcon = (level) => {
    if (level === "High") {
      return "🔴";
    }

    if (level === "Medium") {
      return "🟠";
    }

    return "🟢";
  };

  // ============================================================
  // COMPARISON BAR WIDTH
  // ============================================================

  const getBarWidth = (value) => {
    if (!result) {
      return 0;
    }

    const values = [
      Number(result.predicted_passengers) || 0,
      Number(result.historical_median) || 0,
      Number(result.historical_p80) || 0,
      Number(result.historical_p90_capacity_proxy) || 0,
    ];

    const maxValue = Math.max(...values);

    if (maxValue === 0) {
      return 0;
    }

    return Math.max(8, (Number(value) / maxValue) * 100);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <span
          style={{
            color: "#1976d2",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "1.5px",
          }}
        >
          AI & ML
        </span>

        <h1
          style={{
            margin: "5px 0 6px",
            color: "#102a56",
            fontSize: "32px",
          }}
        >
          Crowd Prediction
        </h1>

        <p
          style={{
            margin: 0,
            color: "#718096",
            fontSize: "13px",
          }}
        >
          Predict passenger demand and crowd level using the trained
          Random Forest model.
        </p>
      </div>

      {/* ======================================================
          PREDICTION FORM
      ====================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e6ebf2",
          borderRadius: "14px",
          padding: "25px",
          boxShadow: "0 5px 18px rgba(24,50,84,.045)",
          maxWidth: "800px",
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            color: "#24344e",
            fontSize: "20px",
          }}
        >
          Predict Station Crowd
        </h2>

        <p
          style={{
            margin: "0 0 25px",
            color: "#8994a7",
            fontSize: "12px",
          }}
        >
          Select a metro station and target date to generate the
          prediction.
        </p>

        <form onSubmit={handlePredict}>
          {/* ==================================================
              STATION
          ================================================== */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#35435a",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Metro Station
            </label>

            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              disabled={loadingStations || loadingPrediction}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #dce3ec",
                borderRadius: "8px",
                background: "#fff",
                color: "#35435a",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            >
              <option value="">
                {loadingStations
                  ? "Loading stations..."
                  : "Select Station"}
              </option>

              {stations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* ==================================================
              DATE
          ================================================== */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#35435a",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Target Date
            </label>

            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              disabled={loadingPrediction}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #dce3ec",
                borderRadius: "8px",
                background: "#fff",
                color: "#35435a",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 15px",
                background: "#fff0f0",
                border: "1px solid #ffcaca",
                borderRadius: "8px",
                color: "#d32f2f",
                fontSize: "12px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ==================================================
              BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loadingPrediction || loadingStations}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background:
                loadingPrediction || loadingStations
                  ? "#90a4c0"
                  : "#1565c0",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              cursor:
                loadingPrediction || loadingStations
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loadingPrediction
              ? "🤖 Predicting..."
              : "🔮 Predict Crowd"}
          </button>
        </form>
      </div>

      {/* ======================================================
          PREDICTION RESULT
      ====================================================== */}

      {result && (
        <div
          style={{
            marginTop: "25px",
            maxWidth: "800px",
          }}
        >
          {/* =================================================
              MAIN RESULT
          ================================================= */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e6ebf2",
              borderRadius: "14px",
              padding: "25px",
              boxShadow: "0 5px 18px rgba(24,50,84,.045)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#1976d2",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                  }}
                >
                  PREDICTION RESULT
                </span>

                <h2
                  style={{
                    margin: "5px 0 0",
                    color: "#24344e",
                    fontSize: "20px",
                  }}
                >
                  {result.station}
                </h2>
              </div>

              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  background: `${getCrowdColor(
                    result.crowd_level
                  )}15`,
                  color: getCrowdColor(
                    result.crowd_level
                  ),
                  fontWeight: "800",
                  fontSize: "12px",
                }}
              >
                {getCrowdIcon(result.crowd_level)}{" "}
                {result.crowd_level}
              </div>
            </div>

            {/* =================================================
                PREDICTED PASSENGERS
            ================================================= */}

            <div
              style={{
                background: "#f7f9fc",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 7px",
                  color: "#718096",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Predicted Passenger Demand
              </p>

              <div
                style={{
                  color: "#102a56",
                  fontSize: "38px",
                  fontWeight: "800",
                }}
              >
                {result.predicted_passengers}
              </div>

              <span
                style={{
                  color: "#8994a7",
                  fontSize: "11px",
                }}
              >
                passengers
              </span>
            </div>

            {/* =================================================
                HISTORICAL VALUES
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <div
                style={{
                  padding: "15px",
                  background: "#f7f9fc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#8994a7",
                    fontSize: "10px",
                    marginBottom: "5px",
                  }}
                >
                  Historical Median
                </span>

                <strong
                  style={{
                    color: "#24344e",
                    fontSize: "18px",
                  }}
                >
                  {result.historical_median}
                </strong>
              </div>

              <div
                style={{
                  padding: "15px",
                  background: "#f7f9fc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#8994a7",
                    fontSize: "10px",
                    marginBottom: "5px",
                  }}
                >
                  Historical P80
                </span>

                <strong
                  style={{
                    color: "#24344e",
                    fontSize: "18px",
                  }}
                >
                  {result.historical_p80}
                </strong>
              </div>

              <div
                style={{
                  padding: "15px",
                  background: "#f7f9fc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#8994a7",
                    fontSize: "10px",
                    marginBottom: "5px",
                  }}
                >
                  Historical P90
                </span>

                <strong
                  style={{
                    color: "#24344e",
                    fontSize: "18px",
                  }}
                >
                  {result.historical_p90_capacity_proxy}
                </strong>
              </div>
            </div>

            {/* =================================================
                DEMAND COMPARISON
            ================================================= */}

            <div
              style={{
                marginTop: "25px",
                paddingTop: "20px",
                borderTop: "1px solid #edf0f5",
              }}
            >
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 5px",
                    color: "#24344e",
                    fontSize: "17px",
                  }}
                >
                  Demand Comparison
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#8994a7",
                    fontSize: "11px",
                  }}
                >
                  Predicted demand compared with historical
                  demand thresholds.
                </p>
              </div>

              {/* PREDICTED DEMAND */}

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "#35435a",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    Predicted Demand
                  </span>

                  <strong
                    style={{
                      color: "#1565c0",
                      fontSize: "11px",
                    }}
                  >
                    {result.predicted_passengers}
                  </strong>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#edf1f6",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${getBarWidth(
                        result.predicted_passengers
                      )}%`,
                      height: "100%",
                      background: "#1565c0",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>

              {/* HISTORICAL MEDIAN */}

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "#35435a",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    Historical Median
                  </span>

                  <strong
                    style={{
                      color: "#607d8b",
                      fontSize: "11px",
                    }}
                  >
                    {result.historical_median}
                  </strong>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#edf1f6",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${getBarWidth(
                        result.historical_median
                      )}%`,
                      height: "100%",
                      background: "#607d8b",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>

              {/* P80 */}

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "#35435a",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    P80 Threshold
                  </span>

                  <strong
                    style={{
                      color: "#fb8c00",
                      fontSize: "11px",
                    }}
                  >
                    {result.historical_p80}
                  </strong>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#edf1f6",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${getBarWidth(
                        result.historical_p80
                      )}%`,
                      height: "100%",
                      background: "#fb8c00",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>

              {/* P90 */}

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "#35435a",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    P90 Threshold
                  </span>

                  <strong
                    style={{
                      color: "#e53935",
                      fontSize: "11px",
                    }}
                  >
                    {result.historical_p90_capacity_proxy}
                  </strong>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#edf1f6",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${getBarWidth(
                        result.historical_p90_capacity_proxy
                      )}%`,
                      height: "100%",
                      background: "#e53935",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                INTERPRETATION
            ================================================= */}

            <div
              style={{
                marginTop: "20px",
                padding: "14px",
                background: "#f7f9fc",
                borderRadius: "9px",
                borderLeft: `4px solid ${getCrowdColor(
                  result.crowd_level
                )}`,
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#24344e",
                  fontSize: "11px",
                  marginBottom: "5px",
                }}
              >
                Prediction Interpretation
              </strong>

              <span
                style={{
                  color: "#718096",
                  fontSize: "10px",
                  lineHeight: "1.6",
                }}
              >
                The predicted passenger demand is{" "}
                <strong>
                  {result.predicted_passengers}
                </strong>
                , which is classified as{" "}
                <strong>
                  {result.crowd_level}
                </strong>{" "}
                crowd based on the historical demand
                thresholds for this station.
              </span>
            </div>

            {/* =================================================
                DATE
            ================================================= */}

            <div
              style={{
                marginTop: "18px",
                paddingTop: "15px",
                borderTop: "1px solid #edf0f5",
                color: "#8994a7",
                fontSize: "11px",
              }}
            >
              Prediction Date:{" "}
              <strong
                style={{
                  color: "#35435a",
                }}
              >
                {result.target_date}
              </strong>
            </div>

            {/* =================================================
                NOTE
            ================================================= */}

            {result.note && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 12px",
                  background: "#f7f9fc",
                  borderRadius: "7px",
                  color: "#718096",
                  fontSize: "10px",
                  lineHeight: "1.5",
                }}
              >
                ℹ️ {result.note}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrowdPrediction;