import React from "react";
import styled from "styled-components";
import {
  getEnabledProviders,
  getSocialDisplayInfo,
} from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/login";
import Card from "../Card";

interface OAuthConnection {
  providerType: string;
  email: string;
}

interface SnsConnectionCardProps {
  userOauthConnections: OAuthConnection[];
  onConnectService: (provider: LoginProvider) => void;
}

const SnsConnectionCard: React.FC<SnsConnectionCardProps> = ({
  userOauthConnections,
  onConnectService,
}) => {
  const connectedProviders = userOauthConnections
    ? userOauthConnections.map(
        (conn) => conn.providerType.toLowerCase() as LoginProvider
      )
    : [];

  console.log("connectedProviders : ", connectedProviders);
  const allProviders = getEnabledProviders();
  console.log("allProviders : ", allProviders);

  const excludeProviders: LoginProvider[] = ["42"];
  console.log("excludeProviders : ", excludeProviders);

  const availableProviders = allProviders.filter(
    (provider) =>
      !excludeProviders.includes(provider) &&
      !connectedProviders.includes(provider)
  );
  console.log("availableProviders : ", availableProviders);
  const cardButtons = availableProviders.map((provider) => {
    const displayInfo = getSocialDisplayInfo(provider);
    return {
      label: displayInfo.text.replace(" 로그인", " 연ㅁ동"),
      onClick: () => onConnectService(provider),
      backgroundColor: displayInfo.backgroundColor,
      fontColor: displayInfo.fontColor,
      icon: null,
      isClickable: true,
    };
  });

  return (
    <Card
      title="연동 계정"
      gridArea="snsConnection"
      height="230px"
      buttons={cardButtons}
    >
      <CardContent>
        aaa
        {userOauthConnections?.length > 0 ? (
          <ConnectionsList>
            {userOauthConnections
              .filter((connection) => {
                // 42는 표시하지 않음
                const providerKey =
                  connection.providerType.toLowerCase() as LoginProvider;
                return providerKey !== "42";
              })
              .map((connection, index) => {
                const providerKey =
                  connection.providerType.toLowerCase() as LoginProvider;
                const displayInfo = getSocialDisplayInfo(providerKey);

                return (
                  <ConnectionItem key={index}>
                    <IconContainer>
                      <IconWrapper>{displayInfo.icon}</IconWrapper>
                    </IconContainer>
                    <ConnectionInfo>
                      <ProviderName>
                        {connection.providerType.charAt(0).toUpperCase() +
                          connection.providerType.slice(1)}
                      </ProviderName>
                      <Email>{connection.email}</Email>
                    </ConnectionInfo>
                  </ConnectionItem>
                );
              })}
          </ConnectionsList>
        ) : (
          <EmptyState>연동된 계정이 없습니다</EmptyState>
        )}
      </CardContent>
    </Card>
  );
};

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
`;

const ConnectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ConnectionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: var(--card-content-bg-color);
  border-radius: 8px;
`;

const IconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const ConnectionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProviderName = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--normal-text-color);
`;

const Email = styled.div`
  font-size: 12px;
  color: var(--gray-text-color);
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 100%;
  color: var(--gray-text-color);
  font-size: 14px;
  background-color: var(--card-content-bg-color);
  border-radius: 8px;
`;

export default SnsConnectionCard;
