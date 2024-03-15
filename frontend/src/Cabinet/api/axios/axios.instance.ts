import axios from "axios";
import { getCookie, removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import { STATUS_401_UNAUTHORIZED } from "@/Cabinet/constants/StatusCode";

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  const token = getCookie("admin_access_token") ?? getCookie("access_token");
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // access_token unauthorized
    if (error.response?.status === STATUS_401_UNAUTHORIZED) {
      if (import.meta.env.VITE_IS_LOCAL === "true") {
        removeCookie("admin_access_token", {
          path: "/",
          domain: "localhost",
        });
        removeCookie("access_token");
      } else {
        removeCookie("admin_access_token", {
          path: "/",
          domain: "cabi.42seoul.io",
        });
        removeCookie("access_token", { path: "/", domain: "cabi.42seoul.io" });
      }
      window.location.href = "login";
      alert(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
