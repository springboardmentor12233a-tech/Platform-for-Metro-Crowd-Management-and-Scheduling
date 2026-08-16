import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";

import "./styles/index.css";


// ============================================================
// GOOGLE CLIENT ID
// ============================================================

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;


// ============================================================
// APPLICATION ENTRY POINT
// ============================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <GoogleOAuthProvider
      clientId={googleClientId}
    >

      <App />

    </GoogleOAuthProvider>

  </React.StrictMode>
);