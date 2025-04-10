import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { IOAuthDisplay, TOAuthProvider } from "@/Cabinet/assets/data/oAuth";

export interface ILoginButtonProps {
  provider: TOAuthProvider;
  display: IOAuthDisplay;
  onLoginButtonClick: (provider: TOAuthProvider) => void;
  isClicked: boolean;
  isTarget: boolean;
}

const FTLoginButton = ({
  provider,
  display,
  onLoginButtonClick,
  isClicked,
  isTarget,
}: ILoginButtonProps) => {
  return (
    <ButtonWrapperStyled
      onClick={() => onLoginButtonClick(provider)}
      disabled={isClicked}
    >
      {isClicked && isTarget ? (
        <LoadingAnimation />
      ) : (
        <>
          <IconWrapperStyled provider={provider}>
            {display.icon}
          </IconWrapperStyled>
          <TextWrapperStyled>
            {display.text + " Seoul 로그인"}
          </TextWrapperStyled>
        </>
      )}
    </ButtonWrapperStyled>
  );
};

const ButtonWrapperStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 15px;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconWrapperStyled = styled.div<{ provider: TOAuthProvider }>`
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
