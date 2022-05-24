import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./main.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  // There's currently a bug with react-sping in strict mode
  // see: https://github.com/pmndrs/react-spring/issues/1828
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
