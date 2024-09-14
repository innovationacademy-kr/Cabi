import Card, { IButtonProps } from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/Cabinet/components/Card/CardStyles";
import ToggleSwitch from "@/Cabinet/components/Common/ToggleSwitch";
import { AlarmInfo } from "@/Cabinet/types/dto/alarm.dto";

interface AlarmCardProps {
  alarm: AlarmInfo;
  buttons: IButtonProps[];
  onToggleChange: (type: keyof AlarmInfo, checked: boolean) => void;
}

const AlarmCard = ({ alarm, buttons, onToggleChange }: AlarmCardProps) => {
  const handleToggle = (type: keyof AlarmInfo) => (checked: boolean) => {
    onToggleChange(type, checked);
  };

  const renderToggle = (type: keyof AlarmInfo, label: string) => (
    <CardContentStyled>
      <ContentInfoStyled>{label}</ContentInfoStyled>
      <ToggleSwitch
        id={`${type}-alarm`}
        checked={alarm[type]}
        onChange={handleToggle(type)}
      />
    </CardContentStyled>
  );

  return (
    <Card
      title={"알림"}
      gridArea="alarm"
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

export default AlarmCard;
