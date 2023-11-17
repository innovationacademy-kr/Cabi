import Card, { IButtonProps } from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDeatilStyled,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import { getLastDayofMonthString } from "@/utils/dateUtils";

interface ExtensionProps {
  extensible: boolean;
  button: IButtonProps;
}

const ExtensionCard = ({ extensible, button }: ExtensionProps) => {
  return (
    <Card
      title={"연장권"}
      gridArea={"extension"}
      width={"350px"}
      height={"183px"}
      buttons={[button]}
    >
      <CardContentWrapper>
        <CardContentStyled>
          <ContentInfoStyled>사용 기한</ContentInfoStyled>
          <ContentDeatilStyled>
            {extensible ? getLastDayofMonthString(null, ".") : "-"}
          </ContentDeatilStyled>
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>연장 기간</ContentInfoStyled>
          <ContentDeatilStyled>
            {extensible
              ? parseInt(import.meta.env.VITE_EXTENDED_LENT_PERIOD) + "일"
              : "-"}
          </ContentDeatilStyled>
        </CardContentStyled>
      </CardContentWrapper>
    </Card>
  );
};

export default ExtensionCard;
