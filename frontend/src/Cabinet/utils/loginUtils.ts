import {
  IOAuthConfig,
  OAUTH_CONFIG,
  TOAuthProvider,
} from "@/Cabinet/assets/data/login";

export const getEnabledProviders = (): TOAuthProvider[] => {
  return Object.keys(OAUTH_CONFIG) as TOAuthProvider[];
};
// TODO : getEnabledProviders -> getAllProviders

export const getOAuthRedirectUrl = (provider: TOAuthProvider): string => {
  return OAUTH_CONFIG[provider].oAuthRedirectUrl;
};

export const getSocialDisplayInfo = (
  provider: TOAuthProvider
): IOAuthConfig["display"] => {
  return OAUTH_CONFIG[provider].display;
};
