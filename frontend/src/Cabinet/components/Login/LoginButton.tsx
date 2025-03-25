import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  ISocialLoginConfig,
  TLoginProvider,
} from "@/Cabinet/assets/data/login";

interface LoginButtonProps {
  onLogin: () => void;
  display: ISocialLoginConfig["display"];
  isClicked: boolean;
  isTarget: boolean;
  provider: TLoginProvider;
}

// TODO : FTLoginButton 참고해서 수정하기

const LoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  display,
  isClicked,
  isTarget,
  provider,
}) => {
  return (
    <ButtonStyled
      onClick={onLogin}
      backgroundColor={display.backgroundColor}
      disabled={isClicked}
    >
      {isClicked && isTarget ? (
        <LoginAnimationContainer>
          <LoadingAnimation />
        </LoginAnimationContainer>
      ) : (
        <IconContainer provider={provider}>{display.icon}</IconContainer>
      )}
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  padding: 0;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const IconContainer = styled.div<{ provider: TLoginProvider }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  & > svg > path {
    fill: ${(props) => props.provider === "github" && "#ffffff"};
  }
`;

const LoginAnimationContainer = styled.div`
  width: 30px;
  height: 24px;

  & > div {
    transform: scale(0.5);
    transform-origin: center center;
  }
`;

export default LoginButton;
