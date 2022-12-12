import axios from "axios";
import { removeCookie } from "../react-cookie/cookie";

const instance = axios.create({
  // baseURL: window.location.origin,
  baseURL: import.meta.env.VITE_DEV_HOST,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // access_token unauthorized
    if (error.response?.status === 401) {
      removeCookie("access_token");
      alert(error.response.data.message);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
