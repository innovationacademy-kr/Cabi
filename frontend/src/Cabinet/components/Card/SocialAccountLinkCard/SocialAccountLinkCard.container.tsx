import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  linkedOAuthInfoState,
  linkedProviderState,
} from "@/Cabinet/recoil/selectors";
import SocialAccountLinkCard from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard";
import {
  TOAuthProvider,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/oAuth.dto";
import useOAuth from "@/Cabinet/hooks/useOAuth";

export type TOAuthProviderOrEmpty = TOAuthProvider | "";
// TODO : 타입 다른데에서도 사용

const SocialAccountLinkCardContainer = () => {
  const linkedOAuthInfo = useRecoilValue(linkedOAuthInfoState);
  const linkedProvider = useRecoilValue(linkedProviderState);
  const { tryLinkSocialAccount, tryUnlinkSocialAccount, getMyInfo } =
    useOAuth();
  // TODO : 주석 삭제. tryUnlinkSocialAccount, getMyInfo 넘겨주기 위한 용
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState<TOAuthProvider>(ftProvider);
  // TODO : 주석 삭제. 한군데에서만 사용됨
  const userOAuthLinks: IUserOAuthLinkInfoDto[] = socialOAuthProviders.map(
    // TODO : 주석 삭제. 여기에
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
  const modals = {
    isSwitchModalOpen,
    setIsSwitchModalOpen,
    isUnlinkModalOpen,
    setIsUnlinkModalOpen,
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
  }; // TODO : 주석 삭제. 한군데에서만 사용됨

  return (
    <SocialAccountLinkCard
      userOAuthLinks={userOAuthLinks}
      linkedProvider={linkedProvider}
      newProvider={newProvider}
      handleLinkSocialAccount={handleLinkSocialAccount}
      tryLinkSocialAccount={tryLinkSocialAccount}
      tryUnlinkSocialAccount={tryUnlinkSocialAccount}
      getMyInfo={getMyInfo}
      modals={modals}
    />
  );
};

export default SocialAccountLinkCardContainer;
