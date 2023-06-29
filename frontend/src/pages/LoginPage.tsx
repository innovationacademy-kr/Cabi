import LoginTemplate from "@/components/Login/LoginTemplate";
import "@/assets/css/loginPage.css";

const LoginPage = () => {
  const url = `${import.meta.env.VITE_BE_HOST}/v4/auth/login`;

  return (
    <LoginTemplate
      url={url}
      pageTitle="42Cabi"
      pageSubTitle="여러분의 일상을 가볍게"
      imgSrc="/src/assets/images/loginImg.svg"
    />
  );
};

export default LoginPage;
