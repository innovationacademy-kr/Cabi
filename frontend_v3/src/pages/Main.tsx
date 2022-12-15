import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CabinetTemplate from "../components/templates/CabinetTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { axiosMyInfo } from "../network/axios/axios.custom";
import { setUserCabinet, userAll } from "../redux/slices/userSlice";
import { getCookie, setCookie } from "../network/react-cookie/cookie";

const Main = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const queryToken = query.get('access_token');

    let is_token = false;
    if (queryToken) {
      setCookie('access_token', queryToken);
      is_token = true;
    } else {
      const cookieToken = getCookie("access_token");
      if (cookieToken) {
        is_token = true;
      } else {
        navigate('/');
      }
    }

    if (is_token) {
      if (user.intra_id === "default") {
        axiosMyInfo()
        .then((response) => {
            dispatch(userAll(response.data));
            if (response.data.cabinet_id !== -1) navigate("/lent");
          })
          .catch((error) => {
            navigate("/");
          });
        } else {
          axiosMyInfo()
          .then((response) => {
            dispatch(setUserCabinet(response.data.cabinet_id));
          })
          .catch((error) => {
            navigate("/");
          });
      }
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      <ContentTemplate>
        <CabinetTemplate />
      </ContentTemplate>
      <FooterTemplate />
    </>
  );
};

export default Main;
