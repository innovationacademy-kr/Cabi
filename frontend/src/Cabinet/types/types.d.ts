import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    csrfRequired?: boolean;
  }
}
