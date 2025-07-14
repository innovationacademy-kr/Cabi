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
const handlePresentationsUnauthorized = (error: any) => {
  const message =
    "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?";
  const shouldRedirect = window.confirm(message);

  if (shouldRedirect) {
    const isAdmin = window.location.pathname.includes("/admin");
    const redirectUrl = `${isAdmin ? "/admin" : ""}/login`;
    window.location.replace(redirectUrl);
  }
  return Promise.reject(error);
};

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
  const requestUrl = error.config?.url || "";
  const token = getCookie("access_token");
  if (token) return handleReissueToken(error);

  const isAGUPage = window.location.pathname === "/agu";
  if (isAGUPage) {
    removeCookie("agu_token", {
      path: "/",
      domain: getDomain(),
    });
  } else if (requestUrl.includes("v6/presentations/")) {
    return handlePresentationsUnauthorized(error);
  }

  return Promise.reject(error);
};

const handleForbiddenError = (error: any) => {
  logAxiosError(error, ErrorType.FORBIDDEN, "접근 권한 없음");
  removeAllCookies({ path: "/", domain: getDomain() });
  redirectToLoginWithAlert(error);
};

const handleErrorResponse = (error: any) => {
  const status = error.response?.status;
  const requestUrl = error.config?.url || "";

  if (status === HttpStatusCode.Unauthorized) {
    return handleUnauthorizedError(error);
  } else if (status === HttpStatusCode.InternalServerError) {
    logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, "서버 에러");
  } else if (status === HttpStatusCode.Forbidden) {
    handleForbiddenError(error);
  }

  return Promise.reject(error);
};

instance.interceptors.response.use((response) => response, handleErrorResponse);
