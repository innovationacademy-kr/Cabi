import { axiosGetCSRFToken } from "@/Cabinet/api/axios/axios.custom";
import instance from "@/Cabinet/api/axios/axios.instance";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { setAuthorizationHeader, setHeader } from "@/Cabinet/utils/axiosUtils";

instance.interceptors.request.use(async (config) => {
  const accessToken = getCookie("access_token");
  const aguToken = getCookie("agu_token");
  const isAGUPage = window.location.pathname === "/agu";

  if (isAGUPage) {
    setHeader(config, "X-Client-Path", "/agu");
    setAuthorizationHeader(config, aguToken);
  } else {
    setAuthorizationHeader(config, accessToken);
  }

  if (config.csrfRequired) {
    try {
      await axiosGetCSRFToken();
      const csrfToken = getCookie("XSRF-TOKEN");
      setHeader(config, "X-XSRF-TOKEN", csrfToken);
      config.withCredentials = true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /*
	  config.xsrfCookieName = "XSRF-TOKEN";
	  config.xsrfHeaderName = "X-XSRF-TOKEN";
	  TODO : 테스트
	*/

  return config;
});
