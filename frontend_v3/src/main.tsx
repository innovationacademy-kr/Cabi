import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import muiCustomPaletteTheme from "./themes/muiCustomPaletteTheme.tsx";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={muiCustomPaletteTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
