import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "./redux/store";
import muiCustomPaletteTheme from "./themes/muiCustomPaletteTheme.tsx";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={muiCustomPaletteTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
