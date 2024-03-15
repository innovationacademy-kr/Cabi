import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";
import "@/Cabinet/assets/css/loginPage.css";

const LoginPage = () => {
  const ORIGIN_URL = window.location.origin;
  const url = `${import.meta.env.VITE_BE_HOST}/v4/auth/login`;

  return (
    <LoginTemplate
      url={`${url}?redirect=${ORIGIN_URL}/post-login`}
      pageTitle="Cabi"
      pageSubTitle="여러분의 일상을 가볍게"
      imgSrc="/src/Cabinet/assets/images/loginImg.svg"
    />
  );
};

export default LoginPage;
