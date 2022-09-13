import style from "@emotion/styled";

const LoginButton = (): JSX.Element => {
  const url = "/auth/login";
  const Button = style.a`
    color: white;
    font-weight: bolder;
    border: white 0.2rem solid;
    border-radius: 1rem;
    padding: 0.8rem;
    padding-left: 5rem;
    padding-right: 5rem;
  `;
  return <Button href={url}>L O G I N</Button>;
};

export default LoginButton;
