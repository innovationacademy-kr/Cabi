import axios, { HttpStatusCode } from "axios";
import ErrorType from "@/Cabinet/types/enum/error.type.enum";
import { logAxiosError } from "@/Cabinet/api/axios/axios.log";
import { getCookie, removeCookie } from "@/Cabinet/api/react_cookie/cookies";

axios.defaults.withCredentials = true; // CSRF 토큰 자동 포함

axios.defaults.xsrfCookieName = "XSRF-TOKEN"; // 쿠키 이름
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN"; // 요청 헤더에 포함될 이름

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
});

const reissueInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
});

const reissueToken = async () => {
  try {
    // TODO : 경로에 따라 헤더 다르게 세팅
    const token = getCookie("access_token");
    const xsrfToken = getCookie("XSRF-TOKEN");
    const headers: { [key: string]: string } = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (xsrfToken) headers["X-XSRF-TOKEN"] = xsrfToken;

    const response = await reissueInstance.post("/v5/jwt/reissue", { headers });

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token reissue failed:", error);
    return false;
  }
};

instance.interceptors.request.use(async (config) => {
  const accessToken = getCookie("access_token");
  const aguToken = getCookie("agu_token");
  const xsrfToken = getCookie("XSRF-TOKEN");
  const isAGUPage = window.location.pathname === "/agu";

  if (xsrfToken) config.headers["X-XSRF-TOKEN"] = xsrfToken;
  if (isAGUPage) config.headers["X-Client-Path"] = "/agu";

  // TODO : 조건문 수정
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  if (accessToken && !isAGUPage)
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  if (aguToken && isAGUPage)
    config.headers["Authorization"] = `Bearer ${aguToken}`;
  // TODO : 정리 - 반납하시겠습니까 에서 lent/me 요청 보낼때
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const token = getCookie("access_token");

      if (token) {
        const isReissued = await reissueToken();

        if (isReissued) {
          const originalRequest = error.config;
          const newToken = getCookie("access_token");
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        }
      }

      const domain =
        import.meta.env.VITE_IS_LOCAL === "true"
          ? "localhost"
          : "cabi.42seoul.io";

      removeCookie("access_token", {
        path: "/",
        domain,
      });

      window.location.href = "login";
      alert(error.response.data.message);
    } else if (error.response?.status === HttpStatusCode.InternalServerError) {
      logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, "서버 에러");
    } else if (error.response?.status === HttpStatusCode.Forbidden) {
      window.location.href = "login";
      alert(error.response.data.message);
      logAxiosError(error, ErrorType.FORBIDDEN, "접근 권한 없음");
    }
    return Promise.reject(error);
  }
);

export default instance;
