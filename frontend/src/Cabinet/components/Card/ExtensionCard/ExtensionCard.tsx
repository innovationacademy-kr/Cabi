import { useState } from "react";
import Card, { IButtonProps } from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDetailStyled,
  ContentInfoStyled,
} from "@/Cabinet/components/Card/CardStyles";
import { NotificationModal } from "@/Cabinet/components/Modals/NotificationModal/NotificationModal";
import { LentExtensionDto } from "@/Cabinet/types/dto/lent.dto";
import { formatDate } from "@/Cabinet/utils/dateUtils";

interface ExtensionProps {
  extensionInfo: LentExtensionDto | null;
  button: IButtonProps;
}

const NotificationModalDetail = `연장권은 매월 2일 제공되며,<br/>이전에 받은 연장권은 사용이 불가능 합니다.<br/>24HANE 기준 160시간을 출석한 경우,<br/> 연장권이 부여됩니다.`;

const ExtensionCard = ({ extensionInfo, button }: ExtensionProps) => {
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  return (
    <>
      <Card
        title={"연장권"}
        onClickToolTip={() => {
          setShowNotificationModal(true);
        }}
        gridArea={"extension"}
        width={"350px"}
        height={"183px"}
        buttons={[button]}
      >
        <CardContentWrapper>
          <CardContentStyled>
            <ContentInfoStyled>사용 기한</ContentInfoStyled>
            <ContentDetailStyled>
              {!!extensionInfo
                ? formatDate(new Date(extensionInfo.expiredAt), ".", 4, 2, 2)
                : "-"}
            </ContentDetailStyled>
          </CardContentStyled>
          <CardContentStyled>
            <ContentInfoStyled>연장 기간</ContentInfoStyled>
            <ContentDetailStyled>
              {!!extensionInfo ? extensionInfo.extensionPeriod + "일" : "-"}
            </ContentDetailStyled>
          </CardContentStyled>
        </CardContentWrapper>
      </Card>
      {showNotificationModal && (
        <NotificationModal
          title={"연장권 안내"}
          detail={NotificationModalDetail}
          closeModal={() => setShowNotificationModal(false)}
        />
      )}
    </>
  );
};

export default ExtensionCard;
