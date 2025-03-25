import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  ISocialLoginConfig,
  TLoginProvider,
} from "@/Cabinet/assets/data/login";

export interface ILoginButtonProps {
  onLoginButtonClick: (provider: TLoginProvider) => void;
  display: ISocialLoginConfig["display"];
  // TODO : display 타입 정의하기
  // TODO : display 이름 변경
  isClicked: boolean;
  isTarget: boolean;
  provider: TLoginProvider;
  // TODO : provider 이름 변경
}

const FTLoginButton = ({
  onLoginButtonClick,
  display,
  isClicked,
  isTarget,
  provider,
}: ILoginButtonProps) => {
  return (
    <ButtonWrapperStyled
      onClick={() => onLoginButtonClick(provider)}
      fontColor={display.fontColor}
      disabled={isClicked}
    >
      {isClicked && isTarget ? (
        <LoadingAnimation></LoadingAnimation>
      ) : (
        <>
          <IconWrapperStyled provider={provider}>
            {display.icon}
          </IconWrapperStyled>
          <TextWrapperStyled>{display.text}</TextWrapperStyled>
        </>
      )}
    </ButtonWrapperStyled>
  );
};

const ButtonWrapperStyled = styled.button<{ fontColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 15px;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const IconWrapperStyled = styled.div<{ provider: TLoginProvider }>`
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

const TextWrapperStyled = styled.div`
  text-align: start;
  width: 100%;
  height: 100%;
  line-height: 1rem;
  font-size: 1rem;
  font-weight: 500;
`;

export default FTLoginButton;
