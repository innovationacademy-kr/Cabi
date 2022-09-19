import styled from "@emotion/styled";
import LoginButton from "../atoms/buttons/LoginButton";

const LoginSection = styled.section`
  height: 90vh;
  text-align: center;

  > img {
    height: 13rem;
    object-fit: scale-down;
    padding: 10rem 0;
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
