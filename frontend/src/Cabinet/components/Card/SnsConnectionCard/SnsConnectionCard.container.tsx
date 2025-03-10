// SnsConnectionCard.container.tsx
import React from "react";
import { getSocialAuthUrl } from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/login";
import SnsConnectionCard from "./SnsConnectionCard";

// 연동 계정 정보 타입 정의
interface OAuthConnection {
  providerType: string;
  email: string;
}

interface SnsConnectionCardContainerProps {
  userOauthConnection: OAuthConnection | null;
}

const SnsConnectionCardContainer: React.FC<SnsConnectionCardContainerProps> = ({
  userOauthConnection,
}) => {
  // 단일 연결 객체를 배열로 변환
  const connections = userOauthConnection ? [userOauthConnection] : [];

  // 서비스 연동 기능 - 유틸리티 함수 사용
  const handleConnectService = (provider: LoginProvider) => {
    const authUrl = getSocialAuthUrl(provider);
    if (authUrl) {
      window.location.replace(authUrl);
    }
  };

  return (
    <SnsConnectionCard
      userOauthConnections={connections}
      onConnectService={handleConnectService}
    />
  );
};

export default SnsConnectionCardContainer;
