import { captureException } from "@sentry/react";
import { AxiosError } from "axios";

export function logAxiosError(error: AxiosError, type: string, errorMsg : string) {
	error.message =  "[Axios] " + errorMsg;
	captureException(error, {
	  tags: {
		// user:
		api: error.response?.config.url,
		httpMethod: error.config?.method?.toUpperCase(),
		httpStatusCode: (error.response?.status || "").toString(),
	  },
	  level: "error",
	  extra: { type: type },
	});
  }