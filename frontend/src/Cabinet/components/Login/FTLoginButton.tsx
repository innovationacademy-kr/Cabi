import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  ISocialLoginConfig,
  TLoginProvider,
} from "@/Cabinet/assets/data/login";

interface LoginButtonProps {
  onClick: (provider?: TLoginProvider) => void;
  display: ISocialLoginConfig["display"];
  isClicked: boolean;
  isTarget: boolean;
  provider: TLoginProvider;
}

const FTLoginButton = ({
  onClick,
  display,
  isClicked,
  isTarget,
  provider,
}: LoginButtonProps) => {
  return (
    <ButtonStyled
      onClick={() => onClick()}
      fontColor={display.fontColor}
      disabled={isClicked}
    >
      {isClicked && isTarget ? (
        <LoadingAnimation></LoadingAnimation>
      ) : (
        <>
          <IconContainer provider={provider}>{display.icon}</IconContainer>
          <TextContainer>42 Seoul 로그인</TextContainer>
        </>
      )}
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button<{ fontColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 15px;

  transition: all 0.2s ease;
  /* TODO: 필요? */

  &:active {
    transform: translateY(1px);
  }
  /* TODO: 필요? */

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const IconContainer = styled.div<{ provider: TLoginProvider }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 100%;
  margin-right: 15px;

  & > svg {
    width: 28px;
    height: 20px;
  }
`;

const TextContainer = styled.div`
  text-align: start;
  width: 100%;
  height: 100%;
  line-height: 1rem;
  font-size: 1rem;
  font-weight: 500;
`;

export default FTLoginButton;

// TODO : styled component 이름 컨벤션에 맞게 변경
