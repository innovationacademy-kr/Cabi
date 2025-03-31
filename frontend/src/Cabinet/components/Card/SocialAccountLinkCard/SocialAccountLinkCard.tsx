import { SetterOrUpdater } from "recoil";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
} from "@/Cabinet/components/Card/CardStyles";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

interface ISocialAccountLinkCardProps {
  onLinkSocialAccount: (provider: TOAuthProvider) => void;
  userOAuthLinks: IUserOAuthLinkInfoDto[];
  linkedProvider: TOAuthProvider | "";
  isSwitchModalOpen: boolean;
  setIsSwitchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newProvider: TOAuthProvider;
  tryUnlinkSocialAccount: () => Promise<any>;
  tryLinkSocialAccount: (provider: TOAuthProvider) => void;
  setMyInfo: SetterOrUpdater<UserDto>;
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
  setMyInfo,
  isUnlinkModalOpen,
  setIsUnlinkModalOpen,
  getMyInfo,
}: ISocialAccountLinkCardProps) => {
  console.log(
    "linkedProvider, isUnlinkModalOpen",
    linkedProvider,
    isUnlinkModalOpen
  );
  return (
    <>
      <Card title="소셜 로그인" gridArea="socialAccountLink" height="290px">
        <>
          {userOAuthLinks.map((linkInfo) => {
            const providerKey = linkInfo.providerType;
            const displayInfo = getOAuthDisplayInfo(providerKey);
            const isLinked = linkedProvider === providerKey;

            return (
              <CardContentWrapper key={providerKey}>
                <CardContentStyled>
                  <ProviderInfoWrapper>
                    <IconWrapperStyled>{displayInfo.icon}</IconWrapperStyled>
                    <LinkInfo>
                      <ProviderName>{displayInfo.text}</ProviderName>
                      {linkInfo.email && (
                        <Email isLinked={isLinked}>{linkInfo.email}</Email>
                      )}
                    </LinkInfo>
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
              </CardContentWrapper>
            );
          })}
        </>
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
        {isSwitchModalOpen && linkedProvider !== "" && (
          <SocialAccountSwitchModal
            setIsModalOpen={setIsSwitchModalOpen}
            currentProvider={linkedProvider}
            newProvider={newProvider}
            tryUnlinkSocialAccount={tryUnlinkSocialAccount}
            setMyInfo={setMyInfo}
            tryLinkSocialAccount={tryLinkSocialAccount}
          />
        )}
      </ModalPortal>
    </>
  );
};

const IconWrapperStyled = styled.div`
  margin-right: 14px;
  display: flex;
  width: 20px;
`;

const LinkInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProviderName = styled.div`
  font-size: 16px;
  color: var(--normal-text-color);
`;

const Email = styled.div<{ isLinked: boolean }>`
  font-size: ${(props) => (props.isLinked ? "14px" : "13px")};
  color: var(--gray-text-color);
  color: var(--ref-gray-500);
  margin-top: 5px;
`;

const ButtonWrapperStyled = styled.button<{ isLinked: boolean }>`
  margin-right: 10px;
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

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export default SocialAccountLinkCard;
