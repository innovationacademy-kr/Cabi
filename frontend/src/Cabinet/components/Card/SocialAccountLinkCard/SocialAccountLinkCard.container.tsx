import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
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
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";
import ModalPortal from "../../Modals/ModalPortal";
import SocialAccountSwitchModal from "../../Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "../../Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import Card from "../Card";
import SocialAccountLinkCardContentItem from "./SocialAccountLinkCardContentItem";

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
    <>
      <Card
        title="소셜 로그인"
        gridArea="socialAccountLink"
        height="276px"
        tooltipText="소셜 계정은 하나만 연결할 수 있습니다."
      >
        <CardContentWrapper>
          {userOAuthLinks.map((linkInfo) => {
            const provider = linkInfo.providerType;

            return (
              <SocialAccountLinkCardContentItem
                key={provider}
                linkInfo={linkInfo}
                provider={provider}
                displayInfo={getOAuthDisplayInfo(provider)}
                isLinked={linkedProvider === provider}
                handleLinkSocialAccount={handleLinkSocialAccount}
                setIsUnlinkModalOpen={modals.setIsUnlinkModalOpen}
              />
            );
          })}
        </CardContentWrapper>
      </Card>
      <ModalPortal>
        {modals.isUnlinkModalOpen && (
          <SocialAccountUnlinkModal
            currentProvider={linkedProvider}
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            getMyInfo={getMyInfo}
            setIsModalOpen={modals.setIsUnlinkModalOpen}
          />
        )}
        {modals.isSwitchModalOpen && (
          <SocialAccountSwitchModal
            newProvider={newProvider}
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            getMyInfo={getMyInfo}
            tryLinkSocialAccount={tryLinkSocialAccount}
            setIsModalOpen={modals.setIsSwitchModalOpen}
          />
        )}
      </ModalPortal>
    </>
    // <SocialAccountLinkCard
    //   userOAuthLinks={userOAuthLinks}
    //   linkedProvider={linkedProvider}
    //   newProvider={newProvider}
    //   handleLinkSocialAccount={handleLinkSocialAccount}
    //   tryLinkSocialAccount={tryLinkSocialAccount}
    //   tryUnlinkSocialAccount={tryUnlinkSocialAccount}
    //   getMyInfo={getMyInfo}
    //   modals={modals}
    // />
  );
};

const CardContentWrapper = styled.div`
  border-radius: 10px;
  margin: 0 5px;
  width: 90%;
  display: flex;
  flex-direction: column;
`;
// TODO : 다른 곳에서도 사용되니까 CardContentWrapper 이름 변경

export default SocialAccountLinkCardContainer;
