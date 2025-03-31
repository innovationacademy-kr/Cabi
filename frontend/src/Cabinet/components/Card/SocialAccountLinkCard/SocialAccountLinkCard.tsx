import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { TOAuthProviderOrEmpty } from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLink.container";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/login.dto";
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
// TODO : props diet?

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
      <Card title="소셜 로그인" gridArea="socialAccountLink" height="248px">
        <CardContentWrapper>
          {userOAuthLinks.map((linkInfo) => {
            const providerKey = linkInfo.providerType;
            const displayInfo = getOAuthDisplayInfo(providerKey);
            const isLinked = linkedProvider === providerKey;

            return (
              <CardContentStyled key={providerKey}>
                <ProviderInfoWrapper>
                  <ProviderIconWrapper>{displayInfo.icon}</ProviderIconWrapper>
                  <ProviderInfoTextStyled>
                    <ProviderNameStyled>{displayInfo.text}</ProviderNameStyled>
                    {linkInfo.email && (
                      <EmailAddressStyled isLinked={isLinked}>
                        {linkInfo.email}
                      </EmailAddressStyled>
                    )}
                  </ProviderInfoTextStyled>
                </ProviderInfoWrapper>
                <ButtonWrapperStyled isLinked={isLinked}>
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
                </ButtonWrapperStyled>
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

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProviderIconWrapper = styled.div`
  margin: 0 16px;
  display: flex;
  width: 20px;
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
  font-size: 14px;
  color: var(--gray-text-color);
  color: var(--ref-gray-500);
  margin-top: 5px;
`;

const ButtonWrapperStyled = styled.button<{ isLinked: boolean }>`
  margin-right: 16px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  background-color: var(--bg-color);

  & > svg {
    width: 16px;
    height: 16px;
  }

  :hover {
    opacity: 0.8;
  }

  & > svg > circle {
    stroke-width: 1.2;
    stroke: ${(props) => !props.isLinked && "var(--line-color)"};
  }

  & > svg > path {
    stroke-width: 1.2;
    stroke: ${(props) => !props.isLinked && "var(--line-color)"};
  }
`;

const CardContentStyled = styled.div`
  background-color: #ffffff;
  height: 52px;
  border-radius: 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardContentWrapper = styled.div`
  border-radius: 10px;
  margin: 0 5px;
  width: 90%;
  display: flex;
  flex-direction: column;
`;

export default SocialAccountLinkCard;

// TODO: plus minus icon 파일명 변경 필요
