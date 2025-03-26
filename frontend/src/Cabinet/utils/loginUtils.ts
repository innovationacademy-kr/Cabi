import {
  IOAuthDisplay,
  OAUTH_CONFIG,
  TOAuthProvider,
} from "@/Cabinet/assets/data/oAuth";

export const getAllProviders = (): TOAuthProvider[] => {
  return Object.keys(OAUTH_CONFIG) as TOAuthProvider[];
};

export const getOAuthRedirectUrl = (provider: TOAuthProvider): string => {
  return OAUTH_CONFIG[provider].oAuthRedirectUrl;
};

export const getSocialDisplayInfo = (
  provider: TOAuthProvider
): IOAuthDisplay => {
  return OAUTH_CONFIG[provider].display;
};
