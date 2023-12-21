import Card, { IButtonProps } from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import ToggleSwitch from "@/components/Common/ToggleSwitch";
import { AlarmInfo } from "@/types/dto/alarm.dto";

interface NotificationCardProps {
  alarm: AlarmInfo | null;
  buttons: IButtonProps[];
  onToggleChange: (newAlarms: AlarmInfo) => void;
}

const NotificationCard = ({
  alarm,
  buttons,
  onToggleChange,
}: NotificationCardProps) => {
  const handleToggle = (type: keyof AlarmInfo, checked: boolean) => {
    if (!alarm) return;
    const newAlarms = { ...alarm, [type]: checked };
    onToggleChange(newAlarms);
  };
  return (
    <Card
      title={"알림"}
      gridArea="notification"
      width={"350px"}
      height={"230px"}
      buttons={buttons}
    >
      <CardContentWrapper>
        <CardContentStyled>
          <ContentInfoStyled>메일</ContentInfoStyled>
          <ToggleSwitch
            id={"email-notification"}
            checked={alarm?.email ?? false}
            onChange={(value) => handleToggle("email", value)}
          />
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>슬랙</ContentInfoStyled>
          <ToggleSwitch
            id={"slack-notification"}
            checked={alarm?.slack ?? false}
            onChange={(value) => handleToggle("slack", value)}
          />
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>브라우저</ContentInfoStyled>
          <ToggleSwitch
            id={"browser-push-notification"}
            checked={alarm?.push ?? false}
            onChange={(value) => handleToggle("push", value)}
          />
        </CardContentStyled>
      </CardContentWrapper>
    </Card>
  );
};

export default NotificationCard;
