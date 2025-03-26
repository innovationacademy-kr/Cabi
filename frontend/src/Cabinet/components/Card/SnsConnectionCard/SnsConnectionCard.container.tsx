import { HttpStatusCode } from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import SnsConnectionCard from "@/Cabinet/components/Card/SnsConnectionCard/SnsConnectionCard";
import SnsConnectionCardModal from "@/Cabinet/components/Card/SnsConnectionCard/SnsConnectionCardModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosDisconnectSocialAccount,
  axiosMyInfo,
} from "@/Cabinet/api/axios/axios.custom";
import {
  getAllOAuthProviders,
  getOAuthRedirectUrl,
} from "@/Cabinet/utils/oAuthUtils";

const SnsConnectionCardContainer = () => {
  const [myInfo, setMyInfo] = useRecoilState<UserDto>(userState);
  const userOauthConnection = myInfo.userOauthConnection;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState<TOAuthProvider>("42"); // 기본값: "42"
  const connectedProvider = userOauthConnection
    ? userOauthConnection.providerType
    : "";
  // 'google'

  const allProviders = getAllOAuthProviders();

  // allProviders에서 42(excludeProviders) 제외한 프로바이더 배열
  const allProvidersWO42: TOAuthProvider[] = allProviders.filter(
    (elem) => elem !== "42"
  );

  const oAuthConnectionAry: IUserOAuthConnectionDto[] = allProvidersWO42.map(
    (provider) => {
      if (connectedProvider === provider) {
        return userOauthConnection!;
      } else {
        return {
          providerType: provider,
          email: "",
        };
      }
    }
  );

  const excludeProviders: TOAuthProvider[] = ["42"];
  // ['42']

  const availableProviders = allProviders.filter(
    (provider) =>
      !excludeProviders.includes(provider) && connectedProvider !== provider
  ); // 아직 연동 안된 프로바이더. 42가 아니고, 연동된 프로바이더가 아닌 프로바이더들
  // ['kakao', 'github']
  // TODO: 안 사용하면 지우기

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

export default SnsConnectionCardContainer;
