import styled from "styled-components";
import FTLoginButton from "@/Cabinet/components/Login/FTLoginButton";
import { ILoginButtonStatus } from "@/Cabinet/components/Login/LoginButtonGroup.container";
import SocialLoginButton from "@/Cabinet/components/Login/SocialLoginButton";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { getOAuthDisplayInfo } from "@/Cabinet/utils/oAuthUtils";

const LoginButtonGroup = ({
  ftProvider,
  onLoginButtonClick,
  loginButtonStatus,
  socialProviderAry,
}: {
  ftProvider: TOAuthProvider;
  onLoginButtonClick: (provider: TOAuthProvider) => void;
  loginButtonStatus: ILoginButtonStatus;
  socialProviderAry: TOAuthProvider[];
}) => {
  return (
    <LoginButtonGroupStyled>
      <FTLoginButton
        key={ftProvider}
        provider={ftProvider}
        display={getOAuthDisplayInfo(ftProvider)}
        onLoginButtonClick={() => onLoginButtonClick(ftProvider)}
        isClicked={loginButtonStatus.isClicked}
        isTarget={loginButtonStatus.target === ftProvider}
      />
      <SocialLoginButtonGroupWrapper>
        {socialProviderAry.map((provider) => (
          <SocialLoginButton
            key={provider}
            provider={provider}
            display={getOAuthDisplayInfo(provider)}
            onLoginButtonClick={() => onLoginButtonClick(provider)}
            isClicked={loginButtonStatus.isClicked}
            isTarget={loginButtonStatus.target === provider}
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
