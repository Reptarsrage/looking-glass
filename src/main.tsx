import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./main.css";
import { SettingsProvider } from "./store/settings";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);
