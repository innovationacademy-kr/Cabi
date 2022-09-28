import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/store";
import muiCustomPaletteTheme from "./themes/muiCustomPaletteTheme.tsx";
import App from "./App";
import "./index.css";
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { useEffect } from "react";

const config = process.env.GOOGLE_ANALYTICS_TRACKING_ID;
useEffect(() => {
  if (config)
  {
    const history = createBrowserHistory();
    history.listen((location: any) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
      console.log("history called");
    });
    ReactGA.initialize(config);
  }
}, []);
const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={muiCustomPaletteTheme}>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
