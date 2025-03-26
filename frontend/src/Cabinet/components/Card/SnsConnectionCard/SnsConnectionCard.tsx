import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
} from "@/Cabinet/components/Card/CardStyles";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

interface ISnsConnectionCardProps {
  onConnectService: (provider: TOAuthProvider) => void;
  oAuthConnectionAry: IUserOAuthConnectionDto[];
  connectedProvider: TOAuthProvider | "";
  handleDisconnectButton: () => void;
}

const SnsConnectionCard = ({
  onConnectService,
  oAuthConnectionAry,
  connectedProvider,
  handleDisconnectButton,
}: ISnsConnectionCardProps) => {
  return (
    <Card title="소셜 로그인" gridArea="snsConnection" height="290px">
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
                    <ProviderName>
                      {displayInfo.text.replace(" 로그인", "")}
                    </ProviderName>
                    {connection.email && (
                      <Email isConnected={isConnected}>
                        {connection.email}
                      </Email>
                    )}
                  </ConnectionInfo>
                </ProviderInfoWrapper>
                <ButtonWrapperStyled isConnected={isConnected}>
                  {isConnected ? (
                    <MinusCircleIcon onClick={handleDisconnectButton} />
                  ) : (
                    <PlusCircleIcon
                      onClick={() => onConnectService(providerKey)}
                    />
                  )}
                </ButtonWrapperStyled>
              </CardContentStyled>
            </CardContentWrapper>
          );
        })}
      </>
    </Card>
  );
};

// const cardButtons = availableProviders.map((provider) => {
//   const displayInfo = getOAuthDisplayInfo(provider);
//   console.log("displayInfo : ", displayInfo);
//   return {
//     label: displayInfo.text.replace(" 로그인", " 연동"),
//     onClick: () => onConnectService(provider),
//     backgroundColor: displayInfo.backgroundColor,
//     fontColor: displayInfo.fontColor,
//     icon: null,
//     isClickable: true,
//   };
// });

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

export default SnsConnectionCard;
