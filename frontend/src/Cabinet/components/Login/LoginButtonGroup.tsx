import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import FTLoginButton from "@/Cabinet/components/Login/FTLoginButton";
import SocialLoginButton from "@/Cabinet/components/Login/SocialLoginButton";
import { oAuthErrorMsgMap } from "@/Cabinet/assets/data/maps";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { OAuthErrorType } from "@/Cabinet/types/enum/error.type.enum";
import {
  getAllOAuthProviders,
  getOAuthDisplayInfo,
  getOAuthRedirectUrl,
} from "@/Cabinet/utils/oAuthUtils";

const LoginButtonGroup = () => {
  const [loginStatus, setLoginStatus] = useState<{
    isClicked: boolean;
    target: TOAuthProvider | null;
  }>({
    isClicked: false,
    target: null,
  });
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();
  const messageParamValue = searchParams.get("message");
  const statusParamValue = searchParams.get("status");
  const allProviderAry = getAllOAuthProviders();
  const socialProviderAry: TOAuthProvider[] = allProviderAry.filter(
    (elem) => elem !== "42"
  );
  const ftProvider = allProviderAry[0];
  // TODO : 위 변수들 선언 순서 바꾸기

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

  const onLoginButtonClick = (provider: TOAuthProvider) => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";
    const redirectUrl = getOAuthRedirectUrl(provider);

    if (isLoggedOut) {
      window.location.replace(redirectUrl + "?prompt=login");
      localStorage.removeItem("isLoggedOut");
    } else {
      window.location.replace(redirectUrl);
    }

    setLoginStatus({ isClicked: true, target: provider });
  };

  return (
    <LoginButtonGroupStyled>
      <FTLoginButton
        key={ftProvider}
        onLoginButtonClick={() => onLoginButtonClick(ftProvider)}
        display={getOAuthDisplayInfo(ftProvider)}
        isClicked={loginStatus.isClicked}
        isTarget={loginStatus.target === ftProvider}
        provider={ftProvider}
      />
      <SocialLoginButtonGroupWrapper>
        {socialProviderAry.map((provider) => (
          <SocialLoginButton
            key={provider}
            onLoginButtonClick={() => onLoginButtonClick(provider)}
            display={getOAuthDisplayInfo(provider)}
            isClicked={loginStatus.isClicked}
            isTarget={loginStatus.target === provider}
            provider={provider}
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
