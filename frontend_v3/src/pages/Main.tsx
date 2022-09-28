import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CabinetTemplate from "../components/templates/CabinetTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppSelector } from "../redux/hooks";

const Main = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.intra_id === "default") navigate("/");
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
