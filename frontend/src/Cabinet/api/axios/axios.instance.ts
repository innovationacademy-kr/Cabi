import axios, { HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import { ErrorType } from "@/Cabinet/types/enum/error.type.enum";
import { axiosReissueToken } from "@/Cabinet/api/axios/axios.custom";
import { logAxiosError } from "@/Cabinet/api/axios/axios.log";
import { getCookie, removeCookie } from "@/Cabinet/api/react_cookie/cookies";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token?: string
) => {
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
};

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

  return config;
});

const redirectToLoginWithAlert = (error: any) => {
  window.location.href = "/login";
  alert(error.response?.data?.message || "로그인이 필요합니다.");
};

const handleReissueToken = async (error: any) => {
  const token = getCookie("access_token");
  const domain =
    import.meta.env.VITE_IS_LOCAL === "true" ? "localhost" : "cabi.42seoul.io";

  if (!token) {
    const isAGUPage = window.location.pathname === "/agu";
    if (isAGUPage) {
      removeCookie("agu_token", {
        path: "/",
        domain,
      });
    }
    return Promise.reject(error);
  }

  try {
    const response = await axiosReissueToken(); // refresh token으로 access token 재발급

    if (response.status === HttpStatusCode.Ok) {
      const originalRequest = error.config;
      const newToken = getCookie("access_token");
      setAuthorizationHeader(originalRequest, newToken);

      return instance(originalRequest);
    }
  } catch (error) {
    console.error("Token reissue failed:", error);
  }

  removeCookie("access_token", {
    path: "/",
    domain,
  });

  redirectToLoginWithAlert(error);

  return Promise.reject(error);
};

const handleErrorResponse = async (error: any) => {
  if (error.response?.status === HttpStatusCode.Unauthorized) {
    return handleReissueToken(error);
  }

  if (error.response?.status === HttpStatusCode.InternalServerError) {
    logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, "서버 에러");
  } else if (error.response?.status === HttpStatusCode.Forbidden) {
    redirectToLoginWithAlert(error);
    logAxiosError(error, ErrorType.FORBIDDEN, "접근 권한 없음");
  }

  return Promise.reject(error);
};

instance.interceptors.response.use((response) => response, handleErrorResponse);

export default instance;
