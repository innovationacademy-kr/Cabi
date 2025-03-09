export type LoginProvider = "42" | "google";

export interface SocialLoginConfig {
  authUrl: string;
  display: {
    text: string;
    backgroundColor: string;
    fontColor: string;
    icon: React.ReactNode;
  };
}

export interface UserOauthConnection {
  email: string;
  providerType: LoginProvider;
}
