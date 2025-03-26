import styled from "styled-components";
import FTLoginButton from "@/Cabinet/components/Login/FTLoginButton";
import SocialLoginButton from "@/Cabinet/components/Login/SocialLoginButton";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

const LoginButtonGroup = ({
  ftProvider,
  onLoginButtonClick,
  loginStatus,
  socialProviderAry,
}: {
  ftProvider: TOAuthProvider;
  onLoginButtonClick: (provider: TOAuthProvider) => void;
  loginStatus: {
    isClicked: boolean;
    target: TOAuthProvider | null;
  };
  // TODO : onLoginButtonClick 타입 정의?
  socialProviderAry: TOAuthProvider[];
}) => {
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
