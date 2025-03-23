import React from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
} from "@/Cabinet/components/Card/CardStyles";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosDisconnectSocialAccount,
  axiosMyInfo,
} from "@/Cabinet/api/axios/axios.custom";
import {
  getEnabledProviders,
  getSocialDisplayInfo,
} from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/loginType";

interface ISnsConnectionCardProps {
  userOauthConnections: IUserOAuthConnectionDto[];
  onConnectService: (provider: LoginProvider) => void;
}

const SnsConnectionCard: React.FC<ISnsConnectionCardProps> = ({
  userOauthConnections,
  onConnectService,
}) => {
  const setMyLentInfo = useSetRecoilState<UserDto>(userState);
  const connectedProviders = userOauthConnections
    ? userOauthConnections.map(
        (conn) => conn.providerType.toLowerCase() as LoginProvider
      )
    : [];
  // TODO : 왜 LoginProvider 타입 캐스팅?
  // console.log("connectedProviders : ", connectedProviders);
  // ['google']
  const allProviders = getEnabledProviders();
  // console.log("allProviders : ", allProviders);
  // allProviders에서 42(excludeProviders) 제외한 프로바이더 배열
  const allProvidersWO42: LoginProvider[] = allProviders.filter(
    (elem) => elem !== "42"
  );
  const oauthConnectionAry: IUserOAuthConnectionDto[] = allProvidersWO42.map(
    (provider) => {
      if (connectedProviders.includes(provider)) {
        const userOauthConnection = userOauthConnections.find(
          (connection) =>
            connection.providerType.toLocaleLowerCase() == provider
        );
        return userOauthConnection!;
      } else {
        return {
          providerType: provider,
          email: "연결되지 않았습니다",
        };
      }
    }
  );
  // console.log("oauthConnectionAry : ", oauthConnectionAry);
  // ['42', 'google', 'kakao', 'github']
  const excludeProviders: LoginProvider[] = ["42"];
  // console.log("excludeProviders : ", excludeProviders);
  // ['42']
  const availableProviders = allProviders.filter(
    (provider) =>
      !excludeProviders.includes(provider) &&
      !connectedProviders.includes(provider)
  ); // 아직 연동 안된 프로바이더
  // console.log("availableProviders : ", availableProviders);
  // ['kakao', 'github']

  // console.log("userOauthConnections : ", userOauthConnections);
  // [{email: 'jeekimin3@gmail.com', providerType: 'google'}]

  const getMyInfo = async () => {
    try {
      const response = await axiosMyInfo();
      setMyLentInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const tryDisconnectSocialAccount = async () => {
    try {
      const mailState = userOauthConnections[0].email;
      const providerTypeState = userOauthConnections[0].providerType;
      // TODO : 배열 중 하나 골라야됨

      const response = await axiosDisconnectSocialAccount(
        mailState,
        providerTypeState
      );
      await getMyInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleButton = () => {
    tryDisconnectSocialAccount();
  };

  return (
    <Card title="소셜 로그인" gridArea="snsConnection" height="290px">
      <>
        {oauthConnectionAry.map((connection) => {
          const providerKey =
            connection.providerType.toLowerCase() as LoginProvider;
          const displayInfo = getSocialDisplayInfo(providerKey);
          const isConnected = connectedProviders.includes(providerKey);

          return (
            <CardContentWrapper key={providerKey}>
              <CardContentStyled>
                <ProviderInfoWrapper>
                  <IconWrapperStyled>{displayInfo.icon}</IconWrapperStyled>
                  <ConnectionInfo>
                    <ProviderName>
                      {displayInfo.text.replace(" 로그인", "")}
                    </ProviderName>
                    <Email isConnected={isConnected}>{connection.email}</Email>
                  </ConnectionInfo>
                </ProviderInfoWrapper>
                <ButtonWrapperStyled>
                  {isConnected ? (
                    <MinusCircleIcon onClick={handleButton} />
                  ) : (
                    <PlusCircleIcon
                      onClick={() => onConnectService(providerKey)}
                    />
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

// const cardButtons = availableProviders.map((provider) => {
//   const displayInfo = getSocialDisplayInfo(provider);
//   console.log("displayInfo : ", displayInfo);
//   return {
//     label: displayInfo.text.replace(" 로그인", " 연동"),
//     onClick: () => onConnectService(provider),
//     backgroundColor: displayInfo.backgroundColor,
//     fontColor: displayInfo.fontColor,
//     icon: null,
//     isClickable: true,
//   };
// });

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
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 16px;
    height: 16px;
  }

  :hover {
    cursor: pointer;
  }

  & > svg > circle {
    stroke-width: 1.2;
  }

  & > svg > path {
    stroke-width: 1.2;
  }
`;

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export default SnsConnectionCard;
