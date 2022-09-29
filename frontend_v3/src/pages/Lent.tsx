import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LentTemplate from "../components/templates/LentTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { getCookie } from "../network/react-cookie/cookie";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { userAll } from "../redux/slices/userSlice";
import { axiosMyInfo } from "../network/axios/axios.custom";

const Lent = (): JSX.Element => {
  const token = getCookie("accessToken");
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token && user.intra_id === "default") {
      axiosMyInfo()
        .then((response) => {
          dispatch(userAll(response.data));
        })
        .catch((error) => {
          navigate("/");
        });
    } else if (user.intra_id === "default" || user.cabinet_id === -1)
      navigate("/");
  }, []);

  return (
    <>
      <ContentTemplate>
        <LentTemplate />
      </ContentTemplate>
      <FooterTemplate />
    </>
  );
};

export default Lent;
