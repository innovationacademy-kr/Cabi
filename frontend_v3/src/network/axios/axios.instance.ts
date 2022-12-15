import axios from "axios";
import { getCookie, removeCookie } from "../react-cookie/cookie";

axios.defaults.withCredentials = true;

const instance = axios.create({
  // baseURL: window.location.origin,
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
});

instance.interceptors.request.use(
  async config => {
    const token = getCookie('access_token');
    config.headers = {
      'Authorization': `Bearer ${token}`,
    }
    return config;
  }
);

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
