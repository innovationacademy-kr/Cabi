import { HttpStatusCode } from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import SnsConnectionCard from "@/Cabinet/components/Card/SnsConnectionCard/SnsConnectionCard";
import SnsConnectionCardModal from "@/Cabinet/components/Card/SnsConnectionCard/SnsConnectionCardModal";
import { IModalContents } from "@/Cabinet/components/Modals/Modal";
import { TLoginProvider } from "@/Cabinet/assets/data/login";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import {
  axiosDisconnectSocialAccount,
  axiosMyInfo,
} from "@/Cabinet/api/axios/axios.custom";
import {
  getEnabledProviders,
  getSocialAuthUrl,
} from "@/Cabinet/utils/loginUtils";

const SnsConnectionCardContainer = () => {
  const [myInfo, setMyInfo] = useRecoilState<UserDto>(userState);
  const userOauthConnection = myInfo.userOauthConnection;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectedProvider = userOauthConnection
    ? (userOauthConnection.providerType.toLowerCase() as TLoginProvider)
    : "";
  // TODO : 백에서 providerType다 소문자로 보내주면 toLowerCase() 안해도 됨
  // TODO : 왜 TLoginProvider 타입 캐스팅?
  // 'google'

  const allProviders = getEnabledProviders();

  // allProviders에서 42(excludeProviders) 제외한 프로바이더 배열
  const allProvidersWO42: TLoginProvider[] = allProviders.filter(
    (elem) => elem !== "42"
  );

  const oAuthConnectionAry: IUserOAuthConnectionDto[] = allProvidersWO42.map(
    (provider) => {
      if (connectedProvider === provider) {
        return userOauthConnection!;
      } else {
        return {
          providerType: provider,
          email: "연결되지 않았습니다",
        };
      }
    }
  );

  const excludeProviders: TLoginProvider[] = ["42"];
  // ['42']

  const availableProviders = allProviders.filter(
    (provider) =>
      !excludeProviders.includes(provider) && connectedProvider !== provider
  ); // 아직 연동 안된 프로바이더. 42가 아니고, 연동된 프로바이더가 아닌 프로바이더들
  // ['kakao', 'github']
  // TODO: 안 사용하면 지우기

  // console.log("userOauthConnection : ", userOauthConnection);
  // {email: 'jeekimin3@gmail.com', providerType: 'google'}

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

        if (response.status === HttpStatusCode.Ok) await getMyInfo();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDisconnectButton = () => {
    tryDisconnectSocialAccount();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConnectService = (provider: TLoginProvider) => {
    // TODO connectedProvider가 있으면 다른 계정 연동 불가능하게 하기
    // 1. 아무것도 연동 안함 connectedProvider === ""
    // 2. 한 소셜 계정 연동중 connectedProvider !== ""
    if (connectedProvider === "") {
      // 연동 아무것도 안함
      const authUrl = getSocialAuthUrl(provider);

      if (authUrl) {
        window.location.replace(authUrl);
      }
    } else {
      // 연동한 상태에서 다른 소셜 계정 연동 시도
      // TODO : 모달 띄우기
      setIsModalOpen(true);
      const modalDetail = `연동돼 있는 ${connectedProvider} 연동 해제하고 ${provider}을 연동할까요?`;
    }
  }; // 서비스 연동 기능 - 유틸리티 함수 사용. 연동 버튼 눌렀을때 실행

  // const connectServiceModalContents: IModalContents = {
  //   type: "hasProceedBtn",
  //   iconType: IconType.CHECKICON,
  //   title: "소셜 계정 연동",
  //   // TODO : title 수정
  //   detail: modalDetail,
  //   proceedBtnText: "네, 새 계정을 연동하겠습니다",
  //   cancelBtnText: "취소",
  //   onClickProceed: () => {
  //     // TODO : 기존 연결 끊고 -> 새로운 소셜 계정 연동
  //   },
  //   closeModal: handleCloseModal,
  // };

  return (
    <>
      <SnsConnectionCard
        onConnectService={handleConnectService}
        oAuthConnectionAry={oAuthConnectionAry}
        connectedProvider={connectedProvider}
        handleDisconnectButton={handleDisconnectButton}
      />
      {isModalOpen && <SnsConnectionCardModal />}
    </>
  );
};

export default SnsConnectionCardContainer;
