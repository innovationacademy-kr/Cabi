import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import LoginButton from "@/Cabinet/components/Login/LoginButton";
import { TLoginProvider } from "@/Cabinet/assets/data/login";
import {
  getEnabledProviders,
  getSocialAuthUrl,
  getSocialDisplayInfo,
} from "@/Cabinet/utils/loginUtils";

const LoginButtonGroup = () => {
  const [loginStatus, setLoginStatus] = useState<{
    isClicked: boolean;
    target: TLoginProvider | null;
  }>({
    isClicked: false,
    target: null,
  });
  const [searchParams] = useSearchParams();
  const messageParamValue = searchParams.get("message");
  const statusParamValue = searchParams.get("status");
  const navigator = useNavigate();

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
