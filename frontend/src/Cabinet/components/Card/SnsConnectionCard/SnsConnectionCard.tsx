import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
} from "@/Cabinet/components/Card/CardStyles";
import { TLoginProvider } from "@/Cabinet/assets/data/login";
import { ReactComponent as MinusCircleIcon } from "@/Cabinet/assets/images/minusCircle.svg";
import { ReactComponent as PlusCircleIcon } from "@/Cabinet/assets/images/plusCircle.svg";
import { IUserOAuthConnectionDto } from "@/Cabinet/types/dto/login.dto";
import { getSocialDisplayInfo } from "@/Cabinet/utils/loginUtils";

interface ISnsConnectionCardProps {
  onConnectService: (provider: TLoginProvider) => void;
  oAuthConnectionAry: IUserOAuthConnectionDto[];
  connectedProvider: TLoginProvider | "";
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
          const providerKey =
            connection.providerType.toLowerCase() as TLoginProvider;
          const displayInfo = getSocialDisplayInfo(providerKey);
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
                    <Email isConnected={isConnected}>{connection.email}</Email>
                  </ConnectionInfo>
                </ProviderInfoWrapper>
                <ButtonWrapperStyled>
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
//   const displayInfo = getSocialDisplayInfo(provider);
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

const ButtonWrapperStyled = styled.div`
  margin-right: 10px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 16px;
    height: 16px;
  }

  :hover {
    cursor: pointer;
  }

  & > svg > circle {
    stroke-width: 1.2;
  }

  & > svg > path {
    stroke-width: 1.2;
  }
`;

const ProviderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export default SnsConnectionCard;
