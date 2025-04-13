import instance from "@/Cabinet/api/axios/axios.instance";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { setAuthorizationHeader } from "@/Cabinet/utils/axiosUtils";

instance.interceptors.request.use(async (config) => {
  const accessToken = getCookie("access_token");
  const aguToken = getCookie("agu_token");
  const isAGUPage = window.location.pathname === "/agu";

  if (isAGUPage) {
    config.headers.set("X-Client-Path", "/agu");
    setAuthorizationHeader(config, aguToken);
  } else {
    setAuthorizationHeader(config, accessToken);
  }

  /* 
	  if (로그인, 리이슈, 로그아웃)
	  헤더에 설정
	  config.withCredentials = true;
	  config.xsrfCookieName = "XSRF-TOKEN";
	  config.xsrfHeaderName = "X-XSRF-TOKEN";
	  TODO : interceptor에서?
	*/

  return config;
});
