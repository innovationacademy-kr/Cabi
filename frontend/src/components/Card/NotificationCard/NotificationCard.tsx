import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import PillButton from "@/components/Common/PillButton";
import ToggleSwitch from "@/components/Common/ToggleSwitch";

const NotificationCard = () => {
  return (
    <Card
      title={"알림"}
      gridArea="notification"
      width={"350px"}
      height={"215px"}
    >
      <CardContentWrapper>
        <CardContentStyled>
          <ContentInfoStyled>메일</ContentInfoStyled>
          <ToggleSwitch id={"email-notification"} checked={false} />
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>슬랙</ContentInfoStyled>
          <ToggleSwitch id={"slack-notification"} checked={false} />
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>브라우저</ContentInfoStyled>
          <ToggleSwitch id={"browser-notification"} checked={false} />
        </CardContentStyled>
      </CardContentWrapper>
    </Card>
  );
};

export default NotificationCard;
