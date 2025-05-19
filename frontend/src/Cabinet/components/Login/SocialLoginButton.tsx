import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { ILoginButtonProps } from "@/Cabinet/components/Login/FTLoginButton";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";

const SocialLoginButton = ({
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
    cursor: not-allowed;
  }
`;

const IconWrapperStyled = styled.div<{ provider: TOAuthProvider }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  & > svg {
    width: 20px;
  }
`;

const LoadingAnimationWrapper = styled.div`
  & > div {
    transform: scale(0.5);
  }
`;

export default SocialLoginButton;
