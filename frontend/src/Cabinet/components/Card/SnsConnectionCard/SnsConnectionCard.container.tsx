// SnsConnectionCard.container.tsx
import React from "react";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { getSocialAuthUrl } from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/loginType";
import SnsConnectionCard from "./SnsConnectionCard";

interface SnsConnectionCardContainerProps {
  userOauthConnection: IUserOAuthConnectionDto | null;
}

const SnsConnectionCardContainer: React.FC<SnsConnectionCardContainerProps> = ({
  userOauthConnection,
}) => {
  // 단일 연결 객체를 배열로 변환
  const connections = userOauthConnection ? [userOauthConnection] : [];
  console.log("userOauthConnection : ", userOauthConnection);
  // 연동된 서비스 배열

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
