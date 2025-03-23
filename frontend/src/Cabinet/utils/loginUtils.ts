import {
  AUTH_CONFIG,
  ISocialLoginConfig,
  TLoginProvider,
} from "@/Cabinet/constants/login";

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
