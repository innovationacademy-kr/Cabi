import { useState } from "react";
import LoginButtonGroup from "@/Cabinet/components/Login/LoginButtonGroup";
import {
  TOAuthProvider,
  TOAuthProviderOrEmpty,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import useOAuth from "@/Cabinet/hooks/useOAuth";

export interface ILoginButtonStatus {
  isClicked: boolean;
  target: TOAuthProviderOrEmpty;
}

const LoginButtonGroupContainer = () => {
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
    <LoginButtonGroup
      ftProvider={ftProvider}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonStatus={loginButtonStatus}
      socialProviderAry={socialOAuthProviders}
    />
  );
};

export default LoginButtonGroupContainer;
