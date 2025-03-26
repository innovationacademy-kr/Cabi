import React from "react";
import { ReactComponent as FTLogo } from "@/Cabinet/assets/images/42Logo.svg";
import { ReactComponent as GithubLogo } from "@/Cabinet/assets/images/githubLogo.svg";
import { ReactComponent as GoogleLogo } from "@/Cabinet/assets/images/googleLogo.svg";
import { ReactComponent as KakaoLogo } from "@/Cabinet/assets/images/kakaoLogo.svg";

export type TLoginProvider = "42" | "google" | "kakao" | "github";

export interface ISocialLoginConfig {
  oAuthRedirectUrl: string;
  display: {
    text: string;
    backgroundColor: string;
    fontColor: string;
    icon: React.ReactNode;
  };
}

const OAUTH_BASE_URL = `${import.meta.env.VITE_BE_HOST}/oauth2/authorization/`;

// TODO : 색상 토큰 사용
export const OAUTH_CONFIG: Record<TLoginProvider, ISocialLoginConfig> = {
  42: {
    oAuthRedirectUrl: `${OAUTH_BASE_URL}ft`,
    // NOTE : forty-two 42
    display: {
      text: "42 Seoul 로그인",
      backgroundColor: "#9747FF",
      fontColor: "#FFFFFF",
      icon: React.createElement(FTLogo, {
        "aria-label": "42",
      }),
    },
  },
  google: {
    oAuthRedirectUrl: `${OAUTH_BASE_URL}google`,
    display: {
      text: "Google 로그인",
      // TODO : " 로그인" 삭제하고 -> 로그인 페이지에서만 " 로그인" 붙이기
      backgroundColor: "var(--ref-gray-100)",
      fontColor: "var(--ref-gray-900)",
      icon: React.createElement(GoogleLogo, {
        "aria-label": "google",
      }),
    },
  },
  kakao: {
    oAuthRedirectUrl: `${OAUTH_BASE_URL}kakao`,
    display: {
      text: "kakao 로그인",
      backgroundColor: "#FEE500",
      fontColor: "#000000d9",
      icon: React.createElement(KakaoLogo, {
        "aria-label": "kakao",
      }),
    },
  },
  github: {
    oAuthRedirectUrl: `${OAUTH_BASE_URL}github`,
    display: {
      text: "gitHub 로그인",
      backgroundColor: "#24292f",
      fontColor: "#ffffff",
      icon: React.createElement(GithubLogo, {
        "aria-label": "github",
      }),
    },
  },
};
