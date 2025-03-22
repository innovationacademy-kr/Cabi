export type LoginProvider = "42" | "google" | "kakao" | "github";

export interface ISocialLoginConfig {
  authUrl: string;
  display: {
    text: string;
    backgroundColor: string;
    fontColor: string;
    icon: React.ReactNode;
  };
}

export interface IUserOauthConnection {
  email: string;
  providerType: LoginProvider;
}

// TODO : 위치 변경 필요 - Cabinet으로