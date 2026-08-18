import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  // If payment page is opened directly
  if (!booking) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>⚠️ No Booking Details</h2>

          <p>
            Please select your journey and proceed to payment
            from the Ticket Booking page.
          </p>

          <button
            onClick={() => navigate("/ticket-booking")}
            style={buttonStyle}
          >
            🎫 Go to Ticket Booking
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();

    setPaymentStatus("");

    // Basic validation
    if (paymentMethod === "UPI" && !upiId.trim()) {
      setPaymentStatus("❌ Please enter your UPI ID.");
      return;
    }

    if (paymentMethod === "Card") {
      if (!cardNumber || !expiry || !cvv) {
        setPaymentStatus(
          "❌ Please enter all card details."
        );
        return;
      }
    }

    setProcessing(true);

    // Payment simulation
    setTimeout(() => {
      setProcessing(false);

      const transactionId =
        "TXN" +
        Date.now().toString().slice(-8);

      const bookingId =
        "MT" +
        Date.now().toString().slice(-8);

      navigate("/ticket-confirmation", {
        state: {
          ...booking,
          paymentMethod,
          transactionId,
          bookingId,
          paymentStatus: "SUCCESS",
        },
      });
    }, 2000);
  };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>
        💳 Metro Payment
      </h1>

      <p style={subtitleStyle}>
        Complete your payment to confirm your metro ticket.
      </p>

      <div style={mainGrid}>
        {/* PAYMENT METHODS */}

        <div style={cardStyle}>
          <h2 style={sectionTitle}>
            💳 Payment Method
          </h2>

          <div style={methodContainer}>
            <PaymentMethod
              value="UPI"
              label="📱 UPI"
              selected={paymentMethod}
              onClick={() => setPaymentMethod("UPI")}
            />

            <PaymentMethod
              value="Card"
              label="💳 Credit / Debit Card"
              selected={paymentMethod}
              onClick={() => setPaymentMethod("Card")}
            />

            <PaymentMethod
              value="Net Banking"
              label="🏦 Net Banking"
              selected={paymentMethod}
              onClick={() =>
                setPaymentMethod("Net Banking")
              }
            />

            <PaymentMethod
              value="Wallet"
              label="👛 Wallet"
              selected={paymentMethod}
              onClick={() =>
                setPaymentMethod("Wallet")
              }
            />
          </div>

          {/* UPI */}

          {paymentMethod === "UPI" && (
            <div style={formSection}>
              <label style={labelStyle}>
                UPI ID
              </label>

              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) =>
                  setUpiId(e.target.value)
                }
                style={inputStyle}
              />

              <p style={hintStyle}>
                Example: varsha@upi
              </p>
            </div>
          )}

          {/* CARD */}

          {paymentMethod === "Card" && (
            <div style={formSection}>
              <label style={labelStyle}>
                Card Number
              </label>

              <input
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value)
                }
                style={inputStyle}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Expiry
                  </label>

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    CVV
                  </label>

                  <input
                    type="password"
                    maxLength="3"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* NET BANKING */}

          {paymentMethod === "Net Banking" && (
            <div style={formSection}>
              <label style={labelStyle}>
                Select Bank
              </label>

              <select style={inputStyle}>
                <option>
                  Select your bank
                </option>
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Canara Bank</option>
              </select>
            </div>
          )}

          {/* WALLET */}

          {paymentMethod === "Wallet" && (
            <div style={formSection}>
              <label style={labelStyle}>
                Select Wallet
              </label>

              <select style={inputStyle}>
                <option>
                  Select wallet
                </option>
                <option>Paytm</option>
                <option>PhonePe</option>
                <option>Amazon Pay</option>
              </select>
            </div>
          )}

          {/* ERROR */}

          {paymentStatus && (
            <div style={errorStyle}>
              {paymentStatus}
            </div>
          )}

          {/* PAY BUTTON */}

          <button
            onClick={handlePayment}
            disabled={processing}
            style={{
              ...buttonStyle,
              opacity: processing ? 0.7 : 1,
            }}
          >
            {processing
              ? "⏳ Processing Payment..."
              : `💳 Pay ₹${booking.totalFare}`}
          </button>
        </div>

        {/* JOURNEY SUMMARY */}

        <div style={summaryCardStyle}>
          <h2 style={sectionTitle}>
            🎫 Journey Summary
          </h2>

          <div style={summaryRow}>
            <span>From</span>
            <strong>{booking.fromStation}</strong>
          </div>

          <div style={summaryRow}>
            <span>To</span>
            <strong>{booking.toStation}</strong>
          </div>

          <div style={summaryRow}>
            <span>Journey Date</span>
            <strong>{booking.journeyDate}</strong>
          </div>

          <div style={summaryRow}>
            <span>Passengers</span>
            <strong>{booking.passengers}</strong>
          </div>

          <div style={summaryRow}>
            <span>Distance</span>
            <strong>
              {Number(booking.distance).toFixed(2)} km
            </strong>
          </div>

          <hr />

          <div style={summaryRow}>
            <span>Fare / Passenger</span>
            <strong>
              ₹{booking.farePerPassenger}
            </strong>
          </div>

          <div
            style={{
              ...summaryRow,
              fontSize: "20px",
              color: "#16a34a",
            }}
          >
            <strong>Total Fare</strong>
            <strong>
              ₹{booking.totalFare}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethod({
  value,
  label,
  selected,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "15px",
        borderRadius: "10px",
        border:
          selected === value
            ? "2px solid #2563eb"
            : "1px solid #cbd5e1",
        background:
          selected === value
            ? "#eff6ff"
            : "white",
        cursor: "pointer",
        marginBottom: "10px",
        fontWeight: "600",
      }}
    >
      {label}
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const headingStyle = {
  color: "#0f172a",
  textAlign: "center",
};

const subtitleStyle = {
  color: "#64748b",
  textAlign: "center",
  fontSize: "18px",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "25px",
  marginTop: "30px",
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,.08)",
};

const summaryCardStyle = {
  ...cardStyle,
  height: "fit-content",
};

const sectionTitle = {
  color: "#2563eb",
};

const methodContainer = {
  marginTop: "20px",
};

const formSection = {
  marginTop: "25px",
};

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
};

const hintStyle = {
  color: "#64748b",
  fontSize: "13px",
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

const errorStyle = {
  marginTop: "20px",
  padding: "12px",
  borderRadius: "8px",
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: "600",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  marginBottom: "18px",
  color: "#475569",
};

export default Payment;