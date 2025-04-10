import { useState } from "react";
import LoginButtonGroup from "@/Cabinet/components/Login/LoginButtonGroup";
import {
  TOAuthProvider,
  TOAuthProviderOrEmpty,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import useOAuth from "@/Cabinet/hooks/useOAuth";

export interface ILoginStatus {
  isClicked: boolean;
  target: TOAuthProviderOrEmpty;
}

const LoginButtonGroupContainer = () => {
  const [loginStatus, setLoginStatus] = useState<ILoginStatus>({
    isClicked: false,
    target: "",
  });
  const { handleOAuthRedirect } = useOAuth();

  // TODO : target으로 설정하면 괜찮지 않을까? atom
  const onLoginButtonClick = (provider: TOAuthProvider) => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    setLoginStatus({ isClicked: true, target: provider });
    handleOAuthRedirect(provider, isLoggedOut, () =>
      localStorage.removeItem("isLoggedOut")
    );
  };

  return (
    <LoginButtonGroup
      ftProvider={ftProvider}
      onLoginButtonClick={onLoginButtonClick}
      loginStatus={loginStatus}
      socialProviderAry={socialOAuthProviders}
    />
  );
};

export default LoginButtonGroupContainer;
