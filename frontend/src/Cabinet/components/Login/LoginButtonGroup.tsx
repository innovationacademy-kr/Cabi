import { useState } from "react";
import styled from "styled-components";
import { TLoginProvider } from "@/Cabinet/assets/data/login";
import {
  getEnabledProviders,
  getSocialAuthUrl,
  getSocialDisplayInfo,
} from "@/Cabinet/utils/loginUtils";
import LoginButton from "./LoginButton";

const LoginButtonGroup = () => {
  const [loginStatus, setLoginStatus] = useState<{
    isClicked: boolean;
    target: TLoginProvider | null;
  }>({
    isClicked: false,
    target: null,
  });

  return (
    <LoginButtonGroupStyled>
      {getEnabledProviders().map((provider) => (
        <LoginButton
          key={provider}
          onLogin={() => {
            const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

            if (isLoggedOut) {
              window.location.replace(
                getSocialAuthUrl(provider) + "?prompt=login"
              );
              localStorage.removeItem("isLoggedOut");
            } else {
              window.location.replace(getSocialAuthUrl(provider));
            }

            setLoginStatus({ isClicked: true, target: provider });
          }}
          display={getSocialDisplayInfo(provider)}
          isClicked={loginStatus.isClicked}
          isTarget={loginStatus.target === provider}
        />
      ))}
    </LoginButtonGroupStyled>
  );
};

const LoginButtonGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default LoginButtonGroup;
