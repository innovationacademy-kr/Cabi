import { captureException } from "@sentry/react";
import { AxiosError } from "axios";
import ErrorType from "@/Cabinet/types/enum/error.type.enum";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";

const token = getCookie("admin_access_token") ?? getCookie("access_token");
const decodedPayload = JSON.parse(window.atob(token.split(".")[1]));
const userId = decodedPayload.name;

export const logAxiosError = (
  error: AxiosError,
  type: ErrorType,
  errorMsg: string
) => {
  error.message = "[Axios] " + errorMsg;
  captureException(error, {
    tags: {
      userId: userId,
      api: error.response?.config.url,
      httpMethod: error.config?.method?.toUpperCase(),
      httpStatusCode: (error.response?.status ?? "").toString(),
    },
    level: "error",
    extra: { type: type },
  });
};
