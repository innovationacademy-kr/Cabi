import React from "react";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { axiosDisconnectSocialAccount } from "@/Cabinet/api/axios/axios.custom";
import {
  getEnabledProviders,
  getSocialDisplayInfo,
} from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/login";

interface IOAuthConnection {
  providerType: string;
  email: string;
}

interface ISnsConnectionCardProps {
  userOauthConnections: IOAuthConnection[];
  onConnectService: (provider: LoginProvider) => void;
}

const SnsConnectionCard: React.FC<ISnsConnectionCardProps> = ({
  userOauthConnections,
  onConnectService,
}) => {
  const connectedProviders = userOauthConnections
    ? userOauthConnections.map(
        (conn) => conn.providerType.toLowerCase() as LoginProvider
      )
    : [];

  console.log("userOauthConnections : ", userOauthConnections);
  // [{email: 'jeekimin3@gmail.com', providerType: 'google'}]
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
    console.log("displayInfo : ", displayInfo);
    return {
      label: displayInfo.text.replace(" 로그인", " 연동"),
      onClick: () => onConnectService(provider),
      backgroundColor: displayInfo.backgroundColor,
      fontColor: displayInfo.fontColor,
      icon: null,
      isClickable: true,
    };
  });

  const tryDisconnectSocialAccount = async () => {
    try {
      const mailState = userOauthConnections[0].email;
      const providerTypeState = userOauthConnections[0].providerType;
      const response = await axiosDisconnectSocialAccount(
        mailState,
        providerTypeState
      );
      console.log(response);
      // TODO : 배열 중 하나 골라야됨

      // setMyLentInfoState(myLentInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButton = () => {
    tryDisconnectSocialAccount();
  };

  return (
    <Card
      title="연동 계정"
      gridArea="snsConnection"
      height="230px"
      buttons={cardButtons}
    >
      <CardContent>
        <button onClick={handleButton}>연동 해지</button>
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
                    <ProviderInfoWrapper>
                      <IconContainer>
                        {/* <IconWrapper>
                        </IconWrapper> */}
                        {displayInfo.icon}
                      </IconContainer>
                      <ConnectionInfo>
                        <ProviderName>
                          {connection.providerType.charAt(0).toUpperCase() +
                            connection.providerType.slice(1)}
                        </ProviderName>
                        <Email>{connection.email}</Email>
                      </ConnectionInfo>
                    </ProviderInfoWrapper>
                    <ButtonTest>+</ButtonTest>
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
  padding: 12px 16px 12px 12px;
  background-color: var(--card-content-bg-color);
  border-radius: 8px;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;
// TODO : IconContainer가 필요한가?

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
  /* font-weight: bold; */
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--normal-text-color);
`;

const Email = styled.div`
  font-size: 12px;
  color: var(--gray-text-color);
  color: var(--ref-gray-500);
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

const ButtonTest = styled.button`
  width: 16px;
  height: 16px;
  color: black;
  font-size: 16px;
  padding: 0;
  line-height: 16px;
`;
// TODO : svg 파일로 대체. 연동 / 연동 해지 버튼

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default SnsConnectionCard;
