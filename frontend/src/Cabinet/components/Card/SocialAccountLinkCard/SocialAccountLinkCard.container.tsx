import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  linkedOAuthInfoState,
  linkedProviderState,
} from "@/Cabinet/recoil/selectors";
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
import SocialAccountLinkCardContentItem from "./SocialAccountLinkCardContent";
import SocialAccountLinkCardContent from "./SocialAccountLinkCardContent";

export type TOAuthProviderOrEmpty = TOAuthProvider | "";
// TODO : 타입 다른데에서도 사용

const SocialAccountLinkCardContainer = () => {
  const linkedProvider = useRecoilValue(linkedProviderState);
  const { tryLinkSocialAccount, tryUnlinkSocialAccount, getMyInfo } =
    useOAuth();
  // TODO : 주석 삭제. tryUnlinkSocialAccount, getMyInfo 넘겨주기 위한 용
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);

  return (
    <>
      <Card
        title="소셜 로그인"
        gridArea="socialAccountLink"
        height="276px"
        tooltipText="소셜 계정은 하나만 연결할 수 있습니다."
      >
        <SocialAccountLinkCardContent
          setIsUnlinkModalOpen={setIsUnlinkModalOpen}
          setIsSwitchModalOpen={setIsSwitchModalOpen}
        />
      </Card>
      <ModalPortal>
        {isUnlinkModalOpen && (
          <SocialAccountUnlinkModal
            currentProvider={linkedProvider}
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            getMyInfo={getMyInfo}
            setIsModalOpen={setIsUnlinkModalOpen}
          />
        )}
        {isSwitchModalOpen && (
          <SocialAccountSwitchModal
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            getMyInfo={getMyInfo}
            tryLinkSocialAccount={tryLinkSocialAccount}
            setIsModalOpen={setIsSwitchModalOpen}
          />
        )}
      </ModalPortal>
    </>
  );
};

export default SocialAccountLinkCardContainer;
