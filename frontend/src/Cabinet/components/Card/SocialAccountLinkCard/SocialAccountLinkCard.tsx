import { SetterOrUpdater } from "recoil";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
} from "@/Cabinet/components/Card/CardStyles";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

interface ISocialAccountLinkCardProps {
  onConnectService: (provider: TOAuthProvider) => void;
  oAuthConnectionAry: IUserOAuthConnectionDto[];
  connectedProvider: TOAuthProvider | "";
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newProvider: TOAuthProvider;
  tryDisconnectSocialAccount: () => Promise<any>;
  connectService: (provider: TOAuthProvider) => void;
  setMyInfo: SetterOrUpdater<UserDto>;
  isUnlinkModalOpen: boolean;
  setIsUnlinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getMyInfo: () => Promise<void>;
}
// TODO : props diet?

const SocialAccountLinkCard = ({
  onConnectService,
  oAuthConnectionAry,
  connectedProvider,
  isModalOpen,
  setIsModalOpen,
  newProvider,
  tryDisconnectSocialAccount,
  connectService,
  setMyInfo,
  isUnlinkModalOpen,
  setIsUnlinkModalOpen,
  getMyInfo,
}: ISocialAccountLinkCardProps) => {
  return (
    <>
      <Card title="소셜 로그인" gridArea="socialAccountLink" height="290px">
        <>
          {oAuthConnectionAry.map((connection) => {
            const providerKey = connection.providerType;
            const displayInfo = getOAuthDisplayInfo(providerKey);
            const isConnected = connectedProvider === providerKey;

            return (
              <CardContentWrapper key={providerKey}>
                <CardContentStyled>
                  <ProviderInfoWrapper>
                    <IconWrapperStyled>{displayInfo.icon}</IconWrapperStyled>
                    <ConnectionInfo>
                      <ProviderName>{displayInfo.text}</ProviderName>
                      {connection.email && (
                        <Email isConnected={isConnected}>
                          {connection.email}
                        </Email>
                      )}
                    </ConnectionInfo>
                  </ProviderInfoWrapper>
                  <ButtonWrapperStyled isConnected={isConnected}>
                    {isConnected ? (
                      <MinusCircleIcon
                        onClick={() => setIsUnlinkModalOpen(true)}
                        aria-label="연결 해제"
                      />
                    ) : (
                      <PlusCircleIcon
                        onClick={() => onConnectService(providerKey)}
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
      {isUnlinkModalOpen && (
        <SocialAccountUnlinkModal
          tryDisconnectSocialAccount={tryDisconnectSocialAccount}
          getMyInfo={getMyInfo}
        />
      )}
      {isModalOpen && connectedProvider !== "" && (
        <SocialAccountSwitchModal
          setIsModalOpen={setIsModalOpen}
          currentProvider={connectedProvider}
          newProvider={newProvider}
          tryDisconnectSocialAccount={tryDisconnectSocialAccount}
          setMyInfo={setMyInfo}
          connectService={connectService}
        />
      )}
    </>
  );
};

const IconWrapperStyled = styled.div`
  margin-right: 14px;
  display: flex;
  width: 20px;
`;

const ConnectionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProviderName = styled.div`
  font-size: 16px;
  color: var(--normal-text-color);
`;

const Email = styled.div<{ isConnected: boolean }>`
  font-size: ${(props) => (props.isConnected ? "14px" : "13px")};
  color: var(--gray-text-color);
  color: var(--ref-gray-500);
  margin-top: 5px;
`;

const ButtonWrapperStyled = styled.button<{ isConnected: boolean }>`
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
    stroke: ${(props) => !props.isConnected && "var(--line-color)"};
  }

  & > svg > path {
    stroke-width: 1.2;
    stroke: ${(props) => !props.isConnected && "var(--line-color)"};
  }
`;

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export default SocialAccountLinkCard;
