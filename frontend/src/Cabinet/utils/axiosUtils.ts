import { InternalAxiosRequestConfig } from "axios";

export const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token?: string
) => {
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
};
