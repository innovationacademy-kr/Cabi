import { HttpStatusCode } from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import SnsConnectionCard from "@/Cabinet/components/Card/SocialAccountLinkCard/SnsConnectionCard";
import SnsConnectionCardModal from "@/Cabinet/components/Card/SocialAccountLinkCard/SnsConnectionCardModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleDisconnectButton = async () => {
    const response = await tryDisconnectSocialAccount();

    if (response.status === HttpStatusCode.Ok) getMyInfo();
  };

  const connectService = (provider: TOAuthProvider) => {
    window.location.replace(getOAuthRedirectUrl(provider));
  };

  const handleConnectService = (provider: TOAuthProvider) => {
    if (connectedProvider === "") {
      // 연동 아무것도 안함
      connectService(provider);
    } else {
      // 연동한 상태에서 다른 소셜 계정 연동 시도
      setNewProvider(provider);
      setIsModalOpen(true);
    }
  }; // 서비스 연동 기능 - 유틸리티 함수 사용. 연동 버튼 눌렀을때 실행

  return (
    <>
      <SnsConnectionCard
        onConnectService={handleConnectService}
        oAuthConnectionAry={oAuthConnectionAry}
        connectedProvider={connectedProvider}
        handleDisconnectButton={handleDisconnectButton}
      />
      {isModalOpen && connectedProvider !== "" && (
        <SnsConnectionCardModal
          setIsModalOpen={setIsModalOpen}
          currentProvider={connectedProvider}
          newProvider={newProvider}
          tryDisconnectSocialAccount={tryDisconnectSocialAccount}
          setMyInfo={setMyInfo}
          connectService={connectService}
        />
      )}
    </>
  );
};

export default SocialAccountLinkContainer;
