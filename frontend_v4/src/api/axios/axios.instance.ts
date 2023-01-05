import axios from "axios";
import { getCookie, removeCookie } from "@/api/react_cookie/cookies";

axios.defaults.withCredentials = true;

const instance = axios.create({
  // baseURL: window.location.origin,
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  const token = getCookie("access_token");
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
    if (error.response?.status === 401) {
      if (import.meta.env.VITE_IS_LOCAL === "true") {
        removeCookie("access_token");
      } else {
        removeCookie("access_token", { path: "/", domain: "cabi.42seoul.io" });
      }
      window.location.href = "/login";
      alert(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
