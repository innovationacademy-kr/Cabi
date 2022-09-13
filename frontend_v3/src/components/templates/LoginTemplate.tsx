import styled from "@emotion/styled";
import LoginButton from "../atoms/buttons/LoginButton";

const Container = styled.section`
  min-height: 70vh;
  text-align: center;

  > img {
    height: 13rem;
    object-fit: scale-down;
    margin-bottom: 8rem;
  }
  > a:hover {
    color: white;
    background-color: #d8d4d44b;
  }
  > a:active {
    color: white;
    background-color: #d8d4d44b;
  }
`;

const LoginTemplate = (): JSX.Element => {
  return (
    <Container>
      <img src="/img/logo.png" alt="logo" />
      <LoginButton />
    </Container>
  );
};

export default LoginTemplate;
