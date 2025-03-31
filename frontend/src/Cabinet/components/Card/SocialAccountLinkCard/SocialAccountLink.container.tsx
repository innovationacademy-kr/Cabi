import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import SocialAccountLinkCard from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard";
import {
  TOAuthProvider,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosMyInfo,
  axiosUnlinkSocialAccount,
} from "@/Cabinet/api/axios/axios.custom";
import { getOAuthRedirectUrl } from "@/Cabinet/utils/oAuthUtils";

const SocialAccountLinkContainer = () => {
  const [myInfo, setMyInfo] = useRecoilState<UserDto>(userState);
  const linkedOAuthInfo = myInfo.userOauthConnection;
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState<TOAuthProvider>(ftProvider);
  const linkedProvider = linkedOAuthInfo ? linkedOAuthInfo.providerType : "";

  const userOAuthLinks: IUserOAuthLinkInfoDto[] = socialOAuthProviders.map(
    (provider) => {
      if (linkedProvider === provider) {
        return linkedOAuthInfo!;
      } else {
        return {
          providerType: provider,
          email: "",
        };
      }
    }
  );

  const getMyInfo = async () => {
    try {
      const response = await axiosMyInfo();
      setMyInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const tryUnlinkSocialAccount = async () => {
    if (linkedOAuthInfo) {
      try {
        const mailState = linkedOAuthInfo.email;
        const providerTypeState = linkedOAuthInfo.providerType;

        const response = await axiosUnlinkSocialAccount(
          mailState,
          providerTypeState
        );

        return response;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tryLinkSocialAccount = (provider: TOAuthProvider) => {
    window.location.replace(getOAuthRedirectUrl(provider));
  };

  const handleLinkSocialAccount = (provider: TOAuthProvider) => {
    if (linkedProvider === "") {
      // 연결 아무것도 안함
      tryLinkSocialAccount(provider);
    } else {
      // 연결한 상태에서 다른 소셜 계정 연결 시도
      setNewProvider(provider);
      setIsSwitchModalOpen(true);
    }
  }; // TODO : 서비스 연결 기능 - 유틸리티 함수 사용. 연결 버튼 눌렀을때 실행. 주석 변경 필요

  return (
    <SocialAccountLinkCard
      onLinkSocialAccount={handleLinkSocialAccount}
      userOAuthLinks={userOAuthLinks}
      linkedProvider={linkedProvider}
      isSwitchModalOpen={isSwitchModalOpen}
      setIsSwitchModalOpen={setIsSwitchModalOpen}
      newProvider={newProvider}
      tryUnlinkSocialAccount={tryUnlinkSocialAccount}
      tryLinkSocialAccount={tryLinkSocialAccount}
      isUnlinkModalOpen={isUnlinkModalOpen}
      setIsUnlinkModalOpen={setIsUnlinkModalOpen}
      getMyInfo={getMyInfo}
    />
  );
};

export default SocialAccountLinkContainer;
// TODO : SocialAccountLinkCardContainer로 이름 변경
