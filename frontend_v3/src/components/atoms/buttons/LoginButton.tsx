import style from "@emotion/styled";

const Button = style.a`
  display: block;
  width: 30%;
  color: white;
  font-weight: bolder;
  border: white 0.2rem solid;
  border-radius: 1rem;
  padding: 0.8rem 3rem;
`;

const LoginButton = (): JSX.Element => {
  const url = "/auth/login";
  return <Button href={url}>L O G I N</Button>;
};

export default LoginButton;
