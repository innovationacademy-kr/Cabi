import axios, { HttpStatusCode } from "axios";
import ErrorType from "@/Cabinet/types/enum/error.type.enum";
import { logAxiosError } from "@/Cabinet/api/axios/axios.log";
import { getCookie, removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import { axiosReissueToken } from "./axios.custom";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

instance.interceptors.request.use(async (config) => {
  const accessToken = getCookie("access_token");
  const aguToken = getCookie("agu_token");
  const isAGUPage = window.location.pathname === "/agu";

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
        try {
          const response = await axiosReissueToken();

          if (response.status === HttpStatusCode.Ok) {
            const originalRequest = error.config;
            const newToken = getCookie("access_token");
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return instance(originalRequest);
          }
        } catch (error) {
          console.error("Token reissue failed:", error);
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
