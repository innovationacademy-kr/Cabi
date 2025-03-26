import {
  AUTH_CONFIG,
  ISocialLoginConfig,
  TLoginProvider,
} from "@/Cabinet/assets/data/login";

export const getEnabledProviders = (): TLoginProvider[] => {
  return Object.keys(AUTH_CONFIG) as TLoginProvider[];
};
// TODO : getEnabledProviders -> getAllProviders

export const getOAuthRedirectUrl = (provider: TLoginProvider): string => {
  return AUTH_CONFIG[provider].oAuthRedirectUrl;
};

export const getSocialDisplayInfo = (
  provider: TLoginProvider
): ISocialLoginConfig["display"] => {
  return AUTH_CONFIG[provider].display;
};
