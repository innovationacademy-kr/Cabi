import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";

// ga 디버깅 필요 시 initialize 함수 두 번째 인자로 { debug: true } 사용
const gaTracker = (): void => {
  const [initialize, setInitialize] = useState<boolean>(false);
  useEffect(() => {
    // 배포 전용
    if (!window.location.href.includes("localhost")) {
      ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname); // 페이지 접근 시 pageview
      setInitialize(true);
    }
    if (initialize) {
      const history = createBrowserHistory();
      history.listen((res) => {
        ReactGA.set({ page: res.location.pathname });
        ReactGA.pageview(res.location.pathname); // 페이지 이동 시 pageview
      });
    }
    // 개발용
    // ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
    // ReactGA.set({ page: window.location.pathname });
    // ReactGA.pageview(window.location.pathname);
    // const history = createBrowserHistory();
    // history.listen((res) => {
    //   ReactGA.set({ page: res.location.pathname });
    //   ReactGA.pageview(res.location.pathname);
    // });
  }, []);
};
export default gaTracker;
