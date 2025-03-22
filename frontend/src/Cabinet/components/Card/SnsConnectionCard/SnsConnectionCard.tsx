import React from "react";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
} from "@/Cabinet/components/Card/CardStyles";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { axiosDisconnectSocialAccount } from "@/Cabinet/api/axios/axios.custom";
import {
  getEnabledProviders,
  getSocialDisplayInfo,
} from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/loginType";

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
  // TODO : 왜 LoginProvider 타입 캐스팅?
  console.log("connectedProviders : ", connectedProviders);
  // ['google']

  console.log("userOauthConnections : ", userOauthConnections);
  // [{email: 'jeekimin3@gmail.com', providerType: 'google'}]
  const allProviders = getEnabledProviders();
  console.log("allProviders : ", allProviders);
  // allProviders에서 42(excludeProviders) 제외한 프로바이더 배열
  const allProvidersWO42 = allProviders.filter((elem) => elem !== "42");
  console.log("allProvidersWO42 : ", allProvidersWO42);

  const oauthConnectionAry: IOAuthConnection[] = allProvidersWO42.map(
    (elem) => {
      if (connectedProviders.includes(elem)) {
        const test = userOauthConnections.find((elem2) => {
          console.log(elem2.providerType.toLocaleLowerCase(), elem);
          return elem2.providerType.toLocaleLowerCase() == elem;
        });
        console.log("test : ", test);
        return test!;
      } else {
        return {
          providerType: elem,
          email: "연결되지 않았습니다",
        };
      }
    }
  );
  console.log("oauthConnectionAry : ", oauthConnectionAry);
  // ['42', 'google', 'kakao', 'github']
  const excludeProviders: LoginProvider[] = ["42"];
  console.log("excludeProviders : ", excludeProviders);
  // ['42']
  const availableProviders = allProviders.filter(
    (provider) =>
      !excludeProviders.includes(provider) &&
      !connectedProviders.includes(provider)
  ); // 아직 연동 안된 프로바이더
  // ['kakao', 'github']
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
      title="소셜 로그인"
      gridArea="snsConnection"
      height="290px"
      // buttons={cardButtons}
    >
      {/* <button onClick={handleButton}>연동 해지</button> */}
      {/* <CardContent> */}
      {/* <ConnectionsList> */}
      <>
        {oauthConnectionAry.map((connection, index) => {
          const providerKey =
            connection.providerType.toLowerCase() as LoginProvider;
          const displayInfo = getSocialDisplayInfo(providerKey);
          const isConnected = connectedProviders.includes(providerKey);

          return (
            <CardContentWrapper>
              <CardContentStyled>
                <ProviderInfoWrapper>
                  <IconWrapperStyled>{displayInfo.icon}</IconWrapperStyled>
                  <ConnectionInfo>
                    <ProviderName>
                      {connection.providerType.charAt(0).toUpperCase() +
                        connection.providerType.slice(1)}
                    </ProviderName>
                    <Email isConnected={isConnected}>{connection.email}</Email>
                  </ConnectionInfo>
                </ProviderInfoWrapper>
                <ButtonWrapperStyled>
                  {isConnected ? (
                    <MinusCircleIcon onClick={handleButton} />
                  ) : (
                    <PlusCircleIcon />
                  )}
                </ButtonWrapperStyled>
              </CardContentStyled>
            </CardContentWrapper>
          );
        })}
      </>
    </Card>
  );
};

const IconWrapperStyled = styled.div`
  margin-right: 14px;
  display: flex;
  width: 20px;
`;

const ConnectionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProviderName = styled.div`
  font-size: 16px;
  color: var(--normal-text-color);
`;

const Email = styled.div<{ isConnected: boolean }>`
  font-size: ${(props) => (props.isConnected ? "14px" : "13px")};
  color: var(--gray-text-color);
  color: var(--ref-gray-500);
  margin-top: 5px;
`;

const ButtonWrapperStyled = styled.div`
  margin-right: 10px;

  :hover {
    cursor: pointer;
  }
  /* TODO : stroke-width 더 크게? */
`;

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export default SnsConnectionCard;
