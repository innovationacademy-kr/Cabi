import "@/Cabinet/assets/css/loginPage.css";
import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";
import useOAuthStatus from "@/Cabinet/hooks/useOAuthStatus";

const LoginPage = () => {
  useOAuthStatus();

  return <LoginTemplate />;
};

export default LoginPage;
