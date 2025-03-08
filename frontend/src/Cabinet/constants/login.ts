import React from "react";
import {
  LoginProvider,
  SocialLoginConfig,
} from "@/Presentation/types/common/login";

const OAUTH_URL = `${import.meta.env.VITE_BE_HOST}/oauth2/authorization`;

export const AUTH_CONFIG: Record<LoginProvider, SocialLoginConfig> = {
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
        src: "/src/Cabinet/assets/images/google_logo.svg",
        alt: "Google",
      }),
    },
  },
};
