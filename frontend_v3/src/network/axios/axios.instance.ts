import axios from "axios";
import { removeCookie } from "../react-cookie/cookie";

const instance = axios.create({
  baseURL: window.location.origin,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // access_token unauthorized
    if (error.response?.status === 401) {
      removeCookie("access_token");
      alert(`🚨 로그인 정보가 만료되었습니다. 🚨\n다시 로그인해주세요`);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
