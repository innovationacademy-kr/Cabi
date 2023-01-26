import "@/assets/css/loginPage.css";
import LoginTemplate from "@/components/Login/LoginTemplate";

const LoginPage = () => {
  const url = `${import.meta.env.VITE_BE_HOST}/auth/login`;

  return (
    <LoginTemplate
      url={url}
      pageTitle="42Cabi"
      pageSubTitle="여러분의 일상을 가볍게"
    />
  );
};

export default LoginPage;
