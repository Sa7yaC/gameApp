import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App";
import "./styles/GameRoom.css";
import "./styles/LandingPage.css";
import "./styles/GameScreen.css";

inject();

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch((error) => {
    console.error("Failed to register static asset cache:", error);
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);