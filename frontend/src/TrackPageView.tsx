import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

const TrackPageView = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (
      !initialized &&
      import.meta.env.VITE_GA_TRACKING_ID &&
      !window.location.hostname.includes("localhost")
    ) {
      ReactGA.initialize(`${import.meta.env.VITE_GA_TRACKING_ID}`);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!initialized) return;
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      title: location.pathname,
    });
  }, [initialized, location]);

  return null;
};

export default TrackPageView;
