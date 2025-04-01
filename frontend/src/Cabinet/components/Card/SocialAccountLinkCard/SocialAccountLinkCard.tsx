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

// TODO : notificationSign_grey notificationSignGray로 이름 변경
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
  isToolTipClicked: boolean;
  setIsToolTipClicked: React.Dispatch<React.SetStateAction<boolean>>;
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
  isToolTipClicked,
  setIsToolTipClicked,
}: ISocialAccountLinkCardProps) => {
  return (
    <>
      <Card
        title="소셜 로그인"
        gridArea="socialAccountLink"
        height="276px"
        onClickToolTip={() => setIsToolTipClicked((prev) => !prev)}
      >
        <CardContentWrapper>
          {isToolTipClicked && (
            <TooltipBox>하나의 소셜 계정만 연결할 수 있습니다.</TooltipBox>
          )}
          {/* <TooltipCard ref={tooltipCardRef}> */}
          {/* <TooltipCard>
            <ToolTipIconStyled />
            <TooltipBox>test</TooltipBox>
          </TooltipCard> */}
          {/* <HoverBox>
            <AlertImgStyled src={alertImg} />
            공유사물함을 단독으로 이용 시, <br />
            연장권을 사용할 수 없습니다.
          </HoverBox> */}
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

const ToolTipIconWrapperStyled = styled.div`
  background-color: blue;
  width: 16px;
  height: 16px;
  opacity: 0.7;

  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const ToolTipIconStyled = styled.div`
  background-image: url("/src/Cabinet/assets/images/cautionSign.svg");
  width: 24px;
  height: 24px;
  margin: 0px auto;
  opacity: 0.6;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const TooltipBox = styled.div`
  margin: 10px auto;
  background-color: var(--tooltip-shadow-color);
  width: 280px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
  line-height: 1.25rem;
  letter-spacing: -0.02rem;
  color: var(--white-text-with-bg-color);
`;

const HoverBox = styled.div<{
  canUseExtendTicket?: boolean;
}>`
  /* position: absolute; */
  opacity: 0;
  /* visibility: hidden; */
  /* top: -120%; */
  width: 270px;
  height: 80px;
  padding: 10px;
  background-color: rgba(73, 73, 73, 0.99);
  background-color: blue;
  border-radius: 10px;
  box-shadow: 4px 4px 20px 0px var(--hover-box-shadow-color);
  font-size: 0.875rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  transition: opacity 0.3s ease;
  line-height: 1.2;
  z-index: 1;
`;

const AlertImgStyled = styled.img`
  width: 20px;
  height: 20px;
  /* filter: invert(99%) sepia(100%) saturate(3%) hue-rotate(32deg)
    brightness(104%) contrast(100%); */
`;

export default SocialAccountLinkCard;
