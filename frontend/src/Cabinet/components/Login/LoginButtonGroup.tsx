import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import FTLoginButton from "@/Cabinet/components/Login/FTLoginButton";
import SocialLoginButton from "@/Cabinet/components/Login/SocialLoginButton";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
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
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const allProviderAry = getAllOAuthProviders();
  const socialProviderAry: TOAuthProvider[] = allProviderAry.filter(
    (elem) => elem !== "42"
  );
  const messageParamValue = searchParams.get("message");
  const statusParamValue = searchParams.get("status");

  useEffect(() => {
    if (statusParamValue && Number(statusParamValue) !== HttpStatusCode.Ok) {
      let alertMsg = "오류가 발생했습니다. 다시 시도해 주세요.";

      if (messageParamValue === "NOT_FT_LINK_STATUS") {
        // code=Forbidden&status=403&message=NOT_FT_LINK_STATUS
        alertMsg =
          "아직 연결되지 않은 소셜 계정입니다. 계정을 연동한 후 다시 로그인해 주세요.";
      } else if (messageParamValue === "OAUTH_EMAIL_ALREADY_LINKED") {
        // code=Conflict&status=409&message=OAUTH_EMAIL_ALREADY_LINKED
        alertMsg =
          "이미 연결된 소셜 계정이 있습니다. 다른 계정을 사용하려면 기존 계정 연동을 해제해주세요.";
      }
      alert(alertMsg);
      navigator("/login");
    }
  }, []);

  const onLoginButtonClick = (provider: TOAuthProvider) => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    if (isLoggedOut) {
      window.location.replace(getOAuthRedirectUrl(provider) + "?prompt=login");
      localStorage.removeItem("isLoggedOut");
    } else {
      window.location.replace(getOAuthRedirectUrl(provider));
    }

    setLoginStatus({ isClicked: true, target: provider });
  };

  return (
    <LoginButtonGroupStyled>
      <FTLoginButton
        key="42"
        onLoginButtonClick={() => onLoginButtonClick("42")}
        display={getOAuthDisplayInfo("42")}
        isClicked={loginStatus.isClicked}
        isTarget={loginStatus.target === "42"}
        provider={"42"}
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
