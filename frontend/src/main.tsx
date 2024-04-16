import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { GlobalStyle } from "@/assets/data/ColorTheme";
import App from "./App";
import "./assets/css/media.css";
import "./assets/css/reset.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <GlobalStyle />
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
