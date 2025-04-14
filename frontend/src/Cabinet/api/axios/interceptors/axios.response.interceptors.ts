import { HttpStatusCode } from "axios";
import { ErrorType } from "@/Cabinet/types/enum/error.type.enum";
import { axiosReissueToken } from "@/Cabinet/api/axios/axios.custom";
import instance from "@/Cabinet/api/axios/axios.instance";
import { logAxiosError } from "@/Cabinet/api/axios/axios.log";
import {
  getCookie,
  removeAllCookies,
  removeCookie,
} from "@/Cabinet/api/react_cookie/cookies";
import { setAuthorizationHeader } from "@/Cabinet/utils/axiosUtils";
import { getDomain } from "@/Cabinet/utils/domainUtils";

let isRefreshing = false;
// NOTE : 토큰 재발급 시도 중인지 확인하는 플래그

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

  try {
    isRefreshing = true;
    const response = await axiosReissueToken(); // refresh token으로 access token 재발급

    if (response.status === HttpStatusCode.Ok) {
      const requestConfig = error.config;
      const newToken = getCookie("access_token");
      setAuthorizationHeader(requestConfig, newToken);
      return instance(requestConfig);
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

const handleUnauthorizedError = (error: any) => {
  const token = getCookie("access_token");
  if (token) return handleReissueToken(error);

  const isAGUPage = window.location.pathname === "/agu";
  if (isAGUPage) {
    removeCookie("agu_token", {
      path: "/",
      domain: getDomain(),
    });
  }

  return Promise.reject(error);
};

const handleForbiddenError = (error: any) => {
  logAxiosError(error, ErrorType.FORBIDDEN, "접근 권한 없음");
  removeAllCookies({ path: "/", domain: getDomain() });
  redirectToLoginWithAlert(error);
};

const handleErrorResponse = async (error: any) => {
  if (error.response?.status === HttpStatusCode.Unauthorized) {
    return handleUnauthorizedError(error);
  } else if (error.response?.status === HttpStatusCode.InternalServerError) {
    logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, "서버 에러");
  } else if (error.response?.status === HttpStatusCode.Forbidden) {
    handleForbiddenError(error);
  }

  return Promise.reject(error);
};

instance.interceptors.response.use((response) => response, handleErrorResponse);
