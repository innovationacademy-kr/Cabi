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

interface ButtonStyledProps {
  backgroundColor: string;
  fontColor: string;
}

const FTLoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  display,
  isClicked,
  isTarget,
  provider,
}) => {
  return (
    <ButtonStyled onClick={() => onClick()} disabled={isClicked}>
      {isClicked && isTarget ? (
        <LoadingAnimation></LoadingAnimation>
      ) : (
        <>
          <IconContainer provider={provider}>{display.icon}</IconContainer>
          <TextContainer>42 Seoul 로그인</TextContainer>
        </>
      )}
      {/* TODO : isTarget 필요? */}
    </ButtonStyled>
  );
};
// <ButtonStyled
//   onClick={onClick}
//   backgroundColor={display.backgroundColor}
//   fontColor={display.fontColor}
//   disabled={isClicked}
// >

//   {isClicked && isTarget ? (
//     <LoginAnimationContainer>
//       <LoadingAnimation />
//     </LoginAnimationContainer>
//   ) : (
//     <>
//       <IconContainer provider={provider}>{display.icon}</IconContainer>
//       <TextContainer>42 Seoul 로그인</TextContainer>
//     </>
//   )}
// </ButtonStyled>

const FTLoginButtonStyled = styled.button`
  background-color: var(--sys-main-color);
  /* TODO : index.css button style 참고 */
`;

// const ButtonStyled = styled.button<ButtonStyledProps>`
const ButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 15px;

  transition: all 0.2s ease;
  /* TODO: 필요? */

  /* &:hover {
    filter: brightness(95%);
  } */

  &:active {
    transform: translateY(1px);
  }

  /* &:disabled {
    background-color: #c4c4c4;
    color: #ffffff;
  } */
`;

const IconContainer = styled.div<{ provider: TLoginProvider }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  min-width: 28px;
  /* TODO : 필요없으면 삭제 */
  height: 100%;
  background-color: blue;
  margin-right: 15px;

  & > svg {
    width: 28px;
    height: 20px;
  }

  & > svg > path {
    fill: ${(props) => props.provider === "github" && "#ffffff"};
  }
`;

const TextContainer = styled.div`
  text-align: start;
  width: 100%;
  background-color: purple;
  height: 100%;
  line-height: 1rem;
  font-size: 1rem;
  font-weight: 500;
`;

const LoginAnimationContainer = styled.div`
  width: 30px;
  height: 24px;

  & > div {
    transform: scale(0.5);
    transform-origin: center center;
  }
`;

export default FTLoginButton;
