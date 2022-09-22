import LentTemplate from "../components/templates/LentTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import Carousel from "../sample/Carousel/Carousel";
import ContentTemplate from "../components/templates/ContentTemplate";

const Lent = (): JSX.Element => {
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
