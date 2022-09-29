import styled from "@emotion/styled";
import LoginButton from "../atoms/buttons/LoginButton";

const LoginSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  text-align: center;

  > img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 5rem;
  }

  > a:hover,
  active {
    color: white;
    background-color: #d8d4d44b;
  }
`;

const LoginTemplate = (): JSX.Element => {
  return (
    <LoginSection>
      <img src="/img/logo.png" alt="logo" />
      <LoginButton />
    </LoginSection>
  );
};

export default LoginTemplate;
