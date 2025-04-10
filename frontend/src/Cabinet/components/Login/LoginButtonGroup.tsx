import { useState } from "react";
import styled from "styled-components";
import LoginButton from "@/Cabinet/components/Login/LoginButton";
import {
  TOAuthProvider,
  TOAuthProviderOrEmpty,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import useOAuth from "@/Cabinet/hooks/useOAuth";

const LoginButtonGroup = () => {
  const [clickedProvider, setClickedProvider] =
    useState<TOAuthProviderOrEmpty>("");
  const { handleOAuthRedirect } = useOAuth();

  // TODO : target으로 설정하면 괜찮지 않을까? atom
  // TODO : useoauth로?
  const onLoginButtonClick = (provider: TOAuthProvider) => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    setClickedProvider(provider);
    handleOAuthRedirect(provider, isLoggedOut, () =>
      localStorage.removeItem("isLoggedOut")
    );
  };

  return (
    <LoginButtonGroupStyled>
      <LoginButton
        provider={ftProvider}
        onLoginButtonClick={() => onLoginButtonClick(ftProvider)}
        isClicked={!!clickedProvider}
        isTarget={clickedProvider === ftProvider}
      />
      <SocialLoginButtonGroupWrapper>
        {socialOAuthProviders.map((provider) => (
          <LoginButton
            key={provider}
            provider={provider}
            onLoginButtonClick={() => onLoginButtonClick(provider)}
            isClicked={!!clickedProvider}
            isTarget={clickedProvider === provider}
            isSocial={true}
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
