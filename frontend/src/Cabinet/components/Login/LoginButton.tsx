import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { ISocialLoginConfig } from "@/Presentation/types/common/loginType";

interface LoginButtonProps {
  onLogin: () => void;
  display: ISocialLoginConfig["display"];
  isClicked: boolean;
  isTarget: boolean;
}

interface ButtonStyledProps {
  backgroundColor: string;
  fontColor: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  display,
  isClicked,
  isTarget,
}) => {
  return (
    <ButtonStyled
      onClick={onLogin}
      backgroundColor={display.backgroundColor}
      fontColor={display.fontColor}
      disabled={isClicked}
    >
      {isClicked && isTarget ? (
        <LoginAnimationContainer>
          <LoadingAnimation />
        </LoginAnimationContainer>
      ) : (
        <>
          <IconContainer>{display.icon}</IconContainer>
          <TextContainer>{display.text}</TextContainer>
        </>
      )}
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button<ButtonStyledProps>`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.fontColor};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border: none;
  border-radius: 4px;
  padding: 0 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(95%);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #c4c4c4;
    color: #ffffff;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  min-width: 36px;
  height: 100%;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  text-align: center;
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
