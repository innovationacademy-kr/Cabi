import styled from "styled-components";
import { IOAuthDisplay, TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/oAuth.dto";

const SocialAccountLinkCardContentItem = ({
  provider,
  handleLinkSocialAccount,
  displayInfo,
  linkInfo,
  isLinked,
  setIsUnlinkModalOpen,
}: {
  provider: TOAuthProvider;
  handleLinkSocialAccount: (provider: TOAuthProvider) => void;
  displayInfo: IOAuthDisplay;
  linkInfo: IUserOAuthLinkInfoDto;
  isLinked: boolean;
  setIsUnlinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <CardContentStyled>
      <ProviderInfoWrapper>
        <ProviderIconWrapper backgroundColor={displayInfo.backgroundColor}>
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
            onClick={() => handleLinkSocialAccount(provider)}
            aria-label="연결"
          />
        )}
      </LinkButtonWrapperStyled>
    </CardContentStyled>
  );
};

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

export default SocialAccountLinkCardContentItem;
