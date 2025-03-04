import "@/Cabinet/assets/css/loginPage.css";
import AdminLoginTemplate from "@/Cabinet/components/Login/AdminLoginTemplate";

const LoginPage = () => {
  const url = `${import.meta.env.VITE_BE_HOST}/v4/admin/auth/login`;

  return (
    <AdminLoginTemplate
      url={url}
      pageTitle="Cabi Admin"
      pageSubTitle="관리자 페이지"
      imgSrc="/src/Cabinet/assets/images/adminLoginImg.svg"
    />
  );
};

export default LoginPage;
