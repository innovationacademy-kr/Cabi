import style from "@emotion/styled";

const Button = style.a`
  color: white;
  font-weight: bolder;
  border: white 0.2rem solid;
  border-radius: 1rem;
  padding: 0.8rem 5rem;
`;

const LoginButton = (): JSX.Element => {
  const url = "/auth/login";
  return <Button href={url}>L O G I N</Button>;
};

export default LoginButton;
