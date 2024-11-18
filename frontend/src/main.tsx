import * as Sentry from "@sentry/react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import "@/Cabinet/assets/css/media.css";
import "@/Cabinet/assets/css/reset.css";
import "@/index.css";
import App from "@/App";
import { GlobalStyle } from "@/Cabinet/assets/data/ColorTheme";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment:
    import.meta.env.VITE_IS_LOCAL === "true"
      ? "local"
      : import.meta.env.VITE_BE_HOST.includes("dev")
      ? "development"
      : "production",
  release: "^8.18.0",
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  tracesSampleRate: 0.05,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  // tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/cabi\.42seoul\.io/,
    /^https:\/\/dev\.cabi\.42seoul\.io/,
    /^https:\/\/api\.cabi\.42seoul\.io/,
    /^https:\/\/api-dev\.cabi\.42seoul\.io/,
  ],

  // Capture Replay for 100% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.2,
  replaysOnErrorSampleRate: 0.2,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <GlobalStyle />
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
