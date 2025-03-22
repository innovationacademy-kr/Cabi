import React from "react";
import {
  ISocialLoginConfig,
  LoginProvider,
} from "@/Presentation/types/common/loginType";

const OAUTH_URL = `${import.meta.env.VITE_BE_HOST}/oauth2/authorization`;

export const AUTH_CONFIG: Record<LoginProvider, ISocialLoginConfig> = {
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
      backgroundColor: "#FFFFFF",
      fontColor: "#000000",
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
      backgroundColor: "blue",
      fontColor: "#000000",
      icon: React.createElement("img", {
        src: "/src/Cabinet/assets/images/googleLogo.svg",
        alt: "kakao",
      }),
    },
  },
  github: {
    authUrl: `${OAUTH_URL}/github`,
    display: {
      text: "gitHub 로그인",
      backgroundColor: "green",
      fontColor: "#000000",
      icon: React.createElement("img", {
        src: "/src/Cabinet/assets/images/googleLogo.svg",
        alt: "gitHub",
      }),
    },
  },
};
