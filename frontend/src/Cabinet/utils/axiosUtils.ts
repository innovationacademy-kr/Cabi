import { AxiosHeaderValue, InternalAxiosRequestConfig } from "axios";

export const setHeader = (
  config: InternalAxiosRequestConfig,
  headerName: string,
  value: AxiosHeaderValue
) => {
  config.headers = config.headers || {};
  config.headers.set(headerName, value);
};

export const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token?: string
) => {
  if (token) setHeader(config, "Authorization", `Bearer ${token}`);
};
