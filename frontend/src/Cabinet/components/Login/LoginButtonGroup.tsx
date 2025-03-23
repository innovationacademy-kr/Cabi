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
  const navigator = useNavigate();

  useEffect(() => {
    if (messageParamValue === "NOT_FT_LINK_STATUS") {
      // code=Forbidden&status=403&message=NOT_FT_LINK_STATUS
      alert(
        "아직 연결되지 않은 소셜 계정입니다. 계정을 연동한 후 다시 로그인해 주세요."
      );
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
