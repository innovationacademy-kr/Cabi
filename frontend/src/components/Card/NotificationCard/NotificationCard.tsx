import Card, { IButtonProps } from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import ToggleSwitch from "@/components/Common/ToggleSwitch";
import { AlarmInfo } from "@/types/dto/alarm.dto";

interface NotificationCardProps {
  alarm: AlarmInfo;
  buttons: IButtonProps[];
  onToggleChange: (type: keyof AlarmInfo, checked: boolean) => void;
}

const NotificationCard = ({
  alarm,
  buttons,
  onToggleChange,
}: NotificationCardProps) => {
  const handleToggle = (type: keyof AlarmInfo) => (checked: boolean) => {
    onToggleChange(type, checked);
  };

  const renderToggle = (type: keyof AlarmInfo, label: string) => (
    <CardContentStyled>
      <ContentInfoStyled>{label}</ContentInfoStyled>
      <ToggleSwitch
        id={`${type}-notification`}
        checked={alarm[type]}
        onChange={handleToggle(type)}
      />
    </CardContentStyled>
  );

  return (
    <Card
      title={"알림"}
      gridArea="notification"
      width={"350px"}
      height={"230px"}
      buttons={buttons}
    >
      <CardContentWrapper>
        {renderToggle("email", "메일")}
        {renderToggle("slack", "슬랙")}
        {renderToggle("push", "브라우저")}
      </CardContentWrapper>
    </Card>
  );
};

export default NotificationCard;
