import "@/Cabinet/assets/css/loginPage.css";
import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";

const LoginPage = () => {
  // const ORIGIN_URL = window.location.origin;
  // const url = `${import.meta.env.VITE_BE_HOST}/v4/auth/login`;

  return (
    <LoginTemplate
      url={`${import.meta.env.VITE_BE_HOST}/oauth2/authorization/ft?redirect=${
        import.meta.env.VITE_BE_HOST
      }/login/oauth2/code/ft`}
      googleUrl={`${
        import.meta.env.VITE_BE_HOST
      }/oauth2/authorization/google?redirect=${
        import.meta.env.VITE_BE_HOST
      }/login/oauth2/code/google`}
      pageTitle="Cabi"
      pageSubTitle="여러분의 일상을 가볍게"
      imgSrc="/src/Cabinet/assets/images/loginImg.svg"
    />
  );
};

export default LoginPage;
