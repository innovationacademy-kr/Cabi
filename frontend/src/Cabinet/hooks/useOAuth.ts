import { HttpStatusCode } from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { clickedLoginProviderState, userState } from "@/Cabinet/recoil/atoms";
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
import { getOAuthRedirectUrl } from "@/Cabinet/utils/oAuthUtils";

const useOAuth = () => {
  const linkedOAuthInfo = useRecoilValue(linkedOAuthInfoState);
  const linkedProvider = useRecoilValue(linkedProviderState);
  const setMyInfo = useSetRecoilState<UserDto>(userState);
  const setClickedLoginProvider = useSetRecoilState(clickedLoginProviderState);

  const handleOAuthRedirect = (
    provider: TOAuthProvider, // TODO : useOAuth 리팩토링 이후 주석 삭제. 필요함
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
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    setClickedLoginProvider(provider);
    handleOAuthRedirect(provider, isLoggedOut, () =>
      localStorage.removeItem("isLoggedOut")
    );
  };
  //   TODO : 함수명 변경

  // TODO : 함수 매개변수 필요없는거 삭제
  const updateUnlinkedProviderStatus = (
    provider: TOAuthProvider,
    status: boolean
  ) => {
    const currentValue = JSON.parse(localStorage.getItem("isUnlinked") || "{}");
    const updatedValue = {
      ...currentValue,
      [provider]: status,
    };

    localStorage.setItem("isUnlinked", JSON.stringify(updatedValue));
  };

  const handleSocialAccountLink = (provider: TOAuthProvider) => {
    const isUnlinkedValue = JSON.parse(
      localStorage.getItem("isUnlinked") || "{}"
    );
    const isProviderUnlinked = isUnlinkedValue[provider] === true;

    handleOAuthRedirect(provider, isProviderUnlinked, () =>
      updateUnlinkedProviderStatus(provider, false)
    );
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

        if (response.status === HttpStatusCode.Ok && linkedProvider) {
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
