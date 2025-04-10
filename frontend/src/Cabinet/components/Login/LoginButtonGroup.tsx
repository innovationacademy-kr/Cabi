import { useState } from "react";
import styled from "styled-components";
import FTLoginButton from "@/Cabinet/components/Login/FTLoginButton";
import SocialLoginButton from "@/Cabinet/components/Login/SocialLoginButton";
import {
  TOAuthProvider,
  TOAuthProviderOrEmpty,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import useOAuth from "@/Cabinet/hooks/useOAuth";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

export interface ILoginButtonStatus {
  isClicked: boolean;
  target: TOAuthProviderOrEmpty;
}

const LoginButtonGroup = () => {
  const [loginButtonStatus, setLoginButtonStatus] =
    useState<ILoginButtonStatus>({
      isClicked: false,
      target: "",
    });
  const { handleOAuthRedirect } = useOAuth();

  // TODO : target으로 설정하면 괜찮지 않을까? atom
  // TODO : useoauth로?
  const onLoginButtonClick = (provider: TOAuthProvider) => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    setLoginButtonStatus({ isClicked: true, target: provider });
    handleOAuthRedirect(provider, isLoggedOut, () =>
      localStorage.removeItem("isLoggedOut")
    );
  };

  return (
    <LoginButtonGroupStyled>
      <FTLoginButton
        key={ftProvider}
        provider={ftProvider}
        display={getOAuthDisplayInfo(ftProvider)}
        onLoginButtonClick={() => onLoginButtonClick(ftProvider)}
        isClicked={loginButtonStatus.isClicked}
        isTarget={loginButtonStatus.target === ftProvider}
      />
      <SocialLoginButtonGroupWrapper>
        {socialOAuthProviders.map((provider) => (
          <SocialLoginButton
            key={provider}
            provider={provider}
            display={getOAuthDisplayInfo(provider)}
            onLoginButtonClick={() => onLoginButtonClick(provider)}
            isClicked={loginButtonStatus.isClicked}
            isTarget={loginButtonStatus.target === provider}
          />
        ))}
      </SocialLoginButtonGroupWrapper>
    </LoginButtonGroupStyled>
  );
};

const LoginButtonGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
`;

const SocialLoginButtonGroupWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
  width: 200px;
  height: 40px;
`;

export default LoginButtonGroup;
