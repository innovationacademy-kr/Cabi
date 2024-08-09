import { captureException } from "@sentry/react";
import ErrorType from "@/Cabinet/types/enum/error.type.enum";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";

const token = getCookie("admin_access_token") ?? getCookie("access_token");
const payload = token?.split(".")[1];
const userId = payload ? JSON.parse(window.atob(payload)).name : "Unknown";

export const logAxiosError = (
  error: any,
  type: ErrorType,
  errorMsg: string,
  isAdmin = false
) => {
  error.message = (isAdmin ? "[Admin] " : "") + errorMsg;
  captureException(error, {
    tags: {
      userId: userId,
      api: error.response?.config.url,
      httpMethod: error.config?.method?.toUpperCase(),
      httpStatusCode: (error.response?.status ?? "").toString(),
      environment:
        import.meta.env.VITE_IS_LOCAL === "true" ? "local" : "production",
    },
    level: "error",
    extra: { type: type },
  });
};
