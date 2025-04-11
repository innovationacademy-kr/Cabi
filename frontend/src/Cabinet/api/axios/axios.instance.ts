import axios, { HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import { ErrorType } from "@/Cabinet/types/enum/error.type.enum";
import { axiosReissueToken } from "@/Cabinet/api/axios/axios.custom";
import { logAxiosError } from "@/Cabinet/api/axios/axios.log";
import { getCookie, removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import { getDomain } from "@/Cabinet/utils/domainUtils";

// NOTE : 토큰 재발급 시도 중인지 확인하는 플래그
let isRefreshing = false;

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
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

const redirectToLoginWithAlert = (error: any) => {
  const loginUrl = "/login";
  const isAdmin = window.location.pathname.includes("/admin");
  const redirectUrl = `${isAdmin ? "/admin" : ""}${loginUrl}`;

  window.location.replace(redirectUrl);
  alert(error.response?.data?.message || "로그인이 필요합니다.");
};

const handleReissueToken = async (error: any) => {
  if (isRefreshing) {
    return Promise.reject(error);
  }

  const token = getCookie("access_token");
  if (!token) {
    const isAGUPage = window.location.pathname === "/agu";
    if (isAGUPage) {
      removeCookie("agu_token", {
        path: "/",
        domain: getDomain(),
      });
    }

    return Promise.reject(error);
  }

  try {
    isRefreshing = true;
    const response = await axiosReissueToken(); // refresh token으로 access token 재발급

    if (response.status === HttpStatusCode.Ok) {
      const originalRequest = error.config;
      const newToken = getCookie("access_token");
      setAuthorizationHeader(originalRequest, newToken);
      return instance(originalRequest);
    }
  } catch (error) {
    console.error("Token reissue failed:", error);

    removeCookie("access_token", {
      path: "/",
      domain: getDomain(),
    });

    redirectToLoginWithAlert(error);

    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};

const handleForbiddenError = (error: any) => {
  logAxiosError(error, ErrorType.FORBIDDEN, "접근 권한 없음");
  removeCookie("access_token", {
    path: "/",
    domain: getDomain(),
  });
  // TODO : 쿠키 지우는 방법 따로 빼기?
  redirectToLoginWithAlert(error);
};

const handleErrorResponse = async (error: any) => {
  if (error.response?.status === HttpStatusCode.Unauthorized) {
    return handleReissueToken(error);
  } else if (error.response?.status === HttpStatusCode.InternalServerError) {
    logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, "서버 에러");
  } else if (error.response?.status === HttpStatusCode.Forbidden) {
    handleForbiddenError(error);
  }

  return Promise.reject(error);
};

instance.interceptors.response.use((response) => response, handleErrorResponse);

export default instance;
