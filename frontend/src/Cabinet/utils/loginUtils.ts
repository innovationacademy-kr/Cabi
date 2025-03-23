import { TLoginProvider } from "@/Cabinet/constants/login";
import { ISocialLoginConfig } from "@/Presentation/types/common/loginType";
import { AUTH_CONFIG } from "../constants/login";

export const getEnabledProviders = (): TLoginProvider[] => {
  return Object.keys(AUTH_CONFIG) as TLoginProvider[];
};

export const getSocialAuthUrl = (provider: TLoginProvider): string => {
  return AUTH_CONFIG[provider].authUrl;
};

export const getSocialDisplayInfo = (
  provider: TLoginProvider
): ISocialLoginConfig["display"] => {
  return AUTH_CONFIG[provider].display;
};
