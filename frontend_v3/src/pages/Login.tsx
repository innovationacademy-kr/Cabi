import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import LoginTemplate from "../components/templates/LoginTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getCookie, setCookie } from "../network/react-cookie/cookie";
import { userInfoInitialize } from "../redux/slices/userSlice";
import qs from "qs";

const Login = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix : true,
  });
  const token: string = String(query['access_token']);

  useEffect(() => {
    // const token = getCookie("access_token");
    setCookie('access_token', token);
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
