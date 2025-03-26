import {
  ISocialLoginConfig,
  OAUTH_CONFIG,
  TLoginProvider,
} from "@/Cabinet/assets/data/login";

export const getEnabledProviders = (): TLoginProvider[] => {
  return Object.keys(OAUTH_CONFIG) as TLoginProvider[];
};
// TODO : getEnabledProviders -> getAllProviders

export const getOAuthRedirectUrl = (provider: TLoginProvider): string => {
  return OAUTH_CONFIG[provider].oAuthRedirectUrl;
};

export const getSocialDisplayInfo = (
  provider: TLoginProvider
): ISocialLoginConfig["display"] => {
  return OAUTH_CONFIG[provider].display;
};
