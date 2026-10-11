import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App";
import "./styles/GameRoom.css";
import "./styles/LandingPage.css";
import "./styles/GameScreen.css";

inject();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);