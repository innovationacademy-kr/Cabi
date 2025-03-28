import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import SocialAccountLinkCard from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard";
import {
  TOAuthProvider,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosDisconnectSocialAccount,
  axiosMyInfo,
} from "@/Cabinet/api/axios/axios.custom";
import { getOAuthRedirectUrl } from "@/Cabinet/utils/oAuthUtils";

const SocialAccountLinkContainer = () => {
  const [myInfo, setMyInfo] = useRecoilState<UserDto>(userState);
  const userOauthConnection = myInfo.userOauthConnection;
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState<TOAuthProvider>(ftProvider);
  const connectedProvider = userOauthConnection
    ? userOauthConnection.providerType
    : "";

  const oAuthConnectionAry: IUserOAuthConnectionDto[] =
    socialOAuthProviders.map((provider) => {
      if (connectedProvider === provider) {
        return userOauthConnection!;
      } else {
        return {
          providerType: provider,
          email: "",
        };
      }
    });

  const getMyInfo = async () => {
    try {
      const response = await axiosMyInfo();
      setMyInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const tryDisconnectSocialAccount = async () => {
    if (userOauthConnection) {
      try {
        const mailState = userOauthConnection.email;
        const providerTypeState = userOauthConnection.providerType;

        const response = await axiosDisconnectSocialAccount(
          mailState,
          providerTypeState
        );

        return response;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const connectService = (provider: TOAuthProvider) => {
    window.location.replace(getOAuthRedirectUrl(provider));
  };

  const handleConnectService = (provider: TOAuthProvider) => {
    if (connectedProvider === "") {
      // 연결 아무것도 안함
      connectService(provider);
    } else {
      // 연결한 상태에서 다른 소셜 계정 연결 시도
      setNewProvider(provider);
      setIsSwitchModalOpen(true);
    }
  }; // TODO : 서비스 연결 기능 - 유틸리티 함수 사용. 연결 버튼 눌렀을때 실행. 주석 변경 필요

  return (
    <SocialAccountLinkCard
      onConnectService={handleConnectService}
      oAuthConnectionAry={oAuthConnectionAry}
      connectedProvider={connectedProvider}
      isSwitchModalOpen={isSwitchModalOpen}
      setIsSwitchModalOpen={setIsSwitchModalOpen}
      newProvider={newProvider}
      tryDisconnectSocialAccount={tryDisconnectSocialAccount}
      connectService={connectService}
      setMyInfo={setMyInfo}
      isUnlinkModalOpen={isUnlinkModalOpen}
      setIsUnlinkModalOpen={setIsUnlinkModalOpen}
      getMyInfo={getMyInfo}
    />
  );
};

export default SocialAccountLinkContainer;
// TODO : SocialAccountLinkCardContainer로 이름 변경
