import "@/Cabinet/assets/css/loginPage.css";
import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";
import useOAuthStatus from "@/Cabinet/hooks/useOAuthStatus";

const LoginPage = () => {
  useOAuthStatus();
  // TODO : 렌더링될때마다 useOAuthStatus가 실행되는지 확인 필요

  return <LoginTemplate />;
};

export default LoginPage;
