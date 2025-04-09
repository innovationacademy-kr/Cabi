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
  onLinkSocialAccount: (provider: TOAuthProvider) => void;
  userOAuthLinks: IUserOAuthLinkInfoDto[];
  linkedProvider: TOAuthProviderOrEmpty;
  isSwitchModalOpen: boolean;
  setIsSwitchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newProvider: TOAuthProvider;
  tryUnlinkSocialAccount: () => Promise<any>;
  tryLinkSocialAccount: (provider: TOAuthProvider) => void;
  isUnlinkModalOpen: boolean;
  setIsUnlinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getMyInfo: () => Promise<void>;
}
// TODO : props diet

const SocialAccountLinkCard = ({
  onLinkSocialAccount,
  userOAuthLinks,
  linkedProvider,
  isSwitchModalOpen,
  setIsSwitchModalOpen,
  newProvider,
  tryUnlinkSocialAccount,
  tryLinkSocialAccount,
  isUnlinkModalOpen,
  setIsUnlinkModalOpen,
  getMyInfo,
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
                provider={provider}
                onLinkSocialAccount={onLinkSocialAccount}
                displayInfo={getOAuthDisplayInfo(provider)}
                linkInfo={linkInfo}
                isLinked={linkedProvider === provider}
                setIsUnlinkModalOpen={setIsUnlinkModalOpen}
              />
            );
          })}
        </CardContentWrapper>
      </Card>
      <ModalPortal>
        {isUnlinkModalOpen && (
          <SocialAccountUnlinkModal
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            getMyInfo={getMyInfo}
            setIsModalOpen={setIsUnlinkModalOpen}
            currentProvider={linkedProvider}
          />
        )}
        {isSwitchModalOpen && (
          <SocialAccountSwitchModal
            setIsModalOpen={setIsSwitchModalOpen}
            newProvider={newProvider}
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            tryLinkSocialAccount={tryLinkSocialAccount}
            getMyInfo={getMyInfo}
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
