import "@/assets/css/loginPage.css";
import AdminLoginTemplate from "@/components/Login/AdminLoginTemplate";

const LoginPage = () => {
  const url = `${import.meta.env.VITE_BE_HOST}/api/admin/auth/login`;

  return (
    <AdminLoginTemplate
      url={url}
      pageTitle="42Cabi Admin"
      pageSubTitle="관리자 페이지"
      imgSrc="/src/assets/images/adminLoginImg.svg"
    />
  );
};

export default LoginPage;
