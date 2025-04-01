import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { TOAuthProviderOrEmpty } from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard.container";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
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
            const providerKey = linkInfo.providerType;
            const displayInfo = getOAuthDisplayInfo(providerKey);
            const isLinked = linkedProvider === providerKey;

            return (
              <CardContentStyled key={providerKey}>
                <ProviderInfoWrapper>
                  <ProviderIconWrapper
                    backgroundColor={displayInfo.backgroundColor}
                  >
                    {displayInfo.icon}
                  </ProviderIconWrapper>
                  <ProviderInfoTextStyled>
                    <ProviderNameStyled>{displayInfo.text}</ProviderNameStyled>
                    {linkInfo.email && (
                      <EmailAddressStyled isLinked={isLinked}>
                        {linkInfo.email}
                      </EmailAddressStyled>
                    )}
                  </ProviderInfoTextStyled>
                </ProviderInfoWrapper>
                <LinkButtonWrapperStyled isLinked={isLinked}>
                  {isLinked ? (
                    <MinusCircleIcon
                      onClick={() => setIsUnlinkModalOpen(true)}
                      aria-label="연결 해제"
                    />
                  ) : (
                    <PlusCircleIcon
                      onClick={() => onLinkSocialAccount(providerKey)}
                      aria-label="연결"
                    />
                  )}
                </LinkButtonWrapperStyled>
              </CardContentStyled>
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

const CardContentStyled = styled.div`
  background-color: var(--card-content-bg-color);
  height: 60px;
  border-radius: 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProviderIconWrapper = styled.div<{ backgroundColor: string }>`
  margin: 0 16px;
  display: flex;
  justify-content: center;
  width: 42px;
  height: 42px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 50%;

  & > svg {
    width: 20px;
  }
`;

const ProviderInfoTextStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProviderNameStyled = styled.div`
  font-size: 16px;
  color: var(--normal-text-color);
`;

const EmailAddressStyled = styled.div<{ isLinked: boolean }>`
  font-size: 12px;
  color: var(--gray-line-btn-color);
  margin-top: 6px;
`;

const LinkButtonWrapperStyled = styled.button<{ isLinked: boolean }>`
  margin-right: 16px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  background-color: var(--card-content-bg-color);

  & > svg {
    width: 16px;
    height: 16px;
  }

  :hover {
    opacity: 0.8;
  }

  & > svg > circle,
  & > svg > path {
    stroke-width: 1.2;
    stroke: ${(props) => !props.isLinked && "var(--line-color)"};
  }
`;

export default SocialAccountLinkCard;
