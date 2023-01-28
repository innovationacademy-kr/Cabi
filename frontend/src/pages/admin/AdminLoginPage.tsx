import "@/assets/css/loginPage.css";
import LoginTemplate from "@/components/Login/LoginTemplate";

const LoginPage = () => {
  const url = `${import.meta.env.VITE_BE_HOST}/api/admin/auth/login`;

  return (
    <LoginTemplate
      url={url}
      pageTitle="42Cabi Admin"
      pageSubTitle="관리자 페이지"
      imgSrc="/src/assets/images/adminLoginImg.svg"
    />
  );
};

export default LoginPage;
