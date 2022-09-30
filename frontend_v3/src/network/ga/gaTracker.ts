import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";

// ga 디버깅 필요 시 initialize 함수 두 번째 인자로 { debug: true } 사용
const gaTracker = (): void => {
  const [initialize, setInitialize] = useState<boolean>(false);
  useEffect(() => {
    // 배포 전용
    // if (!window.location.href.includes("localhost")) {
    //   ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
    //   setInitialize(true);
    // }
    // if (initialize) {
    //   const history = createBrowserHistory();
    //   history.listen((res) => {
    //     ReactGA.set({ page: res.location.pathname });
    //     ReactGA.pageview(res.location.pathname);
    //   });
    // }

    // 개발용
    ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
    console.log(import.meta.env.VITE_GA_TRACKING_ID); // 반드시 지워야함.
    const history = createBrowserHistory();
    history.listen((res) => {
      ReactGA.set({ page: res.location.pathname });
      ReactGA.pageview(res.location.pathname);
    });
  }, []);
};
export default gaTracker;
