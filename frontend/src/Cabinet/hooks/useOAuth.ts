import { HttpStatusCode } from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { targetLoginProviderState, userState } from "@/Cabinet/recoil/atoms";
import {
  linkedOAuthInfoState,
  linkedProviderState,
} from "@/Cabinet/recoil/selectors";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosLinkSocialAccount,
  axiosMyInfo,
  axiosUnlinkSocialAccount,
} from "@/Cabinet/api/axios/axios.custom";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/Cabinet/api/local_storage/local.storage";
import { getOAuthRedirectUrl } from "@/Cabinet/utils/oAuthUtils";

const useOAuth = () => {
  const linkedOAuthInfo = useRecoilValue(linkedOAuthInfoState);
  const linkedProvider = useRecoilValue(linkedProviderState);
  const setMyInfo = useSetRecoilState<UserDto>(userState);
  const setTargetLoginProvider = useSetRecoilState(targetLoginProviderState);

  const createOAuthRedirectUrl = (
    provider: TOAuthProvider,
    shouldForceLoginPrompt?: boolean,
    isAdmin?: boolean,
    linkParamVal?: string
  ) => {
    const baseUrl = getOAuthRedirectUrl(provider);
    const url = new URL(baseUrl);

    if (linkParamVal) {
      url.searchParams.set("token", linkParamVal);
    }
    if (isAdmin) {
      url.searchParams.set("context", "admin");
    }
    if (shouldForceLoginPrompt) {
      url.searchParams.set("prompt", "login");
    }

    return url.toString();
  };

  const handleOAuthRedirect = (
    provider: TOAuthProvider,
    shouldForceLoginPrompt: boolean,
    resetFlag: () => void,
    isAdmin?: boolean,
    // isLink?: boolean // TODO : 로그인 말고 계정 연결인지 확인
    linkParamVal?: string // TODO : 계정 연결 state=~
  ) => {
    console.log("handleOAuthRedirect");
    const redirectUrl = createOAuthRedirectUrl(
      provider,
      shouldForceLoginPrompt,
      isAdmin,
      linkParamVal
    );

    // let redirectUrl = getOAuthRedirectUrl(provider);

    // if (isAdmin) {
    //   redirectUrl += "?context=admin";
    // }
    if (shouldForceLoginPrompt) {
      resetFlag();
    }

    window.location.replace(redirectUrl);
  };

  const handleOAuthLogin = (provider: TOAuthProvider, isAdmin?: boolean) => {
    const isLoggedOut = getLocalStorageItem("isLoggedOut") === "true";

    setTargetLoginProvider(provider);
    handleOAuthRedirect(
      provider,
      isLoggedOut,
      () => removeLocalStorageItem("isLoggedOut"),
      isAdmin
    );
  };

  const updateUnlinkedProviderStatus = (
    provider: TOAuthProvider,
    status: boolean
  ) => {
    const currentValue = JSON.parse(getLocalStorageItem("isUnlinked") || "{}");
    const updatedValue = {
      ...currentValue,
      [provider]: status,
    };
    setLocalStorageItem("isUnlinked", JSON.stringify(updatedValue));
  };

  const handleSocialAccountLink = async (provider: TOAuthProvider) => {
    const isUnlinkedValue = JSON.parse(
      getLocalStorageItem("isUnlinked") || "{}"
    );
    const isProviderUnlinked = isUnlinkedValue[provider] === true;

    try {
      // TODO : 로딩 애니메이션
      const response: any = await axiosLinkSocialAccount(provider);
      const linkParamVal = response.data.token;
      // TODO : dto 정의
      handleOAuthRedirect(
        provider,
        isProviderUnlinked,
        () => updateUnlinkedProviderStatus(provider, false),
        false,
        linkParamVal
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const tryUnlinkSocialAccount = async () => {
    if (linkedOAuthInfo && linkedProvider) {
      try {
        const response = await axiosUnlinkSocialAccount(
          linkedOAuthInfo.email,
          linkedProvider
        );

        if (response.status === HttpStatusCode.Ok) {
          updateUnlinkedProviderStatus(linkedProvider, true);
        }

        return response;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getMyInfo = async () => {
    try {
      const response = await axiosMyInfo();
      setMyInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleSocialAccountLink,
    tryUnlinkSocialAccount,
    getMyInfo,
    handleOAuthLogin,
  };
};

export default useOAuth;
