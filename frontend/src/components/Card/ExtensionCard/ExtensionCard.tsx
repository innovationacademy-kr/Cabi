import Card, { IButtonProps } from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDeatilStyled,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import { LentExtensionDto } from "@/types/dto/lent.dto";
import { formatDate } from "@/utils/dateUtils";

interface ExtensionProps {
  extensionInfo: LentExtensionDto | null;
  button: IButtonProps;
}

const ExtensionCard = ({ extensionInfo, button }: ExtensionProps) => {
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
            {!!extensionInfo
              ? formatDate(new Date(extensionInfo.expiredAt), ".")
              : "-"}
          </ContentDeatilStyled>
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>연장 기간</ContentInfoStyled>
          <ContentDeatilStyled>
            {!!extensionInfo ? extensionInfo.extensionPeriod + "일" : "-"}
          </ContentDeatilStyled>
        </CardContentStyled>
      </CardContentWrapper>
    </Card>
  );
};

export default ExtensionCard;
