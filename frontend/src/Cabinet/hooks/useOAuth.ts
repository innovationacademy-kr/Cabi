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
  const setClickedLoginProvider = useSetRecoilState(targetLoginProviderState);

  const handleOAuthRedirect = (
    provider: TOAuthProvider,
    shouldForceLoginPrompt: boolean,
    resetFlag: () => void
  ) => {
    let redirectUrl = getOAuthRedirectUrl(provider);

    if (shouldForceLoginPrompt) {
      redirectUrl += "?prompt=login";
      resetFlag();
    }

    window.location.replace(redirectUrl);
  };

  const handleOAuthLogin = (provider: TOAuthProvider) => {
    const isLoggedOut = getLocalStorageItem("isLoggedOut") === "true";

    setClickedLoginProvider(provider);
    handleOAuthRedirect(provider, isLoggedOut, () =>
      removeLocalStorageItem("isLoggedOut")
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

  const handleSocialAccountLink = (provider: TOAuthProvider) => {
    const isUnlinkedValue = JSON.parse(
      getLocalStorageItem("isUnlinked") || "{}"
    );
    const isProviderUnlinked = isUnlinkedValue[provider] === true;

    handleOAuthRedirect(provider, isProviderUnlinked, () =>
      updateUnlinkedProviderStatus(provider, false)
    );
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
