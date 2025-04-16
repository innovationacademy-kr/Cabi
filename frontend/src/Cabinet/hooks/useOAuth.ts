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

  interface IOAuthRedirectOptions {
    forceLoginPrompt: boolean;
    isAdmin: boolean;
    linkToken?: string;
  }

  // TODO : interface 정의?
  const createOAuthRedirectUrl = (
    provider: TOAuthProvider,
    options: IOAuthRedirectOptions
  ) => {
    const baseUrl = getOAuthRedirectUrl(provider);
    const url = new URL(baseUrl);

    if (options.linkToken) {
      url.searchParams.set("token", options.linkToken);
    }
    if (options.isAdmin) {
      url.searchParams.set("context", "admin");
    }
    if (options.forceLoginPrompt) {
      url.searchParams.set("prompt", "login");
    }
    return url.toString();
  };

  const handleOAuthRedirect = (
    provider: TOAuthProvider,
    options: IOAuthRedirectOptions,
    resetFlag: () => void
  ) => {
    const redirectUrl = createOAuthRedirectUrl(provider, options);

    if (options.forceLoginPrompt) {
      resetFlag();
    }

    window.location.replace(redirectUrl);
  };

  const handleOAuthLogin = (provider: TOAuthProvider, isAdmin = false) => {
    const isLoggedOut = getLocalStorageItem("isLoggedOut") === "true";

    setTargetLoginProvider(provider);
    handleOAuthRedirect(
      provider,
      {
        forceLoginPrompt: isLoggedOut,
        isAdmin,
      },
      () => removeLocalStorageItem("isLoggedOut")
      // TODO : 위치 변경 필요. 로그인이나 연결 제대로 된 후에 삭제해야함. 지금은 리다이렉트할때마다 삭제함.
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
      const response: any = await axiosLinkSocialAccount(provider);
      const linkToken = response.data.token;
      handleOAuthRedirect(
        provider,
        {
          forceLoginPrompt: isProviderUnlinked,
          isAdmin: false,
          linkToken,
        },
        () => updateUnlinkedProviderStatus(provider, false)
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
