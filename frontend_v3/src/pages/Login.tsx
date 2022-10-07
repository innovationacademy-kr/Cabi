import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import LoginTemplate from "../components/templates/LoginTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getCookie } from "../network/react-cookie/cookie";
import { userInfoInitialize } from "../redux/slices/userSlice";

const Login = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  console.log(user.intra_id);
  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) {
      dispatch(userInfoInitialize());
    }
    if (token && !(user.intra_id === "default")) {
      navigate("/main");
    } else {
      navigate("/");
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
