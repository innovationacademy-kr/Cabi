import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginTemplate from "../components/templates/LoginTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppSelector } from "../redux/hooks";

const Login = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(user.intra_id);
  useEffect(() => {
    if (!(user.intra_id === "default")) {
      navigate("/main");
    }
  }, []);

  return (
    <>
      <ContentTemplate>
        <LoginTemplate />
      </ContentTemplate>
      <FooterTemplate />
    </>
  );
};

export default Login;
