import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CabinetTemplate from "../components/templates/CabinetTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { axiosMyInfo } from "../network/axios/axios.custom";
import { userAll } from "../redux/slices/userSlice";
import { getCookie } from "../network/react-cookie/cookie";

const Main = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = getCookie("accessToken");

  useEffect(() => {
    if (token) {
      if (user.intra_id === "default") {
        axiosMyInfo()
          .then((response) => {
            dispatch(userAll(response.data));
            if (response.data.cabinet_id !== -1) navigate("/lent");
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
