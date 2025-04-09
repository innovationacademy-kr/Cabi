import { HttpStatusCode } from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import { TOAuthProviderOrEmpty } from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard.container";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosMyInfo,
  axiosUnlinkSocialAccount,
} from "@/Cabinet/api/axios/axios.custom";
import { getOAuthRedirectUrl } from "@/Cabinet/utils/oAuthUtils";
import { linkedOAuthInfoState } from "../recoil/selectors";

const useOAuth = () => {
  const linkedOAuthInfo = useRecoilValue(linkedOAuthInfoState);
  const setMyInfo = useSetRecoilState<UserDto>(userState);
  const linkedProvider: TOAuthProviderOrEmpty = linkedOAuthInfo
    ? linkedOAuthInfo.providerType
    : "";
  // TODO : 훅 말고 selectors로?

  function updateUnlinkedProviderStatus(
    provider: TOAuthProvider,
    status: boolean
  ) {
    const currentValue = JSON.parse(localStorage.getItem("isUnlinked") || "{}");
    const updatedValue = {
      ...currentValue,
      [provider]: status,
    };

    localStorage.setItem("isUnlinked", JSON.stringify(updatedValue));
  }

  const tryLinkSocialAccount = (provider: TOAuthProvider) => {
    const redirectUrl = getOAuthRedirectUrl(provider);
    const isUnlinkedValue = JSON.parse(
      localStorage.getItem("isUnlinked") || "{}"
    );

    if (isUnlinkedValue[provider] === true) {
      updateUnlinkedProviderStatus(provider, false);
      window.location.replace(redirectUrl + "?prompt=login");
    } else {
      window.location.replace(redirectUrl);
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
    tryLinkSocialAccount,
    tryUnlinkSocialAccount,
    getMyInfo,
    linkedProvider,
  };
};

export default useOAuth;
