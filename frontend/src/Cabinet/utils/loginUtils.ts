import {
  ISocialLoginConfig,
  LoginProvider,
} from "@/Presentation/types/common/loginType";
import { AUTH_CONFIG } from "../constants/login";

export const getEnabledProviders = (): LoginProvider[] => {
  return Object.keys(AUTH_CONFIG) as LoginProvider[];
};

export const getSocialAuthUrl = (provider: LoginProvider): string => {
  return AUTH_CONFIG[provider].authUrl;
};

export const getSocialDisplayInfo = (
  provider: LoginProvider
): ISocialLoginConfig["display"] => {
  return AUTH_CONFIG[provider].display;
};
