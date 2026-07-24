import React, { useState } from "react";
import axios from "axios";

function ChatBot() {

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {

    if (question.trim() === "") return;

    const userMessage = {
      sender: "You",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/chat",
        {
          question: question
        }
      );

      const botMessage = {
        sender: "Metro AI",
        text: res.data.reply
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {

      const botMessage = {
        sender: "Metro AI",
        text: "Unable to connect to AI."
      };

      setMessages(prev => [...prev, botMessage]);

    }

    setQuestion("");

  };

  return (

    <>

      {/* Floating Button */}

      <button

        onClick={() => setOpen(!open)}

        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          background: "#0d6efd",
          color: "white",
          fontSize: "28px",
          cursor: "pointer",
          zIndex: 9999
        }}

      >

        💬

      </button>

      {open && (

        <div

          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "350px",
            height: "500px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 0 15px gray",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999
          }}

        >

          {/* Header */}

          <div

            style={{
              background: "#0d6efd",
              color: "white",
              padding: "15px",
              fontWeight: "bold",
              textAlign: "center"
            }}

          >

            🤖 Metro AI Assistant

          </div>

          {/* Messages */}

          <div

            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px"
            }}

          >

            {messages.map((msg, index) => (

              <div key={index} style={{ marginBottom: "15px" }}>

                <b>{msg.sender}</b>

                <br />

                {msg.text}

              </div>

            ))}

          </div>

          {/* Input */}

          <div

            style={{
              display: "flex",
              padding: "10px"
            }}

          >

            <input

              type="text"

              value={question}

              placeholder="Ask about Metro..."

              onChange={(e) => setQuestion(e.target.value)}

              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  sendMessage();

                }

              }}

              style={{
                flex: 1,
                padding: "10px"
              }}

            />

            <button

              onClick={sendMessage}

              className="btn btn-primary ms-2"

            >

              Send

            </button>

          </div>

        </div>

      )}

    </>

  );

}

export default ChatBot;