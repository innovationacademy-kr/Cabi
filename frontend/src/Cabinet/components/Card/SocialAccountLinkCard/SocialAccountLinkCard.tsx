import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { TOAuthProviderOrEmpty } from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard.container";
import SocialAccountLinkCardContentItem from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCardContentItem";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/oAuth.dto";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

interface ISocialAccountLinkCardProps {
  userOAuthLinks: IUserOAuthLinkInfoDto[];
  linkedProvider: TOAuthProviderOrEmpty;
  newProvider: TOAuthProvider;
  handleLinkSocialAccount: (provider: TOAuthProvider) => void;
  tryLinkSocialAccount: (provider: TOAuthProvider) => void;
  tryUnlinkSocialAccount: () => Promise<any>;
  getMyInfo: () => Promise<void>;
  modals: {
    isSwitchModalOpen: boolean;
    setIsSwitchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUnlinkModalOpen: boolean;
    setIsUnlinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const SocialAccountLinkCard = ({
  userOAuthLinks,
  linkedProvider,
  newProvider,
  handleLinkSocialAccount,
  tryLinkSocialAccount,
  tryUnlinkSocialAccount,
  getMyInfo,
  modals,
}: ISocialAccountLinkCardProps) => {
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
  );
};

const CardContentWrapper = styled.div`
  border-radius: 10px;
  margin: 0 5px;
  width: 90%;
  display: flex;
  flex-direction: column;
`;

export default SocialAccountLinkCard;
