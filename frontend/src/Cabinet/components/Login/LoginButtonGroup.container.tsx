import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginButtonGroup from "@/Cabinet/components/Login/LoginButtonGroup";
import { oAuthErrorMsgMap } from "@/Cabinet/assets/data/maps";
import {
  TOAuthProvider,
  TOAuthProviderOrEmpty,
  ftProvider,
  socialOAuthProviders,
} from "@/Cabinet/assets/data/oAuth";
import { OAuthErrorType } from "@/Cabinet/types/enum/error.type.enum";
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
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();
  const messageParamValue = searchParams.get("message");
  const statusParamValue = searchParams.get("status");

  const getOAuthErrorMessage = (errorType: string | null) => {
    const defaultErrorMsg = "오류가 발생했습니다. 다시 시도해 주세요.";
    const isValidErrorType = Object.values(OAuthErrorType).includes(
      errorType as OAuthErrorType
    );
    if (errorType && isValidErrorType)
      return oAuthErrorMsgMap[errorType as OAuthErrorType];

    return defaultErrorMsg;
  };

  const handleOAuthError = () => {
    const alertMsg = getOAuthErrorMessage(messageParamValue);

    alert(alertMsg);
    navigator("/login");
  };

  useEffect(() => {
    if (statusParamValue && Number(statusParamValue) !== HttpStatusCode.Ok) {
      handleOAuthError();
    }
  }, []);

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
