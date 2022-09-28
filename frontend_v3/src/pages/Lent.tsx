import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LentTemplate from "../components/templates/LentTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import ContentTemplate from "../components/templates/ContentTemplate";
import { useAppSelector } from "../redux/hooks";

const Lent = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.intra_id === "default" || user.cabinet_id === -1) navigate("/");
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
