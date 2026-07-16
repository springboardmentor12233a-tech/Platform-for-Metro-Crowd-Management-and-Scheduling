import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Prediction() {
  const [formData, setFormData] = useState({
    Date: "",
    Time: "",
    Day: "",
    Weather: "",
    Station: "",
    Passenger_Count: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async () => {
    try {
      const response = await API.post("/predict", formData);
      setResult(response.data);
    } catch (error) {
      console.log(error);
      alert("Prediction Failed");
    }
  };

  const badgeColor = () => {
    if (!result) return "#1565C0";

    if (result.Crowd_Level === "High") return "#E53935";

    if (result.Crowd_Level === "Medium") return "#FB8C00";

    return "#43A047";
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #D0D7DE",
    fontSize: "16px",
    background: "#FAFAFA",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#E3F2FD,#F5F9FF,#FFFFFF)",
          padding: "50px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#0D47A1",
              fontSize: "42px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            🚇 Metro Crowd Prediction
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#555",
              fontSize: "18px",
              marginBottom: "40px",
            }}
          >
            AI Powered Metro Crowd Management & Scheduling Platform
          </p>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 15px 35px rgba(0,0,0,.15)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#1565C0",
                marginBottom: "30px",
              }}
            >
              🤖 Prediction Form
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                gap: "20px",
              }}
            >
              <input
                style={inputStyle}
                type="date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
              />

              <input
                style={inputStyle}
                type="time"
                name="Time"
                value={formData.Time}
                onChange={handleChange}
              />

              <select
                style={inputStyle}
                name="Day"
                value={formData.Day}
                onChange={handleChange}
              >
                <option value="">Select Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>

              <select
                style={inputStyle}
                name="Weather"
                value={formData.Weather}
                onChange={handleChange}
              >
                <option value="">Select Weather</option>
                <option>Sunny</option>
                <option>Cloudy</option>
                <option>Rainy</option>
              </select>

              <select
                style={inputStyle}
                name="Station"
                value={formData.Station}
                onChange={handleChange}
              >
                <option value="">Select Station</option>
                <option>Airport</option>
                <option>Central</option>
                <option>University</option>
                <option>Tech Park</option>
                <option>City Center</option>
              </select>

              <input
                style={inputStyle}
                type="number"
                name="Passenger_Count"
                placeholder="Passenger Count"
                value={formData.Passenger_Count}
                onChange={handleChange}
              />

            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "35px",
              }}
            >
              <button
                onClick={handlePredict}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#1565C0",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                🚇 Predict Crowd Level
              </button>
            </div>
          </div>
                    {/* Prediction Result */}

          {result && (
            <>
              {/* Result Card */}

              <div
                style={{
                  background: "white",
                  marginTop: "35px",
                  borderRadius: "20px",
                  padding: "35px",
                  boxShadow: "0 15px 35px rgba(0,0,0,.15)",
                }}
              >
                <h2
                  style={{
                    textAlign: "center",
                    color: "#1565C0",
                  }}
                >
                  🎯 Prediction Result
                </h2>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "25px",
                  }}
                >
                  <span
                    style={{
                      background: badgeColor(),
                      color: "white",
                      padding: "15px 40px",
                      borderRadius: "40px",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {result.Crowd_Level.toUpperCase()}
                  </span>
                </div>

                {/* Progress Bar */}

                <div
                  style={{
                    marginTop: "35px",
                  }}
                >
                  <h3>Crowd Occupancy</h3>

                  <div
                    style={{
                      width: "100%",
                      height: "18px",
                      background: "#E0E0E0",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          result.Crowd_Level === "High"
                            ? "90%"
                            : result.Crowd_Level === "Medium"
                            ? "60%"
                            : "30%",
                        height: "18px",
                        borderRadius: "10px",
                        background: badgeColor(),
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}

              <div
                style={{
                  background: "white",
                  marginTop: "25px",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 15px 35px rgba(0,0,0,.15)",
                }}
              >
                <h2
                  style={{
                    color: "#1565C0",
                  }}
                >
                  🤖 AI Recommendation
                </h2>

                <div
                  style={{
                    background: "#E3F2FD",
                    padding: "18px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    color: "#0D47A1",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {result.Recommendation}
                </div>

                <h3 style={{ marginTop: "25px" }}>
                  Suggested Actions
                </h3>

                <ul
                  style={{
                    lineHeight: "2.2",
                    fontSize: "17px",
                  }}
                >
                  {result.Crowd_Level === "High" && (
                    <>
                      <li>🚆 Increase Train Frequency</li>
                      <li>👮 Deploy Additional Staff</li>
                      <li>🎫 Open Extra Ticket Counters</li>
                      <li>📢 Broadcast Passenger Announcements</li>
                    </>
                  )}

                  {result.Crowd_Level === "Medium" && (
                    <>
                      <li>🚉 Monitor Passenger Flow</li>
                      <li>👮 Keep Additional Staff Ready</li>
                      <li>📢 Passenger Information Updates</li>
                    </>
                  )}

                  {result.Crowd_Level === "Low" && (
                    <>
                      <li>✅ Normal Metro Operations</li>
                      <li>🚆 Standard Train Schedule</li>
                      <li>😊 Passenger Flow is Stable</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Prediction Summary */}

              <div
                style={{
                  background: "white",
                  marginTop: "25px",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 15px 35px rgba(0,0,0,.15)",
                }}
              >
                <h2
                  style={{
                    color: "#1565C0",
                    marginBottom: "25px",
                  }}
                >
                  📊 Prediction Summary
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                  }}
                >
                  <InfoCard
                    title="🚉 Station"
                    value={formData.Station}
                  />

                  <InfoCard
                    title="👥 Passenger Count"
                    value={formData.Passenger_Count}
                  />

                  <InfoCard
                    title="📅 Day"
                    value={formData.Day}
                  />

                  <InfoCard
                    title="☀ Weather"
                    value={formData.Weather}
                  />

                  <InfoCard
                    title="🚦 Crowd Level"
                    value={result.Crowd_Level}
                  />

                  <InfoCard
                    title="🕒 Time"
                    value={formData.Time}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "#F8FBFF",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid #D6EAF8",
        textAlign: "center",
      }}
    >
      <h4
        style={{
          color: "#1565C0",
          marginBottom: "12px",
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {value || "-"}
      </p>
    </div>
  );
}

export default Prediction;