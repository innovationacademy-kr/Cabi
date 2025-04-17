import styled from "styled-components";
import LoginButton from "@/Cabinet/components/Login/LoginButton";
import { ftProvider, socialOAuthProviders } from "@/Cabinet/assets/data/oAuth";

const LoginButtonGroup = () => {
  return (
    <LoginButtonGroupStyled>
      <LoginButton provider={ftProvider} />
      <SocialLoginButtonGroupWrapper>
        {socialOAuthProviders.map((provider) => (
          <LoginButton key={provider} provider={provider} isSocial={true} />
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
