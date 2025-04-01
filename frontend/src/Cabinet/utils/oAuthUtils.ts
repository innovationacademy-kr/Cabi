import {
  IOAuthDisplay,
  OAUTH_CONFIG,
  TOAuthProvider,
} from "@/Cabinet/assets/data/oAuth";

export const getOAuthRedirectUrl = (provider: TOAuthProvider): string => {
  return OAUTH_CONFIG[provider].oAuthRedirectUrl;
};

export const getOAuthDisplayInfo = (
  provider: TOAuthProvider
): IOAuthDisplay => {
  return OAUTH_CONFIG[provider].display;
};
