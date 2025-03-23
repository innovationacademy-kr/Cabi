import { HttpStatusCode } from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import SnsConnectionCard from "@/Cabinet/components/Card/SnsConnectionCard/SnsConnectionCard";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosDisconnectSocialAccount,
  axiosMyInfo,
} from "@/Cabinet/api/axios/axios.custom";
import {
  getEnabledProviders,
  getSocialAuthUrl,
} from "@/Cabinet/utils/loginUtils";
import { LoginProvider } from "@/Presentation/types/common/loginType";

const SnsConnectionCardContainer = () => {
  const [myInfo, setMyInfo] = useRecoilState<UserDto>(userState);
  const userOauthConnection = myInfo.userOauthConnection;

  const connectedProvider = userOauthConnection
    ? (userOauthConnection.providerType.toLowerCase() as LoginProvider)
    : "";
  // TODO : 왜 LoginProvider 타입 캐스팅?
  // console.log("connectedProvider : ", connectedProvider);
  // ['google']
  const allProviders = getEnabledProviders();
  // console.log("allProviders : ", allProviders);
  // allProviders에서 42(excludeProviders) 제외한 프로바이더 배열
  const allProvidersWO42: LoginProvider[] = allProviders.filter(
    (elem) => elem !== "42"
  );

  const oauthConnectionAry: IUserOAuthConnectionDto[] = allProvidersWO42.map(
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
  // console.log("oauthConnectionAry : ", oauthConnectionAry);
  // ['42', 'google', 'kakao', 'github']
  const excludeProviders: LoginProvider[] = ["42"];
  // console.log("excludeProviders : ", excludeProviders);
  // ['42']
  const availableProviders = allProviders.filter(
    (provider) =>
      !excludeProviders.includes(provider) && connectedProvider !== provider
  ); // 아직 연동 안된 프로바이더. 42가 아니고, 연동된 프로바이더가 아닌 프로바이더들
  // console.log("availableProviders : ", availableProviders);
  // ['kakao', 'github']
  // TODO: 안 사용하면 지우기

  // console.log("userOauthConnection : ", userOauthConnection);
  // [{email: 'jeekimin3@gmail.com', providerType: 'google'}]

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

  const handleButton = () => {
    tryDisconnectSocialAccount();
  };

  const handleConnectService = (provider: LoginProvider) => {
    const authUrl = getSocialAuthUrl(provider);
    if (authUrl) {
      window.location.replace(authUrl);
    }
  }; // 서비스 연동 기능 - 유틸리티 함수 사용. 연동 버튼 눌렀을때 실행

  return (
    <SnsConnectionCard
      onConnectService={handleConnectService}
      oauthConnectionAry={oauthConnectionAry}
      // TODO : oauthConnectionAry oAuthConnectionAry로 수정
      connectedProvider={connectedProvider}
      handleButton={handleButton}
    />
  );
};

export default SnsConnectionCardContainer;
