import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  ISocialLoginConfig,
  TLoginProvider,
} from "@/Cabinet/assets/data/login";

interface ILoginButtonProps {
  onLoginButtonClick: (provider: TLoginProvider) => void;
  display: ISocialLoginConfig["display"];
  // TODO : display 타입 정의하기
  // TODO : display 이름 변경
  isClicked: boolean;
  isTarget: boolean;
  provider: TLoginProvider;
  // TODO : provider 이름 변경
}

// TODO : FTLoginButton 참고해서 수정하기

const LoginButton = ({
  onLoginButtonClick,
  display,
  isClicked,
  isTarget,
  provider,
}: ILoginButtonProps) => {
  return (
    <ButtonWrapperStyled
      onClick={() => onLoginButtonClick(provider)}
      backgroundColor={display.backgroundColor}
      disabled={isClicked}
    >
      {isClicked && isTarget ? (
        <LoadingAnimationWrapper>
          <LoadingAnimation />
        </LoadingAnimationWrapper>
      ) : (
        <IconWrapperStyled provider={provider}>
          {display.icon}
        </IconWrapperStyled>
      )}
    </ButtonWrapperStyled>
  );
};

const ButtonWrapperStyled = styled.button<{ backgroundColor: string }>`
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

const IconWrapperStyled = styled.div<{ provider: TLoginProvider }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  & > svg > path {
    fill: ${(props) => props.provider === "github" && "#ffffff"};
  }
`;

const LoadingAnimationWrapper = styled.div`
  & > div {
    transform: scale(0.5);
  }
`;

export default LoginButton;
