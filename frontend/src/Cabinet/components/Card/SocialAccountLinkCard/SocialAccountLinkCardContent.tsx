import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { targetProviderState } from "@/Cabinet/recoil/atoms";
import {
  linkedOAuthInfoState,
  linkedProviderState,
} from "@/Cabinet/recoil/selectors";
import {
  TOAuthProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/oAuth.dto";
import useOAuth from "@/Cabinet/hooks/useOAuth";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

const SocialAccountLinkCardContent = ({
  setIsUnlinkModalOpen,
  setIsSwitchModalOpen,
}: {
  setIsUnlinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSwitchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const linkedOAuthInfo = useRecoilValue(linkedOAuthInfoState);
  const linkedProvider = useRecoilValue(linkedProviderState);
  const userOAuthLinks: IUserOAuthLinkInfoDto[] = socialOAuthProviders.map(
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

  const setTargetProvider = useSetRecoilState(targetProviderState);

  const { tryLinkSocialAccount, tryUnlinkSocialAccount, getMyInfo } =
    useOAuth();

  const handleLinkSocialAccount = (provider: TOAuthProvider) => {
    setTargetProvider(provider);
    if (linkedProvider === "") {
      // 연결 아무것도 안함
      tryLinkSocialAccount(provider);
    } else {
      // 연결한 상태에서 다른 소셜 계정 연결 시도
      setIsSwitchModalOpen(true);
    }
  };

  return (
    <CardContentWrapper>
      {userOAuthLinks.map((linkInfo) => {
        const provider = linkInfo.providerType;
        const displayInfo = getOAuthDisplayInfo(provider);
        const isLinked = linkedProvider === provider;

        return (
          <CardContentStyled key={provider}>
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
                  onClick={() => handleLinkSocialAccount(provider)}
                  aria-label="연결"
                />
              )}
            </LinkButtonWrapperStyled>
          </CardContentStyled>
        );
      })}
    </CardContentWrapper>
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

export default SocialAccountLinkCardContent;
