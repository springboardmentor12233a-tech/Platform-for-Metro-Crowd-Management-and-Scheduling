import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ============================================================
  // FETCH HISTORY
  // ============================================================

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/history/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data || []);
    } catch (error) {
      console.error("History Error:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Failed to fetch prediction history.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD HISTORY
  // ============================================================

  useEffect(() => {
    fetchHistory();
  }, []);

  // ============================================================
  // DELETE HISTORY
  // ============================================================

  const deleteHistory = async (id) => {
    const confirmed = window.confirm(
      "Delete this prediction history?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Prediction history deleted successfully.");

      fetchHistory();
    } catch (error) {
      console.error("Delete History Error:", error);

      if (error.response?.status === 403) {
        alert("Only Admin can delete prediction history.");
      } else {
        alert("Unable to delete prediction history.");
      }
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredHistory = history.filter((item) => {
    const stationName = String(
      item.station_name || ""
    ).toLowerCase();

    const searchText = search.toLowerCase();

    return stationName.includes(searchText);
  });

  // ============================================================
  // CROWD COLOR
  // ============================================================

  const getCrowdColor = (crowd) => {
    if (crowd === "High") {
      return "#e53935";
    }

    if (crowd === "Medium") {
      return "#fb8c00";
    }

    return "#43a047";
  };

  // ============================================================
  // CROWD ICON
  // ============================================================

  const getCrowdIcon = (crowd) => {
    if (crowd === "High") {
      return "🔴";
    }

    if (crowd === "Medium") {
      return "🟠";
    }

    return "🟢";
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
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
            fontSize: "10px",
            fontWeight: "800",
            letterSpacing: "1.5px",
          }}
        >
          AI & ANALYTICS
        </span>

        <h1
          style={{
            margin: "5px 0 6px",
            color: "#102a56",
            fontSize: "32px",
          }}
        >
          Prediction History
        </h1>

        <p
          style={{
            margin: 0,
            color: "#718096",
            fontSize: "13px",
          }}
        >
          View and manage previous metro crowd predictions.
        </p>
      </div>

      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e6ebf2",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0 5px 18px rgba(24,50,84,.045)",
        }}
      >
        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#24344e",
                fontSize: "18px",
              }}
            >
              Previous Predictions
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#8994a7",
                fontSize: "11px",
              }}
            >
              Total records: {history.length}
            </p>
          </div>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search by station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "260px",
              maxWidth: "100%",
              padding: "11px 13px",
              border: "1px solid #dce3ec",
              borderRadius: "8px",
              outline: "none",
              color: "#35435a",
              fontSize: "12px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#718096",
              fontSize: "13px",
            }}
          >
            Loading prediction history...
          </div>
        ) : (
          <>
            {/* =================================================
                TABLE
            ================================================= */}

            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "750px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#1976d2",
                      color: "#ffffff",
                    }}
                  >
                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "11px",
                      }}
                    >
                      ID
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "11px",
                      }}
                    >
                      Station
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "11px",
                      }}
                    >
                      Crowd Level
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "11px",
                      }}
                    >
                      Type
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "11px",
                      }}
                    >
                      Predicted By
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "11px",
                      }}
                    >
                      Date & Time
                    </th>

                    {role === "Admin" && (
                      <th
                        style={{
                          padding: "13px",
                          textAlign: "center",
                          fontSize: "11px",
                        }}
                      >
                        Action
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={role === "Admin" ? 7 : 6}
                        style={{
                          padding: "45px",
                          textAlign: "center",
                          color: "#8994a7",
                          fontSize: "12px",
                        }}
                      >
                        {search
                          ? "No matching prediction history found."
                          : "No prediction history found."}
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom:
                            "1px solid #edf0f5",
                        }}
                      >
                        {/* ID */}

                        <td
                          style={{
                            padding: "13px",
                            color: "#718096",
                            fontSize: "12px",
                          }}
                        >
                          #{item.id}
                        </td>

                        {/* STATION */}

                        <td
                          style={{
                            padding: "13px",
                            color: "#24344e",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {item.station_name || "-"}
                        </td>

                        {/* CROWD */}

                        <td
                          style={{
                            padding: "13px",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "6px 10px",
                              borderRadius: "15px",
                              background: `${getCrowdColor(
                                item.predicted_crowd
                              )}15`,
                              color: getCrowdColor(
                                item.predicted_crowd
                              ),
                              fontSize: "10px",
                              fontWeight: "800",
                            }}
                          >
                            {getCrowdIcon(
                              item.predicted_crowd
                            )}

                            {item.predicted_crowd || "-"}
                          </span>
                        </td>

                        {/* TYPE */}

                        <td
                          style={{
                            padding: "13px",
                            color: "#718096",
                            fontSize: "11px",
                          }}
                        >
                          {item.prediction_type ||
                            "Crowd Prediction"}
                        </td>

                        {/* USER */}

                        <td
                          style={{
                            padding: "13px",
                            color: "#35435a",
                            fontSize: "11px",
                          }}
                        >
                          {item.predicted_by || "-"}
                        </td>

                        {/* DATE */}

                        <td
                          style={{
                            padding: "13px",
                            color: "#718096",
                            fontSize: "11px",
                          }}
                        >
                          {formatDate(item.created_at)}
                        </td>

                        {/* DELETE */}

                        {role === "Admin" && (
                          <td
                            style={{
                              padding: "13px",
                              textAlign: "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                deleteHistory(item.id)
                              }
                              style={{
                                background: "#fff0f0",
                                color: "#d32f2f",
                                border: "none",
                                padding: "7px 12px",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontSize: "10px",
                                fontWeight: "700",
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default History;