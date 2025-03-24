import React from "react";

export type TLoginProvider = "42" | "google" | "kakao" | "github";

export interface ISocialLoginConfig {
  authUrl: string;
  display: {
    text: string;
    backgroundColor: string;
    fontColor: string;
    icon: React.ReactNode;
  };
}

const OAUTH_URL = `${import.meta.env.VITE_BE_HOST}/oauth2/authorization`;

// TODO : 색상 토큰 사용
export const AUTH_CONFIG: Record<TLoginProvider, ISocialLoginConfig> = {
  42: {
    authUrl: `${OAUTH_URL}/ft`,
    display: {
      text: "42 Seoul 로그인",
      backgroundColor: "#9747FF",
      fontColor: "#FFFFFF",
      icon: React.createElement("img", {
        src: "/src/Cabinet/assets/images/42_logo.svg",
        alt: "42",
      }),
    },
  },
  google: {
    authUrl: `${OAUTH_URL}/google`,
    display: {
      text: "Google 로그인",
      // TODO : " 로그인" 삭제하고 -> 로그인 페이지에서만 " 로그인" 붙이기
      backgroundColor: "var(--ref-gray-100)",
      fontColor: "var(--ref-gray-900)",
      icon: React.createElement("img", {
        src: "/src/Cabinet/assets/images/googleLogo.svg",
        alt: "Google",
      }),
    },
  },
  kakao: {
    authUrl: `${OAUTH_URL}/kakao`,
    display: {
      text: "kakao 로그인",
      backgroundColor: "#FEE500",
      fontColor: "#000000d9",
      icon: React.createElement("img", {
        src: "/src/Cabinet/assets/images/kakaoLogo.svg",
        alt: "kakao",
      }),
    },
  },
  github: {
    authUrl: `${OAUTH_URL}/github`,
    display: {
      text: "gitHub 로그인",
      backgroundColor: "#24292f",
      fontColor: "#ffffff",
      icon: React.createElement("img", {
        src: "/src/Cabinet/assets/images/githubLogo.svg",
        alt: "gitHub",
      }),
    },
  },
  // github logo 색 : #24292f
};
