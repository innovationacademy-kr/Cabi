import axios from "axios";

const instance = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
});

export default instance;
