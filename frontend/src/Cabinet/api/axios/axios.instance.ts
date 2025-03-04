import axios, { HttpStatusCode } from "axios";
import ErrorType from "@/Cabinet/types/enum/error.type.enum";
import { logAxiosError } from "@/Cabinet/api/axios/axios.log";
import { getCookie, removeCookie } from "@/Cabinet/api/react_cookie/cookies";

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
});

const reissueInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
});

const reissueToken = async () => {
  try {
    const token = (() => {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin")) {
        return getCookie("admin_access_token");
      }
      return getCookie("access_token");
    })();

    const response = await reissueInstance.post(
      "/v5/jwt/reissue",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
  const token = (() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/admin")) {
      return getCookie("admin_access_token");
    }
    return getCookie("access_token");
  })();
  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const isReissued = await reissueToken();

      if (isReissued) {
        const originalRequest = error.config;

        const newToken = window.location.pathname.startsWith("/admin")
          ? getCookie("admin_access_token")
          : getCookie("access_token");

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } else {
        const domain =
          import.meta.env.VITE_IS_LOCAL === "true"
            ? "localhost"
            : "cabi.42seoul.io";

        if (window.location.pathname.startsWith("/admin")) {
          removeCookie("admin_access_token", {
            path: "/",
            domain: domain,
          });
        } else {
          removeCookie("access_token", {
            path: "/",
            domain: domain,
          });
        }

        window.location.href = "login";
        alert(error.response.data.message);
      }
    } else if (error.response?.status === HttpStatusCode.InternalServerError) {
      logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, "서버 에러");
    }
    return Promise.reject(error);
  }
);

export default instance;
