import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function TicketBooking() {
  const [stations, setStations] = useState([]);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [passengers, setPassengers] = useState(1);
const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  // Load metro stations
  useEffect(() => {
    fetch("http://127.0.0.1:8000/metro-stations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load stations");
        }

        return response.json();
      })
      .then((data) => {
        setStations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load metro stations.");
        setLoading(false);
      });
  }, []);

  // Find selected station
  const getStation = (stationName) => {
    return stations.find(
      (station) => station.Station === stationName
    );
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;

    const deltaLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const deltaLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) ** 2;

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  };

  // Get selected stations
  const from = getStation(fromStation);
  const to = getStation(toStation);

  // Calculate journey distance
  let distance = 0;

  if (
    from &&
    to &&
    from.Latitude &&
    from.Longitude &&
    to.Latitude &&
    to.Longitude
  ) {
    distance = calculateDistance(
      Number(from.Latitude),
      Number(from.Longitude),
      Number(to.Latitude),
      Number(to.Longitude)
    );
  }

  // Calculate fare based on distance
  const calculateFarePerPassenger = (km) => {
    if (km <= 0) {
      return 0;
    }

    if (km <= 5) {
      return 20;
    }

    if (km <= 10) {
      return 30;
    }

    if (km <= 15) {
      return 40;
    }

    if (km <= 20) {
      return 50;
    }

    if (km <= 30) {
      return 60;
    }

    return 70;
  };

  const farePerPassenger =
    calculateFarePerPassenger(distance);

  const totalFare =
    farePerPassenger * passengers;

  // Book ticket
  const handleBooking = (e) => {
    e.preventDefault();

    setBookingMessage("");

    if (!fromStation || !toStation) {
      setBookingMessage(
        "Please select both source and destination stations."
      );
      return;
    }

    if (fromStation === toStation) {
      setBookingMessage(
        "Source and destination stations cannot be the same."
      );
      return;
    }

    if (!journeyDate) {
      setBookingMessage(
        "Please select your journey date."
      );
      return;
    }

    // Continue to payment only after all booking details are valid.
    setBookingMessage("");

    navigate("/payment", {
      state: {
        fromStation,
        toStation,
        journeyDate,
        passengers,
        distance,
        farePerPassenger,
        totalFare,
      },
    });
  };
return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}

      <h1
        style={{
          color: "#0f172a",
          textAlign: "center",
        }}
      >
        🎫 Ticket Booking
      </h1>

      <p
        style={{
          color: "#64748b",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Book your Delhi Metro journey quickly and easily.
      </p>

      {/* BOOKING CARD */}

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          marginTop: "30px",
        }}
      >
        <h2 style={{ color: "#2563eb" }}>
          🚇 Book Metro Ticket
        </h2>

        <p style={{ color: "#64748b" }}>
          Select your journey details to calculate the fare.
        </p>

        {/* LOADING */}

        {loading && (
          <p style={{ marginTop: "25px" }}>
            Loading metro stations...
          </p>
        )}

        {/* ERROR */}

        {error && (
          <p
            style={{
              marginTop: "25px",
              color: "#dc2626",
              fontWeight: "600",
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <form onSubmit={handleBooking}>
            {/* INPUTS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "25px",
              }}
            >
              {/* FROM */}

              <div>
                <label style={labelStyle}>
                  🚉 From Station
                </label>

                <select
                  value={fromStation}
                  onChange={(e) =>
                    setFromStation(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select source station
                  </option>

                  {stations.map((station, index) => (
                    <option
                      key={`${station.Station}-${index}`}
                      value={station.Station}
                    >
                      {station.Station}
                    </option>
                  ))}
                </select>
              </div>

              {/* TO */}

              <div>
                <label style={labelStyle}>
                  🚉 To Station
                </label>

                <select
                  value={toStation}
                  onChange={(e) =>
                    setToStation(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select destination station
                  </option>

                  {stations.map((station, index) => (
                    <option
                      key={`${station.Station}-${index}`}
                      value={station.Station}
                    >
                      {station.Station}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}

              <div>
                <label style={labelStyle}>
                  📅 Journey Date
                </label>

                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) =>
                    setJourneyDate(e.target.value)
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  style={inputStyle}
                />
              </div>

              {/* PASSENGERS */}

              <div>
                <label style={labelStyle}>
                  👥 Number of Passengers
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={passengers}
                  onChange={(e) =>
                    setPassengers(
                      Number(e.target.value)
                    )
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* JOURNEY DETAILS */}

            {from && to && fromStation !== toStation && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "12px",
                  marginTop: "25px",
                }}
              >
                <h3 style={{ color: "#0f172a" }}>
                  🧭 Journey Details
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: "15px",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <p style={smallLabelStyle}>
                      From
                    </p>

                    <strong>
                      {fromStation}
                    </strong>
                  </div>

                  <div>
                    <p style={smallLabelStyle}>
                      Distance
                    </p>

                    <strong
                      style={{
                        color: "#2563eb",
                      }}
                    >
                      {distance.toFixed(2)} km
                    </strong>
                  </div>

                  <div>
                    <p style={smallLabelStyle}>
                      To
                    </p>

                    <strong>
                      {toStation}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* FARE */}

            <div
              style={{
                background: "#eff6ff",
                padding: "20px",
                borderRadius: "12px",
                marginTop: "25px",
                textAlign: "center",
              }}
            >
              <p style={smallLabelStyle}>
                Fare per Passenger
              </p>

              <h2
                style={{
                  color: "#2563eb",
                  fontSize: "30px",
                  margin: "8px 0",
                }}
              >
                ₹{farePerPassenger}
              </h2>

              <p
                style={{
                  color: "#64748b",
                  margin: "5px",
                }}
              >
                {passengers} passenger
                {passengers > 1 ? "s" : ""}
              </p>

              <hr
                style={{
                  border: "none",
                  borderTop:
                    "1px solid #bfdbfe",
                  margin: "15px 0",
                }}
              />

              <p style={smallLabelStyle}>
                Total Fare
              </p>

              <h2
                style={{
                  color: "#16a34a",
                  fontSize: "34px",
                  margin: "5px 0",
                }}
              >
                ₹{totalFare}
              </h2>
            </div>

            {/* BOOK BUTTON */}

            <button
              type="submit"
              style={buttonStyle}
            >
              💳 Proceed to Payment
            </button>

            {/* MESSAGE */}

            {bookingMessage && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "10px",
                  background:
                    bookingMessage.startsWith("✅")
                      ? "#dcfce7"
                      : "#fee2e2",
                  color:
                    bookingMessage.startsWith("✅")
                      ? "#166534"
                      : "#991b1b",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {bookingMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  boxSizing: "border-box",
  background: "white",
};

const smallLabelStyle = {
  color: "#64748b",
  margin: "5px 0",
};

const buttonStyle = {
  width: "100%",
  marginTop: "25px",
  padding: "15px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  fontSize: "17px",
  fontWeight: "600",
  cursor: "pointer",
};

export default TicketBooking;