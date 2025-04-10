import { useRecoilValue } from "recoil";
import styled, { css } from "styled-components";
import { clickedLoginProviderState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import useOAuth from "@/Cabinet/hooks/useOAuth";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

interface ILoginButtonProps {
  provider: TOAuthProvider;
  isSocial?: boolean;
}

const LoginButton = ({ provider, isSocial = false }: ILoginButtonProps) => {
  const display = getOAuthDisplayInfo(provider);
  const clickedLoginProvider = useRecoilValue(clickedLoginProviderState);
  const isClicked = !!clickedLoginProvider;
  const { onLoginButtonClick } = useOAuth();
  const isTarget = clickedLoginProvider === provider;

  return (
    <ButtonWrapperStyled
      onClick={() => onLoginButtonClick(provider)}
      backgroundColor={display.backgroundColor}
      disabled={isClicked}
      isSocial={isSocial}
    >
      {isClicked && isTarget ? (
        <LoadingAnimationWrapper isSocial={isSocial}>
          <LoadingAnimation />
        </LoadingAnimationWrapper>
      ) : (
        <>
          <IconWrapperStyled provider={provider} isSocial={isSocial}>
            {display.icon}
          </IconWrapperStyled>
          {!isSocial && (
            <TextWrapperStyled>
              {display.text + " Seoul 로그인"}
            </TextWrapperStyled>
          )}
        </>
      )}
    </ButtonWrapperStyled>
  );
};

const ButtonWrapperStyled = styled.button<{
  backgroundColor: string;
  isSocial: boolean;
}>`
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
  }

  ${(props) =>
    props.isSocial
      ? css`
          padding: 0;
          height: 40px;
          width: 40px;
          border-radius: 50%;
        `
      : css`
          padding: 15px;
          height: 50px;
          &:active {
            transform: translateY(1px);
          }
        `}
`;

const LoadingAnimationWrapper = styled.div<{ isSocial: boolean }>`
  & > div {
    ${({ isSocial }) =>
      isSocial &&
      css`
        transform: scale(0.5);
      `}
  }
`;

const IconWrapperStyled = styled.div<{
  provider: TOAuthProvider;
  isSocial: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.isSocial
      ? css`
          width: 20px;
          height: 20px;

          & > svg {
            width: 20px;
          }
        `
      : css`
          width: 28px;
          height: 100%;
          margin-right: 15px;

          & > svg {
            width: 28px;
            height: 20px;
          }
        `}
`;

const TextWrapperStyled = styled.div`
  text-align: start;
  width: 100%;
  height: 100%;
  line-height: 1rem;
  font-size: 1rem;
  font-weight: 500;
`;

export default LoginButton;
